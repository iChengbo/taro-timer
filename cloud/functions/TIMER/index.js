// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const collection = db.collection("timer");

const SQL_TYPE = {
  'GET_LIST': 'GET_LIST',
  'GET_BY_ID': 'GET_BY_ID',
  'NEW_ONE': 'NEW_ONE',
  'UPDATE_BY_ID': 'UPDATE_BY_ID',
  'DELETE_BY_ID': 'DELETE_BY_ID',
}

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID, APPID, UNIONID } = cloud.getWXContext()
  const { type, params, data } = event;

  switch (type) {
    case SQL_TYPE.GET_LIST:
      return getListByOpenid(OPENID);
    case SQL_TYPE.GET_BY_ID:
      return getOneById(params._id);
    case SQL_TYPE.NEW_ONE:
      return await addNewOne({openId: OPENID,...data});
    case SQL_TYPE.UPDATE_BY_ID:
      return updateOneById(params._id, data);
    case SQL_TYPE.DELETE_BY_ID:
      return deleteOneById(params._id);
    default:
      return {'message': '无此操作'}
  }
}

/**
 * @param {*} param0 
 */
async function getListByOpenid(openId) {
  const recordList = (await collection.where({
    openId
  }).get()).data;
  console.log("查询到的计时事件列表", recordList);
  return recordList;
}

// 根据id查询
async function getOneById(_id) {
  const [record] = (await collection.where({
    _id: _id,
  }).get()).data;
  console.log('查询到结果为', record)
  return record;
}


// 增
async function addNewOne(data) {
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
async function updateOneById(_id, data) {
  return await collection.doc(_id).update({
    data: {
      updatedTime: db.serverDate(),
      ...data
    }
  })
}

/**
 * 删除
 * @param {*} _id 
 */
async function deleteOneById(_id) {
  console.log('删除', _id)
  return await collection.doc(_id).remove();
}