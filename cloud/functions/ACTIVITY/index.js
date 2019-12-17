// 云函数入口文件
const cloud = require("wx-server-sdk");
const _ = require("lodash");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const collection = db.collection("activity");

const ACTIVITY_TYPE = {
  SIGN: 1,
}

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
    case SQL_TYPE.NEW_ONE:
      return addNewRecord({ openId: OPENID, ...data });
    default:
      return { 'message': '无此操作' };
  }
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