// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const timerCollection = db.collection("timer");

// 云函数入口函数
exports.main = async (event, context) => {
    const { OPENID } = cloud.getWXContext()
    const { _id, title, dateSel, timeSel, isCountDown, isTop } = event;
    console.log('event---', _id, OPENID, event);

    try {
        if(!!_id) {
            console.log("修改计时事件", _id);
            const [timerRecord] = (await timerCollection.where({
                _id: _id,
                openId: OPENID
            })
            .get()).data;
            console.log("查询到的计时事件", timerRecord);
            await timerCollection.doc(timerRecord._id).update({
                data: {
                    title,
                    dateSel,
                    timeSel,
                    isCountDown,
                    isTop
                }
            })
        } else {
            console.log("新增计时事件");
            await timerCollection.add({
                data: {
                    openId: OPENID,
                    createdTime: db.serverDate(),
                    title,
                    dateSel,
                    timeSel,
                    isCountDown,
                    isTop
                },
            })
        }
        return {
            title,
            dateSel,
            timeSel,
            isCountDown,
            isTop
        }
    } catch (error) {
        console.log(error);
        return {
            code: 500,
            message: "服务器错误",
        }
    }
}