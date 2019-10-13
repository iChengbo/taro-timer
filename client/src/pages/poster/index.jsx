import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Picker } from '@tarojs/components'

import { AtInput, AtSwitch, AtButton } from 'taro-ui'

export default class Poster extends Component {

    config = {
        navigationBarTitleText: '海报',
    }

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <View className='container'>
                <Text>海报页面</Text>
            </View>
        )
    }
}