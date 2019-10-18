import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import PropTypes from 'prop-types'

import TimeListItem from '../timeListItem'

import './index.scss'
import { AtButton } from 'taro-ui'

export default class Guide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        }
    }

    onClickGuideItem() {
        Taro.showToast({
            title: '点击了引导页',
            icon: 'none',
            duration: 2000
        })
    }

    onGotUserInfo(e) {
        console.log(e)
        const { detail } = e;
        if (detail.errMsg.endsWith('ok')) {
            const userInfo = JSON.parse(detail.rawData)
            const { nickName, gender, avatarUrl, city, country, language, province } = userInfo
            Taro.cloud
                .callFunction({
                    name: 'postUserInfo',
                    config: {
                        env: process.env.NODE_ENV
                    },
                    data: {
                        name: nickName,
                        gender: gender,
                        avatarUrl: avatarUrl,
                        city: city,
                        country: country,
                        language: language,
                        province: province
                    },
                })
                .then(res => {
                    this.setState({
                        context: res.result,
                        userInfo: res.result
                    })
                })
        }
    }

    render() {

        const { screenWidth, screenHeight, windowHeight, statusBarHeight } = Taro.getSystemInfoSync()

        console.log(screenHeight, windowHeight)
        return (
            <View className='container' style={{marginTop: 0}}>
                {/* <AtButton type="primary">这里空空如也,点此开始吧</AtButton> */}
                <TimeListItem
                    title={'黄色表示倒计时'}
                    startTime={Date.parse(new Date())}
                    endTime={Date.parse(new Date(2020, 0, 1))}
                    onClick={ () => this.onClickGuideItem() }
                ></TimeListItem>
                <View style={{ height: Taro.pxTransform(20) }}></View>
                <TimeListItem
                    title={'红色表示倒计时已超出'}
                    startTime={Date.parse(new Date())}
                    endTime={Date.parse(new Date(2019, 10 - 1, 1))}
                ></TimeListItem>
                <View style={{ height: Taro.pxTransform(20) }}></View>
                <TimeListItem
                    isCountDown={false}
                    title={'绿色表示正计时'}
                    startTime={Date.parse(new Date(2019, 0, 1))}
                ></TimeListItem>
                <View style={{ height: Taro.pxTransform(20) }}></View>
                <TimeListItem
                    isCountDown={false}
                    title={'长按选择编辑和删除'}
                    startTime={Date.parse(new Date(2019, 0, 1))}
                ></TimeListItem>
                <View style={{ height: Taro.pxTransform(20) }}></View>
                <AtButton
                    type="primary"
                    openType="getUserInfo"
                    onGetUserInfo={(e) => this.onGotUserInfo(e) }
                >我知道了</AtButton>
            </View>
        )
    }
}
