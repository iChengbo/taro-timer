import Taro, { Component } from '@tarojs/taro'
import { View, FlatList } from '@tarojs/components'

import Login from '../../components/login/index'
import TimeListItem from '../../components/timeListItem'
import Guide from '../../components/guide'

import { AtFab, AtActionSheet, AtActionSheetItem } from 'taro-ui'

import './index.scss'

export default class Index extends Component {

    config = {
        navigationBarTitleText: '时间节点',
        // navigationBarBackgroundColor: '#292b2e',
        // navigationBarBackgroundColor: '#6190E8',
        // navigationBarTextStyle: 'white',
        // navigationStyle: 'custom',
    }

    constructor(props) {
        super(props);
        this.state = {
            showDrawer: false,
            showSheet: false,
            selectTimer: {},
            isAuthorize: false,
        }
    }

    componentWillMount() { }

    componentDidMount() {
        Taro.getSetting().then((res) => {
            if(!!res.authSetting['scope.userInfo']) {
                console.log('已授权', res)
                this.setState({
                    isAuthorize: true,
                })
            } else {
                console.log('未授权', err)
            }
        })
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    onTimeUp() {
        Taro.showToast({
            title: '时间到',
            icon: 'success',
            duration: 2000
        })
    }

    handleClickAdd(item, index) {
        Taro.navigateTo({
            url: '/pages/publish/index'
        })
    }

    onReachBottom() {
        Taro.showToast({
            title: 'onReachBottom 触底了，小伙子... \n 我要加载更多数据喽！！',
            icon: 'none',
            duration: 2000
        })
    }

    onLongPressTimer(timerItem) {
        this.setState({
            showSheet: true,
            selectTimer: timerItem,
        })
    }
    deleteSelectTimer() {
        this.setState({
            showSheet: false,
        }, () => {
            Taro.showToast({
                title: 'deleteSelectTimer',
                icon: 'none',
                duration: 2000
            })
        })
    }

    editSelectTimer() {
        this.setState({
            showSheet: false,
        }, () => {
            Taro.showToast({
                title: 'editSelectTimer',
                icon: 'none',
                duration: 2000
            })
        })
    }

    posterSelectTimer() {
        const { selectTimer } = this.state;
        const timerId = selectTimer.id;
        this.setState({
            showSheet: false,
        }, () => {
            Taro.navigateTo({
                url: `/pages/poster/index?timerId=${timerId}`
            })
        })
    }

    render() {

        const { isAuthorize } = this.state;
        const { screenWidth, screenHeight, windowHeight, statusBarHeight } = Taro.getSystemInfoSync()

        console.log(screenHeight, windowHeight)
        return (
            <View className='index'>
                <View className='index__fab'>
                    <AtFab onClick={() => this.handleClickAdd()}>
                        <Text className='at-fab__icon at-icon at-icon-add'></Text>
                    </AtFab>
                </View>
                <View className='index__body' style={{backgroundColor: '#e5e5e5', width: '100%'}}>
                    <View style={{ height: Taro.pxTransform(20) }}></View>
                    { !isAuthorize && <Guide></Guide> }
                    { !!isAuthorize &&
                        [1,2,3].map((item, index) => {
                            return (
                                <View key={index}>
                                    <TimeListItem
                                        title={'黄色表示倒计时'}
                                        startTime={Date.parse(new Date())}
                                        endTime={Date.parse(new Date(2020, 0, 1))}
                                    ></TimeListItem>
                                    <View style={{ height: Taro.pxTransform(20) }}></View>
                                    <TimeListItem
                                        title={'红色表示倒计时已超出'}
                                        startTime={Date.parse(new Date())}
                                        endTime={Date.parse(new Date(2019, 10 - 1, 1))}
                                        onLongPress={ () => this.onLongPressTimer(item) }
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
                                </View>
                            )
                        })
                    }
                </View>
                <AtActionSheet isOpened={this.state.showSheet} cancelText='取消'>
                    <AtActionSheetItem onClick={ () => this.deleteSelectTimer() }>
                        删除
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={ () => this.editSelectTimer() }>
                        编辑
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={ () => this.posterSelectTimer() }>
                        海报
                    </AtActionSheetItem>
                </AtActionSheet>
            </View>
        )
    }
}
