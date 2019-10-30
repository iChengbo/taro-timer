import { fetchCloudApi } from '../utils/fetchApi';
import { ACTIVITY } from '../constants/cloudName';
import { func } from 'prop-types';

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
            sign: true,
        }
    })
}