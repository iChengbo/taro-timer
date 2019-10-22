import Taro, { Component } from '@tarojs/taro'
import Index from './pages/home'

import './app.scss'
import 'taro-ui/dist/style/index.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/home/index',
      'pages/poster/index',
      'pages/login/index',
      'pages/publish/index',
      'pages/user/index',
      'pages/user/feedBack/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#6190E8',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'white'
    },
    cloud: true,
    tabBar: {
      list: [{
        pagePath: "pages/home/index",
        text: "首页",
        iconPath: "./images/tab-bar/home.png",
        selectedIconPath: "./images/tab-bar/home-active.png"
      }, {
        pagePath: "pages/user/index",
        text: "我的",
        iconPath: "./images/tab-bar/user.png",
        selectedIconPath: "./images/tab-bar/user-active.png"
      }
      ]
    }
  }

  componentDidMount() {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init({
        env: process.env.NODE_ENV,
        traceUser: true
      })
    }
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
