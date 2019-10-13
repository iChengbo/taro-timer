import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Picker } from '@tarojs/components'

import { AtInput, AtSwitch, AtButton, AtRadio } from 'taro-ui'

import { getTimeInfo } from '../../utils/timeFunctions';

export default class PagePicker extends Component {

    config = {
        navigationBarTitleText: '新建',
    }

    constructor(props) {
        super(props);
        const {year, month, day, hours, minutes} = getTimeInfo();
        this.state = {
            title: '',
            dateSel: `${year}-${month}-${day}`,
            timeSel: `${hours}:${minutes}`,
            isCountDown: true,
            isTop: false,
        }
    }

    handleSave() {
        const { title, dateSel, timeSel, isTop } = this.state;
        console.log(title, dateSel, timeSel, isTop, new Date())

    }

    handleChange(title) {
        this.setState({
            title
        })
        // 在小程序中，如果想改变 title 的值，需要 `return title` 从而改变输入框的当前值
        return title
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

    onIsTopChange = isChecked => {
        console.log(isChecked)
        this.setState({
            isTop: isChecked
        })
    }
    onIsCountDownChange = isChecked => {
        console.log(isChecked)
        this.setState({
            isCountDown: isChecked
        })
    }
    handleChangeRadio = e => {
        console.log(99, e)
    }

    render() {
        const { isCountDown } = this.state;
        return (
            <View className='container'>
                <View className='slctTimer'>
                    <View className='slctTimer-btn'>
                        <AtButton full={false} size='small' circle={true} type={isCountDown? 'secondary': 'primary'} onClick={ () => this.onIsCountDownChange(false) }>正计时</AtButton>
                    </View>
                    <View className='slctTimer-btn'>
                        <AtButton full={false} size='small' circle={true} type={isCountDown? 'primary': 'secondary'} onClick={ () => this.onIsCountDownChange(true) }>倒计时</AtButton>
                    </View>
                </View>
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
                                    editable={false}
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
                                        editable={false}
                                        placeholder='标准五个字'
                                        value={this.state.timeSel}
                                    />
                                </View>
                            </Picker>
                        </View>
                    </View>
                    {/* <AtSwitch title='倒计时' checked={this.state.isCountDown} onChange={ (value) => this.onIsCountDownChange(value) }/> */}
                    <AtSwitch title='置顶' onChange={ (value) => this.onIsTopChange(value) }/>
                </View>
                <View className='save-btn'>
                    <AtButton type='primary' circle={true} onClick={ () => this.handleSave() }>保存</AtButton>
                </View>
            </View>
        )
    }
}