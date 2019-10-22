import { fetchCloudApi } from '../utils/fetchApi';
import { POSTER } from '../constants/cloudName';

export function getPosterList(data) {
    return fetchCloudApi({
        name: POSTER.GET_POSTER_LIST,
        data
    })
}