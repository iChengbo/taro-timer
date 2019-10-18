import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button } from "@tarojs/components"
import PropTypes from 'prop-types'

import { calculateTime, transformTime } from '../../utils/timeFunctions'
import './index.scss'
import { COLOR } from '../../constants/colors'

const BgColors = {
    
}

export default class TimeListItem extends Component {
    constructor(props) {
        super(props);
        let goalSeconds = transformTime(props.dateSel, props.timeSel) / 1000;
        let seconds = props.isCountDown? goalSeconds : (Date.parse(new Date())/ 1000 - goalSeconds);
        this.state = {
            timer: null,
            goalSeconds: goalSeconds,
            seconds: seconds,
            timeDistance: Date.parse(new Date())/1000 - goalSeconds,
            isTimeOut: false,
            _day: '0',
            _hours: '00',
            _minutes: '00',
            _seconds: '00',
        }
    }

    componentWillMount() {}
 
    componentDidMount() {
        this.props.isCountDown? this.countDown() : this.countUp()
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.isCountDown !== nextProps.isCountDown) {
            return true;
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
    countUp(startTime = this.state.goalSeconds) {

        const { day, hours, minutes, seconds } = calculateTime(this.state.seconds)
        this.setState({
            _day: day,
            _hours: hours,
            _minutes: minutes,
            _seconds: seconds
        })

        // 
        const countSeconds = Date.parse(new Date()) / 1000 - startTime;
        // console.log(Date.parse(new Date()) / 1000, startTime, countSeconds )
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
        // console.log(9999, new Date(this.state.goalSeconds*1000), this.state.goalSeconds, this.state.goalSeconds - Date.parse(new Date())/1000 )

        const { day, hours, minutes, seconds } = calculateTime(this.state.seconds)
        // console.log(this.state.seconds, '计算后', day, hours, minutes, seconds)
        this.setState({
            _day: day,
            _hours: hours,
            _minutes: minutes,
            _seconds: seconds
        })
        const { goalSeconds, timeDistance } = this.state;
        // 注意：通过时间差从而时刻校准计时
        const countSeconds = goalSeconds - +(new Date())/1000
        // const countSeconds = this.state.seconds - 1
        // console.log('校准', goalSeconds, Date.parse(new Date())/1000, timeDistance,Date.parse(new Date())/1000 - timeDistance , countSeconds)
        this.setState({
            seconds: countSeconds
        })

        if (countSeconds < 0) {
            this.clearTimer()
            this.props.onCountEnd && this.props.onCountEnd()
            let overSeconds = +(new Date()) / 1000 - goalSeconds
            // console.log('fuck 到点了', +(new Date()), goalSeconds, overSeconds)
            this.setState({
                seconds: overSeconds,
                isTimeOut: true,
            }, () => {
                this.countUp(goalSeconds)
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
    
    onClick() {
        this.props.onClick && this.props.onClick()
    }
    onLongPress() {
        this.props.onLongPress && this.props.onLongPress()
    }

    render() {
        const { _day, _hours, _minutes, _seconds, isTimeOut } = this.state
        const { title, dateSel, timeSel, isCountDown } = this.props

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
            <View className='timeListItem' onClick={ () => this.onClick() } onLongPress={ () => this.onLongPress() }>
                <View className='timeListItem__tag' style={{ backgroundColor: bgColor }}></View>
                <View className='fstLineWrap'>
                    <View className='fstLeftWrap'>
                        <Text className='fstLeftWrap-text'>{title}</Text>
                    </View>
                    <View className='fstRightWrap'>
                        {!!isCountDown && !!isTimeOut && <Text className='timeFormat' style={{color: bgColor}}>超出</Text> }
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
                    <Text className='timeGoal'>{`${dateSel} ${timeSel}`}</Text>
                </View>
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
    dateSel: PropTypes.string,
    timeSel: PropTypes.string,
    startTime: PropTypes.number,
    endTime: PropTypes.number,
    onCountEnd: PropTypes.func,
    onLongPress: PropTypes.func,
    onClick: PropTypes.func,
}
