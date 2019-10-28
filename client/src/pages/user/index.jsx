import Taro, { Component, Config } from '@tarojs/taro'
import {
    ScrollView,
    View,
} from '@tarojs/components';

import { AtAvatar, AtIcon, AtButton, AtList, AtListItem } from "taro-ui";
import { postUserInfo } from '../../apis/user';
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
                    userInfo: res.result
                })
            })
        }
    }

    render() {
        const { userInfo, isAuthorize } = this.state;

        return (
            <View className='user'>
                {/* <View className='user__fab'>
                    <AtButton openType={'share'} circle={true}>
                        <AtIcon value='clock' size='30' color='#F00'></AtIcon>
                    </AtButton>
                </View> */}
                <View className='user__header'>
                    <AtAvatar openData={{ type: 'userAvatarUrl' }} size='large' circle={true}></AtAvatar>
                    {!!userInfo.nickName && <Text className='user__header-name'>{userInfo.nickName}</Text>}
                    {!isAuthorize &&
                        <AtButton
                            customStyle={{ width: '100px', marginLeft: '40px' }}
                            type="primary"
                            size="small"
                            openType="getUserInfo"
                            onGetUserInfo={(e) => this.onGotUserInfo(e)}
                        >登录</AtButton>
                    }
                </View>
                <View style={{ height: Taro.pxTransform(20) }}></View>
                <AtList hasBorder={false}>
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