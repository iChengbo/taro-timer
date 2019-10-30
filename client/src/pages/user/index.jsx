import Taro, { Component, Config } from '@tarojs/taro'
import {
    ScrollView,
    View,
} from '@tarojs/components';

import { AtAvatar, AtIcon, AtButton, AtList, AtListItem } from "taro-ui";
import { postUserInfo } from '../../apis/user';
import { dailySign } from '../../apis/activity';
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
        }
    }

    // 微信小程序页面分享能力
    onShareAppMessage() {
        const { nickName } = this.state.userInfo
        return {
            title: `${nickName} 邀请您一起来记录美好时刻\n快去看看吧~`,
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
                    this.setState({
                        userInfo: res.userInfo
                    })
                }
            })
        }).catch((err) => {
            console.log(4442, err)
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.state.isAuthorize !== nextState.isAuthorize) {
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
                if(!!res.result.lastestSign) {
                    this.setState({
                        isSigned: true
                    })
                }
            });
        }
    }

    render() {
        const { userInfo, isAuthorize, isSigned } = this.state;
        const signText = !!isSigned? '已签到' : '签到';
        const buttonType = !!isSigned? 'secondary' : 'primary';

        return (
            <View className='user'>
                {/* <View className='user__fab'>
                    <AtButton openType={'share'} circle={true}>
                        <AtIcon value='clock' size='30' color='#F00'></AtIcon>
                    </AtButton>
                </View> */}
                <View className='user__header'>
                    <View className='user__header--left'>
                        <AtAvatar openData={{ type: 'userAvatarUrl' }} size='large' circle={true}></AtAvatar>
                        {!!userInfo.nickName && <Text className='user__header-name'>{userInfo.nickName}</Text>}
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
                        onClick={() => this.handleClickListItem('/pages/feedBack/index')}
                        title='我的签到表'
                        arrow='right'
                        iconInfo={{ size: 25, color: '#000', value: 'message' }}
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
                        customStyle={{ marginTop: '100px', marginLeft: '100px', marginRight: '100px'}}
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