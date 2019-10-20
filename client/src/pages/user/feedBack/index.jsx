import Taro, { Component, Config } from '@tarojs/taro'
import {
    ScrollView,
    View,
} from '@tarojs/components';

import { AtCard, AtButton } from "taro-ui";

import './index.scss';

export default class FeedBack extends Component {
    config = {
        navigationBarTitleText: '帮助与反馈'
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View className='feedback'>
                <AtCard
                    title='1. 首页红黄绿小薯条代表什么？'
                    note='答：绿色代表正计时；黄色代表倒计时；红色代表倒计时已超时。'
                ></AtCard>
                <View style={{ height: Taro.pxTransform(20) }}></View>
                <AtCard
                    title='2. 如何删除或重新编辑事件？'
                    note='答：长按首页事件试试哦...'
                ></AtCard>
                <View className='feedback__footer'>
                    <AtButton type='secondary' circle={true} openType='feedback'>其他问题反馈</AtButton>
                    <View style={{height: Taro.pxTransform(20)}}></View>
                    <AtButton type='secondary' circle={true} openType='contact'>联系客服</AtButton>
                </View>
            </View>
        )
    }
}