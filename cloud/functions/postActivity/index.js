// 云函数入口文件
const cloud = require("wx-server-sdk");
const _ = require("lodash");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const activityCollection = db.collection("activity");

// 云函数入口函数
exports.main = async (event, context) => {
    const { OPENID } = cloud.getWXContext();
    const { _id, sign } = event;
    console.log('event: ', OPENID, event);
    
    try {
        const [activityRecord] = (await activityCollection.where({
            _id: _id,
            openId: OPENID
        }).get()).data;

        if (!activityRecord) {
            console.log("新增");
            await activityCollection.add({
                data: {
                    openId: OPENID,
                    createdTime: db.serverDate(),
                    signList: [],
                    lastestSign: '',
                },
            })
        } else {
            console.log("修改", OPENID);
            // 签到
            if (!!sign) {
                let crtTime = +Date.now() + 8 * 60 * 60 * 1000;
                let crtDate = new Date(crtTime);
                let year = crtDate.getFullYear();
                let month = crtDate.getMonth() + 1;
                let day = crtDate.getDate();
                let YMD = year + '/' + (month + 1) + '/' + day;
                console.log('签到时间', crtDate, crtDate, `${year}/${month}/${day}`);
                let signList = activityRecord.signList;
                await activityCollection.doc(activityRecord._id).update({
                    data: {
                        signList: _.uniq(signList.concat(YMD)),
                        lastestSign: YMD
                    }
                })
                return {
                    lastestSign: YMD
                }
            }
        }
    } catch (error) {

    }
}