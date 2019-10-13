import Taro, { Component, Config } from '@tarojs/taro'
import {
    ScrollView,
    View,
    Button,
    Text,
    Image,
} from '@tarojs/components';

import { AtAvatar, AtButton, AtList, AtListItem } from "taro-ui";
import Login from '../../components/login/index'

import { USER } from '../../constants/screens';

import './index.scss';

export default class User extends Component {
    config = {
        navigationBarTitleText: '我'
    }

    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        }
    }

    /**
     * 
     * @param {string} screen
     */
    handleClickListItem(screen, params) {
        Taro.showToast({
            title: '该页面还未完成，敬请期待',
            icon: 'none',
            duration: 2000
        })
        Taro.authorize()
    }

    onGotUserInfo(e) {
        console.log('e', e)
        this.setState({
            userInfo: e.detail.userInfo
        })
        // Taro.showModal({
        //     title: '用户信息',
        //     content: JSON.stringify(userInfo),
        // })
    }

    render() {
        let { userInfo } = this.state 
        return (
            <View className='user'>
                <Button openType='getUserInfo' onGetUserInfo={ (e) => this.onGotUserInfo(e) } type='primary'>按钮</Button>
                <Text>{ userInfo.avatarUrl }</Text>
                <Text>{ userInfo.city }</Text>
                <Text>{ userInfo.country }</Text>
                <Text>{ userInfo.gender }</Text>
                <Text>{ userInfo.language }</Text>
                <Text>{ userInfo.nickName }</Text>
                <Text>{ userInfo.province }</Text>
                <View className='user__header'>
                    <AtAvatar openData={{ type: 'userAvatarUrl' }} size='large' circle={true}></AtAvatar>
                </View>
                <View style={{ height: Taro.pxTransform(20) }}></View>
                <AtList hasBorder={false}>
                    <AtListItem
                        onClick={() => this.handleClickListItem()}
                        title='用户反馈'
                        arrow='right'
                        iconInfo={{ size: 25, color: '#000', value: 'message' }}
                    />
                    <AtListItem
                        onClick={() => this.handleClickListItem()}
                        title='关于我们'
                        arrow='right'
                        iconInfo={{ size: 25, color: '#000', value: 'tag' }}
                    />
                </AtList>
                <View className='user__footer'>
                    {/* <Text>底部</Text> */}
                    <Login></Login>
                </View>
            </View>
        )
    }
}