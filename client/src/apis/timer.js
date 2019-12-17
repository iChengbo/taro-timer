import { fetchAPI } from '../utils/request';

// 查询列表
export function getTimerList(data) {
    return fetchAPI({
        url: '/timer/list',
        data
    })
}

// 查
export function getTimerById(data) {
    return fetchAPI({
        url: '/timer/one',
        data
    })
}

// 增
export function postTimer(data) {
    return fetchAPI({
        url: '/timer/post',
        data
    })
}

// 修改
export function updateTimerById(_id, data) {
    return fetchAPI({
        url: '/timer/update',
        data: {
            _id,
            ...data
        }
    })
}

// 删除
export function deleteTimerById(data) {
    return fetchAPI({
        url: '/timer/del',
        data
    })
}