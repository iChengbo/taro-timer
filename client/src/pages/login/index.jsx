import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Picker, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'


import { postUserInfo } from '../../apis/user'
import { isLoggin } from '../../utils/checker';

import './index.scss'

export default class Login extends Component {
    config = {
        navigationStyle: 'custom',
    }

    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        }
    }

    componentDidMount() {
        isLoggin().then((res) => {
            console.log(4441, res)
        }).catch((err) => {
            console.log(4442, err)
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
                Taro.eventCenter.trigger('Login.complete')
                this.setState({
                    context: res.result,
                    userInfo: res.result
                }, () => {
                    Taro.navigateBack()
                })
            })
        }
    }

    handleCancle() {
        Taro.navigateBack();
    }

    render() {
        const { screenWidth, screenHeight, windowHeight, statusBarHeight } = Taro.getSystemInfoSync()

        console.log(111, screenWidth, screenHeight, windowHeight, statusBarHeight)

        return (
            <View className='loginPage'>
                <View className='loginPage__note'>
                    <Text className='loginPage__note-text'>登录后方可使用全部功能哦\n请在稍后的提示框中点击“允许”</Text>
                </View>
                <View className='loginPage__buttons'>
                    <AtButton
                        customStyle={{width: '100px'}}
                        type="secondary"
                        onClick={ () => this.handleCancle()}
                    >取消</AtButton>
                    <AtButton
                        customStyle={{width: '100px'}}
                        type="primary"
                        openType="getUserInfo"
                        onGetUserInfo={(e) => this.onGotUserInfo(e)}
                    >登录</AtButton>
                </View>
            </View>
        )
    }
}