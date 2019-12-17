import { fetchAPI } from '../utils/request';

// 新增或修改用户信息
export function postUserInfo(data) {
    return fetchAPI({
        url: '/user/post',
        data,
    })
}