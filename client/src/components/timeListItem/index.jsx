import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"
import PropTypes from 'prop-types'

import { AtTag, AtProgress } from 'taro-ui'

import { calculateTime } from '../../utils/timeFunctions'
import './index.scss'
import { COLOR } from '../../constants/colors'

const BgColors = {
    
}

export default class TimeListItem extends Component {
    constructor(props) {
        super(props)
        let seconds = props.isCountDown? (props.endTime - props.startTime) / 1000 : (Date.parse(new Date()) - props.startTime) / 1000
        this.state = {
            timer: null,
            seconds: seconds,
            timeDistance: (Date.parse(new Date()) - props.startTime) / 1000,
            isTimeOut: false,
            _day: '0',
            _hours: '00',
            _minutes: '00',
            _seconds: '00',
        }
    }

    clearTimer() {
        if (this.state.timer) {
            clearTimeout(this.state.timer)
            this.setState({
                timer: null,
            })
        }
    }

    // 正计时
    countUp(startTime = this.props.startTime) {
        const { day, hours, minutes, seconds } = calculateTime(this.state.seconds)
        this.setState({
            _day: day,
            _hours: hours,
            _minutes: minutes,
            _seconds: seconds
        })

        // 
        const countSeconds = (Date.parse(new Date()) - startTime) / 1000
        this.setState({
            seconds: countSeconds
        })

        let t = setTimeout(() => {
            this.countUp(startTime)
        }, 1000)
        this.setState({
            timer: t
        })
    }

    // 倒计时
    countDown() {
        const { day, hours, minutes, seconds } = calculateTime(this.state.seconds)
        this.setState({
            _day: day,
            _hours: hours,
            _minutes: minutes,
            _seconds: seconds
        })
        // 注意：通过时间差从而时刻校准计时
        const countSeconds = this.props.endTime/1000 - (Date.parse(new Date())/1000 - this.state.timeDistance)
        // const countSeconds = this.state.seconds - 1
        // console.log(9999, Date.parse(new Date())/1000 - this.state.timeDistance)
        this.setState({
            seconds: countSeconds
        })

        if (countSeconds < 0) {
            this.clearTimer()
            this.props.onCountEnd && this.props.onCountEnd()
            let overSeconds = (Date.parse(new Date()) - this.props.endTime) / 1000
            console.log(Date.parse(new Date()), this.props.endTime, overSeconds)
            this.setState({
                seconds: overSeconds,
                isTimeOut: true,
            }, () => {
                this.countUp(this.props.endTime)
            })
            return
        }

        let t = setTimeout(() => {
            this.countDown()
        }, 1000)
        this.setState({
            timer: t
        })
    }

    componentWillMount() { }

    componentDidMount() {
        this.props.isCountDown? this.countDown() : this.countUp()
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer)
    }

    componentDidShow() { }

    componentDidHide() { }
    
    onLongPress() {
        this.props.onLongPress && this.props.onLongPress()
    }

    render() {
        const { _day, _hours, _minutes, _seconds, isTimeOut } = this.state
        const { title, isCountDown } = this.props

        let bgColor = '#292b2e'
        if(!isCountDown) {
            bgColor = COLOR.GREEN_1
        } else {
            if(isTimeOut) {
                bgColor = COLOR.RED_1
            } else {
                bgColor = COLOR.YELLOW_1
            }
        }
        return (
            <View className='timeListItem' onLongPress={ () => this.onLongPress() }>
                <View className='timeListItem__tag' style={{ backgroundColor: bgColor }}></View>
                <View className='fstLineWrap'>
                    <View className='fstLeftWrap'>
                        <Text className='fstLeftWrap-text'>{title}</Text>
                    </View>
                    <View className='fstRightWrap'>
                        {!!isTimeOut && <Text className='timeFormat' style={{color: bgColor}}>超出</Text> }
                        {!!_day && <Text className='timeNumber_day'>{_day}</Text>}
                        {!!_day && <Text className='timeFormat'>天</Text>}
                        <Text className='timeNumber'>{_hours}</Text>
                        <Text className='timeFormat'>时</Text>
                        <Text className='timeNumber'>{_minutes}</Text>
                        <Text className='timeFormat'>分</Text>
                        <Text className='timeNumber'>{_seconds}</Text>
                        <Text className='timeFormat'>秒</Text>
                    </View>
                </View>
                <View className='sndLineWrap'>
                    <Text className='timeGoal'>2019.10.12 00:00 星期六</Text>
                </View>
                {/* <View className='progressWrap'>
                    <AtProgress percent={50} strokeWidth={4} status='progress' isHidePercent></AtProgress>
                </View> */}
            </View>
        )
    }
}

TimeListItem.defaultProps = {
    isCountDown: true,
    title: '事件标题',
}
TimeListItem.propTypes = {
    isCountDown: PropTypes.bool,
    title: PropTypes.string,
    startTime: PropTypes.number,
    endTime: PropTypes.number,
    onCountEnd: PropTypes.func,
    onLongPress: PropTypes.func,
}
