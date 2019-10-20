import Taro, { Component } from '@tarojs/taro'
import { View, Image, ScrollView } from '@tarojs/components'

import TimeListItem from '../../components/timeListItem'

import { AtFab, AtActionSheet, AtActionSheetItem, AtDivider } from 'taro-ui'

import { getTimerList, deleteTimerById } from '../../apis/timer'
import { isLoggin } from '../../utils/checker';
import { COLOR } from '../../constants/colors';
import { transformTime } from '../../utils/timeFunctions'

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
            this.refreshTimerList();
        }).catch((err) => {
            console.log('未授权', err)
            Taro.navigateTo({
                url: '/pages/login/index'
            })
        })

        Taro.eventCenter.on('Publish.complete', () => {
            console.log('完成修改 我要刷新列表')
            this.refreshTimerList();
        });
        Taro.eventCenter.on('Login.complete', () => {
            console.log('完成登录 我要刷新列表')
            this.refreshTimerList();
        })
    }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.isAuthorize !== nextState.isAuthorize) {
            return true;
        }
        if(this.state.timerRecordList.length != nextState.timerRecordList.length) {
            return true;
        }
    }

    // 微信小程序页面分享能力
    onShareAppMessage() {
        return {
            title: '我发现了一个有趣的小程序',
            path: '/pages/home/index'
        }
    }

    refreshTimerList() {
        console.log('我要获取或刷新列表')
        getTimerList({}).then((res) => {
            console.log('获取列表成功', res)
            this.setState({
                timerRecordList: res.result,
            })
        }).catch(err => {
            console.log('获取列表失败', err)
        })
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
        // console.log('timerRecordList', timerRecordList)
        // const { screenWidth, screenHeight, windowHeight, statusBarHeight } = Taro.getSystemInfoSync()
        // console.log(screenHeight, windowHeight)

        let goalList = [], memoList = [], overList = [];
        timerRecordList.forEach((item, index) => {
            if(!item.isCountDown) {
                memoList.push(item);
            } else {
                // 目标时间 - 当前时间
                let overTime = transformTime(item.dateSel, item.timeSel) - Date.parse(new Date());
                if(overTime < 0) {
                    overList.push(item);
                } else {
                    goalList.push(item);
                }
            }
        })
        goalList.sort((a, b) => {
            return transformTime(a.dateSel, a.timeSel) - transformTime(b.dateSel, b.timeSel);
        })
        memoList.sort((a, b) => {
            return transformTime(a.dateSel, a.timeSel) - transformTime(b.dateSel, b.timeSel);
        })
        overList.sort((a, b) => {
            return transformTime(b.dateSel, b.timeSel) - transformTime(a.dateSel, a.timeSel);
        })

        return (
            <View className='index'>
                <View className='index__fab'>
                    <AtFab onClick={() => this.handleClickAdd()}>
                        <Text className='at-fab__icon at-icon at-icon-add'></Text>
                    </AtFab>
                </View>
                {/* <Image
                    className='index__backImage'
                    src='http://pic.51yuansu.com/backgd/cover/00/35/48/5bd7c7ae02be4.jpg!/fw/780/quality/90/unsharp/true/compress/true'
                /> */}
                <View scrollY className='index__body' style={{backgroundColor: '#ffffff', width: '100%'}}>
                    { goalList.length > 0 && <AtDivider content='目标倒计时' fontColor={COLOR.YELLOW_1} lineColor={COLOR.YELLOW_1} />}
                    { goalList.map((item, index) => {
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
                    { memoList.length > 0 && <AtDivider content='纪念日计时' fontColor={COLOR.GREEN_1} lineColor={COLOR.GREEN_1} />}
                    { memoList.map((item, index) => {
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
                    { overList.length > 0 && <AtDivider content='超时倒计时' fontColor={COLOR.RED_1} lineColor={COLOR.RED_1} /> }
                    { overList.map((item, index) => {
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