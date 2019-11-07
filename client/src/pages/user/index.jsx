import Taro, { Component, Config } from '@tarojs/taro'
import {
    ScrollView,
    View,
} from '@tarojs/components';

import { AtAvatar, AtIcon, AtButton, AtList, AtListItem } from "taro-ui";
import { postUserInfo } from '../../apis/user';
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
            userInfo: {},
            isAuthorize: false,
            isSigned: false,
            gold: 0,
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
        isLoggin().then((res) => {
            console.log(4441, res)
            this.setState({
                isAuthorize: true,
            })
            Taro.getUserInfo({
                success: res => {
                    console.log('hshsh', res)
                    if (!!res.userInfo && res.userInfo.nickName) {
                        this.setState({
                            userInfo: res.userInfo
                        })
                    }
                }
            })
        }).catch((err) => {
            console.log(4442, err)
        })
        getSignActivity().then((res) => {
            console.log('activity', res);
            let isSigned = res.result.isSigned;
            let gold = res.result.gold
            this.setState({
                isSigned: isSigned,
                gold: !!gold ? gold : 0,
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

    handleClickGold() {
        Taro.showToast({
            title: '积分商城暂未开启,敬请期待~',
            icon: 'none',
            duration: 2000
        })
    }

    onGotUserInfo(e) {
        console.log(e)
        const { detail } = e;
        if (detail.errMsg.endsWith('ok')) {
            const userInfo = JSON.parse(detail.rawData)
            const { nickName, gender, avatarUrl, city, country, language, province } = userInfo
            postUserInfo({
                name: nickName,
                gender: gender,
                avatarUrl: avatarUrl,
                city: city,
                country: country,
                language: language,
                province: province
            }).then(res => {
                this.setState({
                    context: res.result,
                    userInfo: res.result,
                    isAuthorize: true
                })
            });
            // 签到
            dailySign().then((res) => {
                console.log(res)
                if (!!res.result) {
                    this.setState({
                        isSigned: true,
                        gold: res.result.gold
                    })
                }
            });
        }
    }

    render() {
        const { userInfo, isSigned, gold } = this.state;
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
                <View style={{ height: Taro.pxTransform(20), backgroundColor: '#F0F0F0' }}></View>
                <AtList hasBorder={false}>
                    <AtListItem
                        onClick={() => this.handleClickGold()}
                        title={`积分：${gold}`}
                        arrow='right'
                        iconInfo={{ size: 25, color: '#000', value: 'sketch' }}
                    />
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