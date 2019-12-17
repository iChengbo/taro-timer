// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const collection = db.collection("user");

const SQL_TYPE = {
  'GET_BY_ID': 'GET_BY_ID',
  'NEW_ONE': 'NEW_ONE',
  'UPDATE_BY_ID': 'UPDATE_BY_ID',
  'POST_ONE': 'POST_ONE'
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID, APPID, UNIONID } = cloud.getWXContext()
  const { type, params, data } = event;
  console.log('身份', OPENID, APPID, UNIONID);
  console.log('参数', type, params, data);

  switch (type) {
    case SQL_TYPE.GET_BY_ID:
      return await getRecordById(OPENID);
    case SQL_TYPE.NEW_ONE:
      return await addNewRecord({
        ...data,
        openId: OPENID,
        unionId: UNIONID,
      });
    case SQL_TYPE.UPDATE_BY_ID:
      return await updateUserByOpenid(OPENID, data);
    default:
      return { 'message': '无此操作' };
  }
}


// 查
async function getRecordById(openId) {
  const [record] = (await collection.where({
    openId
  }).get()).data;
  console.log('查询到结果为', record)
  return record;
}

// 增
async function addNewRecord(data) {
  return await collection.add({
    data: {
      createdTime: db.serverDate(),
      updatedTime: db.serverDate(),
      ...data,
    },
  })
}

/**
 * 修改
 * @param {*} _id 
 * @param {*} data 
 */
async function updateUserByOpenid(openId, data) {
  const record = await getUserByOpenid(openId);
  return await collection.doc(record._id).update({
    data: {
      updatedTime: db.serverDate(),
      ...data
    }
  })
}

// 根据id查询分类
async function getUserByOpenid(openId) {
  const [record] = (await collection.where({
    openId
  }).get()).data;
  return record;
}
