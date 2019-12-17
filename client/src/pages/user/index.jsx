import Taro, { Component, Config } from '@tarojs/taro'
import {
    ScrollView,
    View,
} from '@tarojs/components';

import { AtAvatar, AtIcon, AtButton, AtList, AtListItem } from "taro-ui";
import { getUserInfo, postUserInfo, updateUserInfo } from '../../apis/user';
import { dailySign, getSignActivity } from '../../apis/activity';
import { isLoggin } from '../../utils/checker';

import './index.scss';

export default class User extends Component {
    config = {
        navigationBarTitleText: '我'
    }

    constructor(props) {
        super(props);
        this.state = {
            isRegistered: false,
            openId: '',
            userInfo: {},
            isAuthorize: false,
            isSigned: false,
        }
    }

    // 微信小程序页面分享能力
    onShareAppMessage() {
        const { nickName } = this.state.userInfo;
        const _nickName = !!nickName ? nickName : '您的小伙伴'
        return {
            title: `${_nickName} 邀请您一起来记录美好时刻\n快去看看吧~`,
            path: '/pages/home/index',
            imageUrl: '../../images/shareImage.png'
        }
    }

    componentDidMount() {
        getUserInfo().then(res => {
            console.log('获取到的用户数据', res);
            if (!!res.openId) {
                this.setState({
                    isRegistered: true,
                    userInfo: res,
                    openId: res.openId,
                });
                Taro.setStorage({
                    key: "userInfo",
                    data: res,
                });
            }
        })
        getSignActivity().then((res) => {
            console.log('activity', res);
            let isSigned = res.result.isSigned;
            this.setState({
                isSigned: isSigned
            })
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.isAuthorize !== nextState.isAuthorize) {
            return true;
        }
    }

    handleClickListItem(pathAndParams) {
        Taro.navigateTo({
            url: pathAndParams,
        })
    }

    onGotUserInfo(e) {
        console.log(e)
        const { detail } = e;
        if (detail.errMsg.endsWith('ok')) {
            const userInfo = JSON.parse(detail.rawData);
            this.setState({
                userInfo
            })
            Taro.setStorage({
                key: "userInfo",
                data: userInfo,
            });
            const { isRegistered, openId } = this.state;
            if (!!isRegistered) {
                // 更新
                updateUserInfo(openId, userInfo).then(res => {
                    console.log('更新用户信息', res);
                })
            } else {
                postUserInfo(userInfo).then(res => {
                    console.log('新增用户', res);
                })
            }
            // 签到
            dailySign().then((res) => {
                console.log(res)
                if (!!res.result) {
                    this.setState({
                        isSigned: true
                    })
                }
            });
        }
    }

    render() {
        const { userInfo, isSigned } = this.state;
        const signText = !!isSigned ? '已签到' : '签到';
        const buttonType = !!isSigned ? 'secondary' : 'primary';

        return (
            <View className='user'>
                <View className='user__header'>
                    <View className='user__header--left'>
                        <AtAvatar openData={{ type: 'userAvatarUrl' }} size='large' circle={true}></AtAvatar>
                        {<Text className='user__header-name'>{userInfo.nickName}</Text>}
                    </View>
                    <View className='user__header--right'>
                        <AtButton
                            customStyle={{ width: '100px', marginLeft: '40px' }}
                            type={buttonType}
                            disabled={isSigned}
                            size="small"
                            circle={true}
                            openType="getUserInfo"
                            onGetUserInfo={(e) => this.onGotUserInfo(e)}
                        >{signText}</AtButton>
                    </View>
                </View>
                {/* <View style={{ height: Taro.pxTransform(20) }}></View> */}
                <AtList hasBorder={false}>
                    <AtListItem
                        onClick={() => this.handleClickListItem('/pages/signRecord/index')}
                        title='我的签到表'
                        arrow='right'
                        iconInfo={{ size: 25, color: '#000', value: 'calendar' }}
                    />
                    <AtListItem
                        onClick={() => this.handleClickListItem('/pages/feedBack/index')}
                        title='帮助与反馈'
                        arrow='right'
                        iconInfo={{ size: 25, color: '#000', value: 'message' }}
                    />
                </AtList>
                <View className='user__footer'>
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