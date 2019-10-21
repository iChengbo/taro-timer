import Taro, { Component } from '@tarojs/taro'
// 引入对应的组件
import { View, Button, Canvas } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

    config = {
        navigationStyle: 'custom',
    }

    /**
    * 初始化信息
    */
    constructor() {
        this.state = {
            // 用户信息
            userInfo: {},
            // 是否展示canvas
            isShowCanvas: false,
            fileID: 'cloud://weapp-dev-id.7765-weapp-dev-id-1300324782/my-image.jpeg',
            fileList: [],
        }
    }

    componentDidMount() {
        const { fileID } = this.state;
        Taro.cloud.downloadFile({
            fileID: fileID,
        }).then(res => {

        })

        Taro.cloud.getTempFileURL({
            fileList: [fileID]
        }).then(res => {
            console.log(res.fileList)
            this.setState({
                fileList: res.fileList
            })
        })
    }

    /**
     * getUserInfo() 获取用户信息
     */
    getUserInfo(e) {
        if (!e.detail.userInfo) {
            Taro.showToast({
                title: '获取用户信息失败，请授权',
                icon: 'none'
            })
            return
        }
        this.setState({
            isShowCanvas: true,
            userInfo: e.detail.userInfo
        }, () => {
            // 调用绘制图片方法
            this.drawImage()
        })
    }

    // componentDidMount() {
    //     const {pixelRatio} = Taro.getSystemInfoSync();
    //     console.log('pixelRatio', pixelRatio)
    // }

    /**
     * drawImage() 定义绘制图片的方法
     */
    drawImage() {
        const { fileList } = this.state
        // 创建canvas对象
        let ctx = Taro.createCanvasContext('cardCanvas')

        // 绘制二维码
        Taro.cloud.downloadFile({
            fileID: 'cloud://weapp-dev-id.7765-weapp-dev-id-1300324782/my-image.jpeg',
        }).then(res => {
            console.log('tempFilePath', res.tempFilePath)
            console.log('dddddddddddd', fileList[0].tempFileURL)
            // 绘制背景图
            ctx.drawImage(res.tempFilePath, 0, 0, 320, 450);

            ctx.setFontSize(24)
            ctx.setFillStyle('#ffffff')
            ctx.setTextAlign('center')
            ctx.fillText('我们在一起已经', 150, 200)

            ctx.setFontSize(16)
            ctx.setFillStyle('#ffffff')
            ctx.setTextAlign('center')
            ctx.fillText('79天18时24分35秒', 150, 240)

            // ctx.restore()

            // 将以上绘画操作进行渲染
            // ctx.draw()
        }).then(() => {
            Taro.cloud.downloadFile({
                fileID: 'cloud://weapp-dev-id.7765-weapp-dev-id-1300324782/images/下载.png',
                success: res => {
                    // 绘制背景图
                    ctx.drawImage(res.tempFilePath, 250, 380, 60, 60);
                    ctx.restore()

                    // 将以上绘画操作进行渲染
                    ctx.draw()
                }
            })
        })
    }

    saveCard() {
        const {pixelRatio} = Taro.getSystemInfoSync();
        Taro.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 320,
            height: 450,
            destWidth: 320 * pixelRatio,
            destHeight: 450 * pixelRatio,
            canvasId: 'cardCanvas',
            fileType: 'png'
        }).then(res => {
            return Taro.saveImageToPhotosAlbum({
                filePath: res.tempFilePath
            })
        }).then((saveRes) => {
            console.log('saveRes', saveRes)
            if (saveRes.errMsg === 'saveImageToPhotosAlbum:ok') {
                Taro.showModal({
                    title: '图片保存成功',
                    content: '图片成功保存到相册了，快去发朋友圈吧~',
                    showCancel: false,
                    confirmText: '确认'
                })
            } else {
                Taro.showModal({
                    title: '图片保存失败',
                    content: '请重新尝试!',
                    showCancel: false,
                    confirmText: '确认'
                })
            }
        })
    }

    render() {
        let { isShowCanvas, fileList } = this.state
        return (
            <View className='index'>
                <Image
                    className='index_img'
                    src={fileList[0].tempFileURL}
                    mode='aspectFill'
                ></Image>
                <Button onGetUserInfo={this.getUserInfo} openType="getUserInfo" type="primary" size="mini">打卡</Button>
                {
                    isShowCanvas &&
                    <View className="canvas-wrap">
                        <Canvas
                            id="card-canvas"
                            className="card-canvas"
                            style="width: 320px; height: 450px"
                            canvasId="cardCanvas" >
                        </Canvas>
                        <Button onClick={this.saveCard} className="btn-save" type="primary" size="mini">保存到相册</Button>
                    </View>
                }
            </View>
        )
    }
}

