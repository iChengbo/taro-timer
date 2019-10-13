import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        }
    }

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    getLogin = (userInfo) => {
        Taro.cloud
            .callFunction({
                name: "login",
                data: {userInfo}
            })
            .then(res => {
                this.setState({
                    context: res.result
                })
                console.log(444, res)
            })
    }

    onGotUserInfo(e) {
        console.log('e', e)
        let userInfo = e.detail.userInfo
        this.setState({
            userInfo: userInfo
        }, () => {
            this.getLogin(userInfo)
        })
    }

    render() {
        return (
            <View className='index'>
                <Button openType='getUserInfo' onGetUserInfo={(e) => this.onGotUserInfo(e)}>授权后存储用户</Button>
                <View style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Text>{userInfo.avatarUrl}</Text>
                    <Text>{userInfo.city}</Text>
                    <Text>{userInfo.country}</Text>
                    <Text>{userInfo.gender}</Text>
                    <Text>{userInfo.language}</Text>
                    <Text>{userInfo.nickName}</Text>
                    <Text>{userInfo.province}</Text>
                </View>
            </View>
        )
    }
}
