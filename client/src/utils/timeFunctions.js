/**
 * 计算时间, 将秒转换为天、时、分、秒
 */
export const calculateTime = (duration) => {
    let [day, hours, minutes, seconds] = [0, 0, 0, 0]
    
    if (duration > 0) {
        day = Math.floor(duration / (60 * 60 * 24))
        hours = Math.floor(duration / (60 * 60)) - (day * 24)
        minutes = Math.floor(duration / 60) - (day * 24 * 60) - (hours * 60)
        seconds = Math.floor(duration) - (day * 24 * 60 * 60) - (hours * 60 * 60) - (minutes * 60)
    }

    return {
        day,
        hours: hours < 10 ? `0${hours}`: hours,
        minutes: minutes < 10 ? `0${minutes}`: minutes,
        seconds: seconds < 10 ? `0${seconds}`: seconds,
    }
}