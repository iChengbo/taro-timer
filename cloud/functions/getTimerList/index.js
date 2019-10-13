// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const timerCollection = db.collection("timer");

// 云函数入口函数
exports.main = async (event, context) => {
    const { OPENID } = cloud.getWXContext()

    try {
        
    } catch (error) {
        console.log(e);
        return {
            code: 500,
            message: "服务器错误",
        }
    }

    return {
        event,
        openid: wxContext.OPENID,
        appid: wxContext.APPID,
        unionid: wxContext.UNIONID,
    }
}