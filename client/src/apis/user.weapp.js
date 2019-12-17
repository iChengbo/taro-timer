import { fetchAPI } from '../utils/request';

const SQL_TYPE = {
    'GET_BY_ID': 'GET_BY_ID',
    'NEW_ONE': 'NEW_ONE',
    'UPDATE_BY_ID': 'UPDATE_BY_ID',
}

// 查询
export function getUserInfo(data) {
    return fetchAPI({
        url: '/user/one',
        data: {
            type: SQL_TYPE.GET_BY_ID,
            data
        }
    })
}

// 新增
export function postUserInfo(data) {
    return fetchAPI({
        url: '/user/post',
        data: {
            type: SQL_TYPE.NEW_ONE,
            data
        }
    })
}

// 更新
export function updateUserInfo(openId, data) {
    return fetchAPI({
        url: '/user/update',
        data: {
            type: SQL_TYPE.UPDATE_BY_ID,
            params: { openId },
            data,
        }
    })
}