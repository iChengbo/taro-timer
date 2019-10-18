import { fetchCloudApi } from '../utils/fetchApi';
import { USER } from '../constants/cloudName';

export function postUserInfo(data) {
    return fetchCloudApi({
        name: USER.POST_USER_INFO,
        data
    })
}