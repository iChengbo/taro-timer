/**
 * 
 */


// 用户相关
const USER = {
    '/user/one': 'USER',            // 查询用户信息
    '/user/post': 'USER',           // 新增用户
    '/user/update': 'USER',         // 修改用户信息
}

// 纪念事件相关
const TIMER = {
    '/timer/list': 'TIMER',               // 获取全部列表
    '/timer/one': 'TIMER',                // 根据id获取
    '/timer/post': 'TIMER',               // 新增
    '/timer/update': 'TIMER',             // 根据id修改
    '/timer/del': 'TIMER',                // 根据id删除
}


// 活动相关
const ACTIVITY = {

}

module.exports = {
    ...USER,
    ...TIMER,
    ...ACTIVITY,
}