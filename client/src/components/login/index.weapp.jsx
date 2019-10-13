import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        }
    }

    onGotUserInfo(e) {
        console.log(e)
        const { detail } = e
        if (detail.errMsg.endsWith('ok')) {
            const userInfo = JSON.parse(detail.rawData)
            const { nickName, gender, avatarUrl, city, country, language, province } = userInfo
            Taro.cloud
                .callFunction({
                    name: 'postUserInfo',
                    data: {
                        name: nickName,
                        gender: gender,
                        avatarUrl: avatarUrl,
                        city: city,
                        country: country,
                        language: language,
                        province: province
                    },
                })
                .then(res => {
                    this.setState({
                        context: res.result,
                        userInfo: res.result
                    })
                })
        }
    }

    render() {
        const avatar = <Image src={this.state.userInfo.avatarUrl} />

        return (
          <View className="index">
            <Button
              openType="getUserInfo"
              onGetUserInfo={(e) => this.onGotUserInfo(e) }
            >
              授权
            </Button>
            {this.state.userInfo.avatarUrl && avatar}
            <View>{this.state.userInfo.name}</View>
          </View>
        )
    }
}
