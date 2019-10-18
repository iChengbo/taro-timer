import { fetchCloudApi } from '../utils/fetchApi';
import { TIMER } from '../constants/cloudName';

// 查询列表
export function getTimerList(data) {
    return fetchCloudApi({
        name: TIMER.GET_TIMER_LIST, 
        data
    })
}
// 增 改
export function postTimer(data) {
    return fetchCloudApi({
        name: TIMER.POST_TIMER,
        data
    })
}

export function deleteTimerById(data) {
    return fetchCloudApi({
        name: TIMER.DELETE_TIMER_BY_ID,
        data
    })
}