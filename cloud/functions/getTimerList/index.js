// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const timerCollection = db.collection("timer");

// 云函数入口函数
exports.main = async (event, context) => {
    const { OPENID } = cloud.getWXContext()
    console.log('event---', event);

    console.log('测试时间', new Date(), +new Date(), new Date('2019', '1', '1'), new Date(2019, 1,1), new Date(2019, 1, 1))

    try {
        const timerRecordList = (await timerCollection.where({
            openId: OPENID,
        })
        .get()).data;
        console.log("查询到的计时事件列表", timerRecordList);
        return timerRecordList;
    } catch (error) {
        console.log(error);
        return {
            code: 500,
            message: "服务器错误",
        }
    }
}