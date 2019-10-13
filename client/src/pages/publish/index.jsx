import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Picker } from '@tarojs/components'

import { AtInput, AtSwitch, AtButton } from 'taro-ui'

export default class PagePicker extends Component {

    config = {
        navigationBarTitleText: '新建',
    }

    constructor(props) {
        super(props);
        this.state = {
            timeSel: '00:00',
            dateSel: '2018-04-22',
            value: ''
        }
    }

    handleChange(value) {
        this.setState({
            value
        })
        // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
        return value
    }
    onTimeChange = e => {
        this.setState({
            timeSel: e.detail.value
        })
    }
    onDateChange = e => {
        this.setState({
            dateSel: e.detail.value
        })
    }
    render() {
        return (
            <View className='container'>
                <AtInput
                    name='value'
                    title='标题'
                    type='text'
                    placeholder='标准五个字'
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                />
                <View className='page-body'>
                    <View className='page-section'>
                        <View>
                            <Picker mode='date' onChange={this.onDateChange}>
                                <AtInput
                                    name='value'
                                    title='日期'
                                    type='text'
                                    placeholder='标准五个字'
                                    value={this.state.dateSel}
                                />
                            </Picker>
                        </View>
                    </View>
                    <View className='page-section'>
                        <View>
                            <Picker mode='time' onChange={this.onTimeChange}>
                                <View className='picker'>
                                    <AtInput
                                        name='value'
                                        title='时间'
                                        type='text'
                                        placeholder='标准五个字'
                                        value={this.state.timeSel}
                                    />
                                </View>
                            </Picker>
                        </View>
                    </View>
                <AtSwitch checked={true} title='置顶' />
                </View>
                <View className='save-btn'>
                    <AtButton type='primary' circle={true}>保存</AtButton>
                </View>
            </View>
        )
    }
}