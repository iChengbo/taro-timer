
const weekArr = ['日', '一', '二', '三', '四', '五', '六']

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

/**
 * 
 */
export const getTimeInfo = (time = new Date()) => {
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const day = time.getDate();

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    // 一星期的第几天
    const numWeek = time.getDay();
    // 星期几
    const week = numWeek == 0? 7 : (numWeek+1);
    const weekZH = weekArr[numWeek];

    return {
        year,
        month,
        day,
        hours: hours < 10 ? `0${hours}`: hours,
        minutes: minutes < 10 ? `0${minutes}`: minutes,
        seconds: seconds < 10 ? `0${seconds}`: seconds,
        numWeek,
        week,
        weekZH: `星期${weekZH}`,
    }
}

