const cloud = require('wx-server-sdk')

cloud.init()


exports.main = (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database({
    env: 'weapp-dev'
  })

  const { avatarUrl, city, country, gender, language, nickName, province } = event.userInfo

  db.collection('users').add({
    data: {
      avatarUrl: avatarUrl,
      city: city,
      country: country,
      gender: gender,
      language: language,
      nickName: nickName,
      province: province,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID
    }
  })
  .then((res) => {
    return {
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
  })
  .catch((err) => {
    return err
  })
}