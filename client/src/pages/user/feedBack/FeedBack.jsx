import Taro, { Component, Config } from '@tarojs/taro'
import {
    ScrollView,
    View,
} from '@tarojs/components';

import { AtCard, AtButton, AtList, AtListItem } from "taro-ui";

import './FeedBack.scss';

export default class User extends Component {
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
                <View className='feedback__footer'>
                    <AtButton type='secondary' circle={true} openType='feedback'>其他问题反馈</AtButton>
                    <View style={{height: Taro.pxTransform(20)}}></View>
                    <AtButton type='secondary' circle={true} openType='contact'>联系客服</AtButton>
                </View>
            </View>
        )
    }
}