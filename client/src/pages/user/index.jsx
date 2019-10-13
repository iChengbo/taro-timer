import Taro, { Component } from '@tarojs/taro'
import { View, FlatList, ScrollView } from '@tarojs/components'

import Login from '../../components/login/index'
import TimeListItem from '../../components/timeListItem'

import { AtButton } from 'taro-ui'

import './index.scss'

export default class Index extends Component {

    config = {
        navigationBarTitleText: '我的',
        // navigationBarBackgroundColor: '#6190E8',
        // navigationBarTextStyle: 'white',
        // navigationStyle: 'custom',
    }

    componentWillMount() {
        Taro.getSystemInfo({
            success: res => console.log(res)
        })
            .then(res => console.log(res))
    }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <View style={{ backgroundColor: '#1f2224', height: '100%' }}>
                {/* <AtButton>按钮</AtButton> */}
                <ScrollView
                    scrollY
                    height={'100%'}
                    style={{
                        height: '100%'
                    }}
                >
                    {/* <Text>我的页面</Text> */}
                    {
                        [1, 1, 1, 1, 1, 1, 1].map((item, index) => {
                            return (
                                <View key={index}>
                                    <TimeListItem
                                        title={'老婆的生日'}
                                        startTime={Date.parse(new Date())}
                                        endTime={Date.parse(new Date(2019, 10 - 1, 12))}
                                        // onCountEnd={() => this.onTimeUp()}
                                    ></TimeListItem>
                                    <View style={{ height: Taro.pxTransform(10) }}></View>
                                </View>
                            )
                        })
                    }
                </ScrollView>
            </View>
        )
    }
}
