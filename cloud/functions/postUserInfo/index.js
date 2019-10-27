const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const userCollection = db.collection("user");

exports.main = async event => {
    const { OPENID, UNIONID } = cloud.getWXContext();
    const { name, gender, avatarUrl, city, country, language, province } = event;
    console.log('event',event);
    
    try {
        const [userRecord] = (await userCollection
            .where({
                openId: OPENID
            })
            .get()).data;
        console.log("查到的用户信息", userRecord);
        if (!userRecord) {
            await userCollection.add({
                data: {
                    openId: OPENID,
                    unionId: UNIONID,
                    createdTime: db.serverDate(),
                    name,
                    gender,
                    avatarUrl,
                    city,
                    country,
                    language,
                    province
                },
            })
            // return {
            //     code: 1,
            //     message: "用户不存在"
            // };
        } else {
            await userCollection.doc(userRecord._id).update({
                data: {
                    name,
                    gender,
                    avatarUrl,
                    city,
                    country,
                    language,
                    province
                }
            });
        }
        return {
            openId: OPENID,
            name,
            gender,
            avatarUrl,
            city,
            country,
            language,
            province
        };
    } catch (e) {
        console.log(e);
        return {
            code:500,
            message:"服务器错误",
        }
    }
}