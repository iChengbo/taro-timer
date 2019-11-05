import { fetchCloudApi } from '../utils/fetchApi';
import { ACTIVITY } from '../constants/cloudName';

const ACTIVITY_TYPE = {
    SIGN: 1,
}

// 新增、修改 activity
export function postActivity(data) {
    return fetchCloudApi({
        name: ACTIVITY.POST_ACTIVITY, 
        data
    })
}

// 签到
export function dailySign() {
    return fetchCloudApi({
        name: ACTIVITY.POST_ACTIVITY,
        data: {
            type: ACTIVITY_TYPE.SIGN,
        }
    })
}

// 获取活动信息
export function getActivity(data) {
    return fetchCloudApi({
        name: ACTIVITY.GET_ACTIVITY,
        data
    })
}

// 获取签到信息
export function getSignActivity() {
    return fetchCloudApi({
        name: ACTIVITY.GET_ACTIVITY,
        data: {
            type: ACTIVITY_TYPE.SIGN,
        }
    })
}
