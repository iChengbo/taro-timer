import Taro, { Component, Config } from '@tarojs/taro'
import {
    ScrollView,
    View,
} from '@tarojs/components';

import { AtAvatar, AtButton, AtList, AtListItem } from "taro-ui";
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
            userInfo: {}
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
                    userInfo: res.result
                })
            })
        }
    }

    render() {
        const { userInfo } = this.state;
        
        return (
            <View className='user'>
                {/* <View className='user__fab'>
                    <Button openType={'share'}>分享</Button>
                    <AtFab openType='share'>
                        <Text className='at-fab__icon at-icon at-icon-add'></Text>
                    </AtFab>
                </View> */}
                <View className='user__header'>
                    <AtAvatar openData={{ type: 'userAvatarUrl' }} size='large' circle={true}></AtAvatar>
                    <AtButton
                        customStyle={{ width: '100px'}}
                        type="primary"
                        size="small"
                        openType="getUserInfo"
                        onGetUserInfo={(e) => this.onGotUserInfo(e)}
                    >登录</AtButton>
                </View>
                <View style={{ height: Taro.pxTransform(20) }}></View>
                <AtList hasBorder={false}>
                    {/* <AtListItem
                        onClick={() => this.handleClickListItem()}
                        title='关于我们'
                        arrow='right'
                        iconInfo={{ size: 25, color: '#000', value: 'tag' }}
                    /> */}
                    <AtListItem
                        onClick={() => this.handleClickListItem('/pages/user/feedBack/index')}
                        title='帮助与反馈'
                        arrow='right'
                        iconInfo={{ size: 25, color: '#000', value: 'message' }}
                    />
                </AtList>
                <View className='user__footer'>
                    {/* <Text>底部</Text> */}
                </View>
            </View>
        )
    }
}