import Taro, { Component } from '@tarojs/taro'

export function getSetting(setting) {
    return Taro.getSetting().then(() => {

    })
}

export function isLoggin() {
    return Taro.getSetting().then((res) => {
        if(!!res.authSetting['scope.userInfo']) {
            return Promise.resolve({isAuthorize: true})
        } else {
            return Promise.reject({isAuthorize: false})
        }
    }).catch((err) => {
        return Promise.reject(err)
    })
}