// 云函数入口文件
const cloud = require('wx-server-sdk')
//引入request-promise用于做网络请求
var rp = require('request-promise');
cloud.init({
  
})

const db = cloud.database();
const luckyCollection = db.collection("dailyLucky");

// 云函数入口函数
exports.main = async (event, context) => {
  let url = 'http://api.avatardata.cn/Constellation/Query?key=d784dd8dfd6649df86b5c81cb77bcbf8&consName=%E7%8B%AE%E5%AD%90%E5%BA%A7&type=today';
  // url = 'http://www.baidu.com'
  return await rp(url)
    .then(function (res) {
      console.log(res, typeof res, JSON.parse(res))
      const { name, datetime, date, all, color, health, love, money, number, QFriend, summary, work } = JSON.parse(res).result1;

      console.log("新增今日幸运指数");
      // await luckyCollection.add({
      //     data: {
      //         name,
      //         datetime,
      //         date,
      //         all,
      //         color,
      //         health,
      //         love,
      //         money,
      //         number,
      //         QFriend,
      //         summary,
      //         work
      //     },
      // })
      return res
    })
    .catch(function (err) {
      console.log('失败', err)
      return '失败'
    });
}
