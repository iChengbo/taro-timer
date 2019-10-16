// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();
const db = cloud.database();
const timerCollection = db.collection("timer");

// 云函数入口函数
exports.main = async (event, context) => {
    const { OPENID } = cloud.getWXContext()
    const { _id } = event;
    console.log('event---', event);
    try {
        const [timerRecord] = (await timerCollection.where({
            openId: OPENID,
            _id: _id
        })
        .get()).data;
        console.log("查询到的计时事件", timerRecord);
        if(!!timerRecord) {
            await timerCollection.doc(_id).remove().then(res => {
                console.log('删除成功', res.data);
                return res;
            }).catch(err => {
                console.log('删除失败', err)
                return {
                    code: 500,
                    message: '删除失败',
                }
            })
        }
        return timerRecord;
    } catch (error) {
        console.log(error);
        return {
            code: 500,
            message: "服务器错误",
        }
    }
}