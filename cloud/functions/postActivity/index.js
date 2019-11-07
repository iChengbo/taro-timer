// 云函数入口文件
const cloud = require("wx-server-sdk");
const _ = require("lodash");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const activityCollection = db.collection("activity");

const ACTIVITY_TYPE = {
    SIGN: 1,
}


// 云函数入口函数
exports.main = async (event, context) => {
    const { OPENID } = cloud.getWXContext();
    const { type } = event;
    console.log('event: ', OPENID, event);

    let crtTime = +Date.now() + 8 * 60 * 60 * 1000;
    let crtDate = new Date(crtTime);
    let year = crtDate.getFullYear(), month = crtDate.getMonth() + 1, day = crtDate.getDate();
    let YMD = year + '/' + month + '/' + day;
    console.log('当前时间', crtDate, crtDate, `${year}/${month}/${day}`);

    try {
        const [activityRecord] = (await activityCollection.where({
            openId: OPENID
        }).get()).data;

        if (!activityRecord) {
            console.log("新增");
            await activityCollection.add({
                data: {
                    openId: OPENID,
                    createdTime: db.serverDate(),
                    signList: [YMD],
                    lastestSign: YMD,
                    continueDay: 1,
                    gold: 1,
                },
            })
            return {
                signList: [YMD],
                lastestSign: YMD,
                continueDay: 1,
                gold: 1
            }
        } else {
            console.log("修改", OPENID);
            switch (type) {
                case ACTIVITY_TYPE.SIGN:
                    let signList = activityRecord.signList;
                    signList = _.uniq(signList.concat(YMD))
                    let lastestSign = activityRecord.lastestSign;
                    let continueDay = activityRecord.continueDay;
                    let isContinue = !(new Date(year + '/' + month + '/' + (day - 1))) - (new Date(lastestSign));
                    console.log('是否是连续签到', new Date(year + '/' + month + '/' + (day - 1))) - (new Date(lastestSign))
                    // 连续签到
                    if (isContinue) {
                        if (YMD != lastestSign) {
                            continueDay += 1;
                        }
                    } else {
                        continueDay = 1;
                    }
                    // 计算签到所得金币
                    let gold = activityRecord.gold;
                    if (continueDay <= 0) {
                        gold = gold;
                    } else if (continueDay <= 7) {
                        gold += continueDay;
                    } else {
                        gold += 7;
                    }
                    await activityCollection.doc(activityRecord._id).update({
                        data: {
                            signList,
                            lastestSign: YMD,
                            continueDay,
                            gold
                        }
                    })
                    return {
                        signList,
                        lastestSign: YMD,
                        continueDay,
                        gold
                    }
                default:
                    return {}
            }
        }
    } catch (error) {
        console.error('出错了', error);
        return {
            code: 500,
            msg: '服务器错误'
        }
    }
}