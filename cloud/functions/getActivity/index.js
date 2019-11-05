// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const actCollection = db.collection("activity");

const ACTIVITY_TYPE = {
    SIGN: 1,
}

// 云函数入口函数
exports.main = async (event, context) => {
    const { OPENID } = cloud.getWXContext()
    const { type } = event;
    console.log('event---', event);
    try {
        switch(type) {
            case ACTIVITY_TYPE.SIGN:
                const [actRecord] = (await actCollection.where({
                    openId: OPENID,
                }).get()).data;
                console.log("查询到的活动数据", actRecord);
                let crtTime = +Date.now() + 8 * 60 * 60 * 1000;
                let crtDate = new Date(crtTime);
                let year = crtDate.getFullYear(), month = crtDate.getMonth() + 1, day = crtDate.getDate();
                let YMD = year + '/' + month + '/' + day;
                let isSigned = YMD == actRecord.lastestSign;
                return {...actRecord, isSigned};
            default:
                return {}
        }
    } catch (error) {
        console.log(error);
        return {
            code: 500,
            message: "服务器错误",
        }
    }
}