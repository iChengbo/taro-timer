import Taro, { Component } from '@tarojs/taro'

export function fetchCloudApi({name='', config={env: process.env.NODE_ENV}, data={}}) {
    return Taro.cloud.callFunction({
        name,
        config,
        data
    })
}