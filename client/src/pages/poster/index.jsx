import Taro, { Component } from '@tarojs/taro';
// 引入对应的组件
import { View, Button, Canvas } from '@tarojs/components';
import { shuffle } from 'lodash';

import './index.scss';

import { getPosterList } from '../../apis/poster';
import { getTimerById } from '../../apis/timer';

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
            fileList: [],
            currentPosterIndex: 0,
            tempFilePath: '',
            qcodePath: '',
        }
    }

    componentDidMount() {
        const { _id } = this.$router.params;
        console.log('_id', _id);
        if (!!_id) {
            getTimerById({
                _id
            }).then(res => {
                const { title, dateSel, timeSel, isCountDown, isTop } = res.result;
                console.log('获取时间事件成功', res)
            }).catch(err => {
                console.log('获取时间事件失败', err)
                Taro.showToast({
                    title: '获取数据失败',
                    icon: 'loading'
                })
            })
        }

        Taro.cloud.downloadFile({
            fileID: 'cloud://weapp-dev-id.7765-weapp-dev-id-1300324782/images/下载.png'
        }).then(res => {
            this.setState({
                qcodePath: res.tempFilePath
            })
        })

        // 获取云存储海报列表(默认的)
        getPosterList({}).then(res => {
            console.log('海报列表', res)
            // 用云文件 ID 换取真实链接（默认一天）
            return res.result.map((item, index) => {
                return item.fileID;
            })
        }).then((fileIDList) => {
            console.log('文件id', fileIDList)
            return Taro.cloud.getTempFileURL({
                fileList: fileIDList
            })
        }).then((res) => {
            console.log('临时链接', res.fileList)
            this.setState({
                fileList: res.fileList
            })
            // 下载资源
            Taro.cloud.downloadFile({
                fileID: res.fileList[0].fileID
            }).then((res) => {
                console.log('rrrrr', res.tempFilePath)
                this.setState({
                    tempFilePath: res.tempFilePath
                })
            })
        })
    }

    // 定义绘制图片的方法
    drawImage() {
        const { tempFilePath, qcodePath } = this.state
        // 创建canvas对象
        let ctx = Taro.createCanvasContext('cardCanvas')

        ctx.setFillStyle('#ffffff')
        ctx.fillRect(0, 0, 300, 450)


        // 绘制背景图
        ctx.drawImage(tempFilePath, 10, 10, 280, 380);

        ctx.setFontSize(24)
        ctx.setFillStyle('#ffffff')
        ctx.setTextAlign('center')
        ctx.fillText('我们在一起', 150, 200)

        ctx.setFontSize(28)
        ctx.setFillStyle('#ffffff')
        ctx.setTextAlign('center')
        ctx.fillText('79天18时24分35秒', 150, 240)

        // ctx.restore()
        // 绘制二维码
        ctx.drawImage(qcodePath, 240, 395, 50, 50);
        ctx.restore()

        // 将以上绘画操作进行渲染
        ctx.draw()
    }

    // 保存绘图至本地相册
    saveCard() {
        const { pixelRatio } = Taro.getSystemInfoSync();
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
            let noticeTitle = '图片保存成功', noticeContent = '图片成功保存到相册了\n快去发朋友圈吧~';
            if (saveRes.errMsg != 'saveImageToPhotosAlbum:ok') {
                noticeTitle = '图片保存失败';
                noticeContent = '请重新尝试!'
            }
            Taro.showModal({
                title: noticeTitle,
                content: noticeContent,
                showCancel: false,
                confirmText: '确认',
                success: () => {
                    this.setState({
                        isShowCanvas: false
                    })
                }
            })
        })
    }

    render() {
        let { isShowCanvas, fileList, currentPosterIndex } = this.state
        console.log(isShowCanvas)
        return (
            <View className='index'>
                <Image
                    className='index_img'
                    src={fileList[currentPosterIndex].tempFileURL}
                    mode='aspectFill'
                ></Image>
                <Button type="primary" size="mini">打卡</Button>
                {
                    isShowCanvas &&
                    <View className="canvas-wrap">
                        <Canvas
                            id="card-canvas"
                            className="card-canvas"
                            style="width: 300px; height: 450px"
                            canvasId="cardCanvas" >
                        </Canvas>
                        <Button onClick={this.saveCard} className="btn-save" type="primary" size="mini">保存到相册</Button>
                    </View>
                }
            </View>
        )
    }
}

