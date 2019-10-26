// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const posterCollection = db.collection("poster");

// 云函数入口函数
exports.main = async (event, context) => {
    const { ENV, OPENID } = cloud.getWXContext()
    console.log('eeeeee', ENV, cloud.DYNAMIC_CURRENT_ENV)
    console.log('event---', event);

    try {
        const posterRecordList = (await posterCollection.get()).data;
        console.log("查询到的背景海报列表", posterRecordList);
        return posterRecordList;
    } catch (error) {
        console.log(error);
        return {
            code: 500,
            message: "服务器错误",
        }
    }
}