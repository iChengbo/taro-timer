import Taro, { Component, Config } from '@tarojs/taro'
import {
    ScrollView,
    View,
} from '@tarojs/components';

import { AtCalendar, AtButton } from "taro-ui";

import { getSignActivity } from '../../apis/activity';

import './index.scss';

export default class FeedBack extends Component {
    config = {
        navigationBarTitleText: '我的签到表'
    }

    constructor(props) {
        super(props);
        this.state = {
            signList: [],
            continueDay: 1,
        }
    }

    // 微信小程序页面分享能力
    onShareAppMessage() {
        const { continueDay } = this.state;
        return {
            title: `我已经连续签到${continueDay}天了\n快来加入我吧~`,
            path: '/pages/home/index',
        }
    }

    componentDidMount() {
        getSignActivity().then((res) => {
            console.log('activity', res);
            let data = res.result;
            this.setState({
                signList: data.signList,
                continueDay: data.continueDay,
            })
        })
    }

    render() {

        let { signList } = this.state;
        let markSignList = signList.map((item, index) => {
            return { value: item }
        })

        return (
            <View className='signRecord'>
                <AtCalendar marks={markSignList} />
                <View className='signRecord__footer'>
                    <AtButton
                        customStyle={{ marginTop: '100px', marginLeft: '100px', marginRight: '100px' }}
                        openType={'share'}
                        circle={true}
                        type='primary'
                    >
                        分享给好友
                    </AtButton>
                </View>
            </View>
        )
    }
}