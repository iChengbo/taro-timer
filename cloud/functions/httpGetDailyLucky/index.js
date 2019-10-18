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

    const xzList = [{
        name: '白羊座',
        start: '03-21',
        end: '04-20'
    }, {
        name: '金牛座',
        start: '04-21',
        end: '05-20'
    }, {
        name: '双子座',
        start: '05-21',
        end: '06-20'
    }, {
        name: '巨蟹座',
        start: '06-21',
        end: '07-22'
    }, {
        name: '狮子座',
        start: '07-23',
        end: '08-22'
    }, {
        name: '处女座',
        start: '08-23',
        end: '09-22'
    }, {
        name: '天秤座',
        start: '09-23',
        end: '10-22'
    }, {
        name: '天蝎座',
        start: '10-23',
        end: '11-22'
    }, {
        name: '射手座',
        start: '11-23',
        end: '12-22'
    }, {
        name: '摩羯座',
        start: '12-23',
        end: '01-21'
    }, {
        name: '水瓶座',
        start: '01-22',
        end: '02-19'
    }, {
        name: '双鱼座',
        start: '02-20',
        end: '03-20'
    }]

    let url = 'http://api.avatardata.cn/Constellation/Query?key=d784dd8dfd6649df86b5c81cb77bcbf8&consName=%E7%8B%AE%E5%AD%90%E5%BA%A7&type=today';
    // url = 'http://www.baidu.com'
    xzList.forEach((item, index) => {
        let url = `http://api.avatardata.cn/Constellation/Query?key=d784dd8dfd6649df86b5c81cb77bcbf8&consName=${item.name}`
        await rp(url).then((res) => {
            console.log(res, typeof res, JSON.parse(res))
            const { name, datetime, date, all, color, health, love, money, number, QFriend, summary, work } = JSON.parse(res).result1;

            console.log("新增今日幸运指数", name);
            await luckyCollection.add({
                data: {
                    name,
                    datetime,
                    date,
                    all,
                    color,
                    health,
                    love,
                    money,
                    number,
                    QFriend,
                    summary,
                    work
                },
            })
        })
    })
    await rp(url)
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
