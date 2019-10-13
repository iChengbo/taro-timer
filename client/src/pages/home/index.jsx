import Taro, { Component } from '@tarojs/taro'
import { View, FlatList } from '@tarojs/components'

import Login from '../../components/login/index'
import TimeListItem from '../../components/timeListItem'

import { AtDrawer, AtFab, AtGrid } from 'taro-ui'

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
            showDrawer: false
        }
    }

    componentWillMount() {
        Taro.getSystemInfo({
            success: res => console.log(res)
        })
            .then(res => console.log(res))
    }

    componentDidMount() {
        // Taro.hideTabBar()
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
    render() {
        let mockData = [{
            id: 1,
            title: '老婆的生日',
            startTime: Date.parse(new Date()),
            endTime: Date.parse(new Date(2019, 10 - 1, 12)),
        }, {
            id: 2,
            title: '2019已经过了',
            startTime: Date.parse(new Date(2019, 1, 1)),
            endTime: Date.parse(new Date(2020, 1, 1)),
        }]

        const { screenWidth, screenHeight, windowHeight, statusBarHeight } = Taro.getSystemInfoSync()

        console.log(screenHeight, windowHeight)
        return (
            <View className='index'>
                <View className='index__fab'>
                    <AtFab onClick={() => this.handleClickAdd()}>
                        <Text className='at-fab__icon at-icon at-icon-add'></Text>
                    </AtFab>
                </View>
                {/* <View
                    className='index__header'
                    style={{
                        flex: 1,
                        // width: Taro.pxTransform(2*screenWidth),
                        height: Taro.pxTransform(2 * screenWidth * 9 / 16),
                    }}>
                    <Image
                        style={{ height: '100%', width: '100%' }}
                        mode={'aspectFill'}
                        src={'../../images/test.png'}
                        // src={'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1570807448793&di=13a835c549150bcd12fec2c50bd493e9&imgtype=0&src=http%3A%2F%2Fimg.pconline.com.cn%2Fimages%2Fupload%2Fupc%2Ftx%2Fitbbs%2F1705%2F24%2Fc28%2F47958182_1495620463403_mthumb.jpg'}
                    ></Image>
                </View> */}
                {/* <View style={{ height: Taro.pxTransform(10) }}></View> */}
                <View className='index__body' style={{backgroundColor: '#e5e5e5', width: '100%'}}>
                    {
                        [1, 1, 1, 1, 1, 1, 1].map((item, index) => {
                            return (
                                <View key={index}>
                                    <TimeListItem
                                        title={'老婆的生日'}
                                        startTime={Date.parse(new Date())}
                                        endTime={Date.parse(new Date(2019, 10 - 1, 12))}
                                    ></TimeListItem>
                                    <View style={{ height: Taro.pxTransform(20) }}></View>
                                    <TimeListItem
                                        isCountDown={false}
                                        title={'2019已经过了'}
                                        startTime={Date.parse(new Date(2019, 0, 1))}
                                    ></TimeListItem>
                                    <View style={{ height: Taro.pxTransform(20) }}></View>
                                    <TimeListItem
                                        title={'新年'}
                                        startTime={Date.parse(new Date())}
                                        endTime={Date.parse(new Date(2020, 0, 1))}
                                    ></TimeListItem>
                                    <View style={{ height: Taro.pxTransform(20) }}></View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        )
    }
}
