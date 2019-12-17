/**
 * 微信小程序 先以云函数实现
 */
import Taro from '@tarojs/taro';

import * as Url2Cloud from '../constants/Url2Cloud';

const RequestManager = (() => {
    let request = {};
    return {
        isRepeat: (req) => {
            return !!request[req];
        },
        addRequest: (req) => {
            return (request[req] = req);
        },
        removeRequest: (req) => {
            delete request[req];
            return request;
        }
    }
})();

export function fetchAPI(options) {
    const { data, url } = options;
    return new Promise((resolve, reject) => {
        getNetwork().then((network) => {
            if (network) {
                // 域名前缀
                const prefix = apiPrefix();
                let request = prefix + url + joinParams(data);
                console.log('url', Url2Cloud[url], request);
                if (RequestManager.isRepeat(request)) {
                    return Promise.reject('repeat')
                }
                RequestManager.addRequest(request);
                Taro.cloud.callFunction({
                    name: Url2Cloud[url],
                    config: { env: process.env.NODE_ENV !== 'production' ? 'weapp-dev-id' : 'weapp-release-id' },
                    data: data
                }).then(res => {
                    RequestManager.removeRequest(request);
                    if (res.errMsg == 'cloud.callFunction:ok') {
                        return resolve(res.result);
                    } else {
                        showErrorMsg();
                        return reject(res);
                    }
                }).catch(err => {
                    RequestManager.removeRequest(request);
                    console.log('调取云函数报错', err)
                    showErrorMsg();
                    return reject(err);
                });
            } else {
                showErrorMsg();
                resolve();
            }
        })
    })
}


export const getNetwork = () => {
    return new Promise((resolve, reject) => {
        Taro.getNetworkType({
            success: res => {
                if (['none'].includes(res.networkType)) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            },
            fail: err => {
                console.log(err)
                resolve(false)
            }
        })
    })
}

export function apiPrefix() {
    if (process.env.TARO_ENV) {
        return '';
    } else {
        return '';
    }
}

export function joinParams(param) {
    //添加公参
    if (!Array.isArray(param)) {
        let arr = []
        for (let p in param) {
            arr.push(p + '=' + encodeURIComponent(param[p]))
        }
        return '?' + arr.join('&');
    }

    let keys = Object.keys(param).sort()
    let str = '?'
    keys.forEach((v, k) => {
        str += (v + '=' + encodeURIComponent(param[v]) + '&')
    })
    return str
}

function showErrorMsg(err = '网络异常') {
    Taro.showToast({
        title: err,
        icon: 'none',
        duration: 1500,
        mask: false
    });
}
