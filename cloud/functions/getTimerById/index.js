// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const timerCollection = db.collection("timer");

// 云函数入口函数
exports.main = async (event, context) => {
    const { ENV, OPENID } = cloud.getWXContext()
    // 更新默认配置，将默认访问环境设为当前云函数所在环境
    cloud.updateConfig({
        env: ENV
    })
    const { _id } = event;
    console.log('event---', event);
    try {
        const [timerRecord] = (await timerCollection.where({
            openId: OPENID,
            _id: _id
        })
        .get()).data;
        console.log("查询到的计时事件", timerRecord);
        return timerRecord;
    } catch (error) {
        console.log(error);
        return {
            code: 500,
            message: "服务器错误",
        }
    }
}