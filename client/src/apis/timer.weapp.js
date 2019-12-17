import { fetchAPI } from '../utils/request';

const SQL_TYPE = {
    'GET_LIST': 'GET_LIST',
    'GET_BY_ID': 'GET_BY_ID',
    'NEW_ONE': 'NEW_ONE',
    'UPDATE_BY_ID': 'UPDATE_BY_ID',
    'DELETE_BY_ID': 'DELETE_BY_ID',
}

// 查询列表
export function getTimerList(data) {
    return fetchAPI({
        url: '/timer/list',
        data: {
            type: SQL_TYPE.GET_LIST,
            params: data
        }
    })
}

// 查
export function getTimerById(data) {
    return fetchAPI({
        url: '/timer/one',
        data: {
            type: SQL_TYPE.GET_BY_ID,
            params: data
        }
    })

}

// 增
export function postTimer(data) {
    return fetchAPI({
        url: '/timer/post',
        data: {
            type: SQL_TYPE.NEW_ONE,
            data,
        }
    })
}

// 修改
export function updateTimerById(_id, data) {
    return fetchAPI({
        url: '/timer/update',
        data: {
            type: SQL_TYPE.UPDATE_BY_ID,
            params: { _id },
            data,
        }
    })
}

// 删除
export function deleteTimerById(data) {
    return fetchAPI({
        url: '/timer/del',
        data: {
            type: SQL_TYPE.DELETE_BY_ID,
            params: { _id: data._id }
        }
    })
}