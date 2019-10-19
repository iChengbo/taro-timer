import Taro, { Component } from '@tarojs/taro'
import { View, FlatList } from '@tarojs/components'

import TimeListItem from '../../components/timeListItem'

import { AtFab, AtActionSheet, AtActionSheetItem } from 'taro-ui'

import { getTimerList, deleteTimerById } from '../../apis/timer'
import { isLoggin } from '../../utils/checker';

import './index.scss'

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDrawer: false,
            showSheet: false,
            selectTimer: {},
            isAuthorize: false,
            timerRecordList: [],
        }
    }

    componentWillMount() { }

    componentDidMount() {
        isLoggin().then((res) => {
            console.log('已授权', res)
            this.setState({
                isAuthorize: true,
            })
            getTimerList({}).then((res) => {
                console.log('获取列表成功', res)
                this.setState({
                    timerRecordList: res.result,
                })
            }).catch(err => {
                console.log('获取列表失败', err)
            })
        }).catch((err) => {
            console.log('未授权', err)
            Taro.navigateTo({
                url: '/pages/login/index'
            })
        })

        Taro.eventCenter.on('Publish.complete', () => {
            console.log('完成修改 我要刷新列表')
            Taro.cloud.callFunction({
                name: 'getTimerList',
                data: {}
            }).then((res) => {
                console.log('获取列表成功', res)
                this.setState({
                    timerRecordList: res.result,
                })
            }).catch(err => {
                console.log('获取列表失败', err)
            })
        })
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.isAuthorize !== nextState.isAuthorize) {
            return true;
        }
    }

    onTimeUp() {
        Taro.showToast({
            title: '时间到',
            icon: 'success',
            duration: 2000
        })
    }

    handleClickAdd(item, index) {
        isLoggin().then((res) => {
            Taro.navigateTo({
                url: '/pages/publish/index'
            })
        }).catch((err) => {
            Taro.navigateTo({
                url: '/pages/login/index'
            })
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
            const { _id } = this.state.selectTimer;
            deleteTimerById({_id}).then(res => {
                console.log('删除成功', res);
                Taro.eventCenter.trigger('Publish.complete')
            })
        })
    }

    editSelectTimer() {
        this.setState({
            showSheet: false,
        }, () => {
            const { _id } = this.state.selectTimer
            Taro.navigateTo({
                url: `/pages/publish/index?_id=${_id}`
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

        const { isAuthorize, timerRecordList=[] } = this.state;
        console.log('timerRecordList', timerRecordList)
        const { screenWidth, screenHeight, windowHeight, statusBarHeight } = Taro.getSystemInfoSync()

        console.log(screenHeight, windowHeight)
        return (
            <View className='container'>
                <View className='index__fab'>
                    <AtFab onClick={() => this.handleClickAdd()}>
                        <Text className='at-fab__icon at-icon at-icon-add'></Text>
                    </AtFab>
                </View>
                <View className='index__body' style={{backgroundColor: '#e5e5e5', width: '100%'}}>
                    <View style={{ height: Taro.pxTransform(20) }}></View>
                    { !!isAuthorize &&
                        [...timerRecordList].map((item, index) => {
                            return (
                                <View key={item._id}>
                                    <TimeListItem
                                        title={item.title}
                                        dateSel={item.dateSel}
                                        timeSel={item.timeSel}
                                        isCountDown={item.isCountDown}
                                        onLongPress={ () => this.onLongPressTimer(item) }
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
                    {/* <AtActionSheetItem onClick={ () => this.posterSelectTimer() }>
                        海报
                    </AtActionSheetItem> */}
                </AtActionSheet>
            </View>
        )
    }
}

Home.config = {
    navigationBarTitleText: '极时刻',
}