import Taro, { Component } from '@tarojs/taro';
// 引入对应的组件
import { View, Button, Canvas } from '@tarojs/components';
import { AtIcon, AtButton, AtActivityIndicator } from 'taro-ui';
import { shuffle } from 'lodash';

import './index.scss';

import { getPosterList } from '../../apis/poster';
import { getTimerById, deleteTimerById } from '../../apis/timer';
import { calculateTime, transformTime, getTimeInfo } from '../../utils/timeFunctions';

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
            currentFileIndex: 0,
            backGroundImage: '',
            drawTempFilePath: '',
            qcodePath: '',
            showSheet: false,
            isLoading: true,
            timer: null,
            timerItem: {},
            // 时间差(秒)
            timeSeconds: 0,
            goalSeconds: 0,
        }
    }

    updateTimeSeconds() {
        const { goalSeconds } = this.state;
        const crtSeconds = +Date.now()/1000;
        let newTimeSeconds = Math.abs(goalSeconds - crtSeconds);
        this.setState({
            timeSeconds: newTimeSeconds
        }, () => {
            let timer = setTimeout(() => {
                this.updateTimeSeconds()
            }, 1000);
            this.setState({
                timer
            })
        })
    }

    componentDidMount() {
        const { _id } = this.$router.params;
        console.log('_id', _id);
        if (!!_id) {
            getTimerById({
                _id
            }).then(res => {
                const { title, dateSel, timeSel, isCountDown, isTop } = res.result;
                const goalSeconds = transformTime(dateSel, timeSel);
                const timeSeconds = Math.abs((goalSeconds - Date.now())/1000)
                console.log('获取时间事件成功', res, goalSeconds)
                this.setState({
                    timerItem: res.result,
                    timeSeconds,
                    goalSeconds: goalSeconds/1000
                }, () => {
                    this.updateTimeSeconds();
                })
            }).catch(err => {
                console.log('获取时间事件失败', err)
                Taro.showToast({
                    title: '获取数据失败',
                    icon: 'none'
                })
            })
        }

        // Taro.cloud.downloadFile({
        //     fileID: 'cloud://weapp-dev-id.7765-weapp-dev-id-1300324782/images/下载.png'
        // }).then(res => {
        //     this.setState({
        //         qcodePath: res.tempFilePath
        //     })
        // })
        this.setState({
            qcodePath: '../../images/qcode.png'
        })

        const {currentFileIndex} = this.state;
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
            let tmpFileList = shuffle(res.fileList);
            this.setState({
                fileList: tmpFileList,
                isLoading: false,
                backGroundImage: tmpFileList[currentFileIndex].tempFileURL
            })
            // 下载资源
            Taro.cloud.downloadFile({
                fileID: tmpFileList[currentFileIndex].fileID
            }).then((res) => {
                console.log('rrrrr', res.tempFilePath)
                this.setState({
                    drawTempFilePath: res.tempFilePath
                })
            })
        })
    }

    componentWillUnmount() {
        clearTimeout(this.state.timer)
    }

    // 微信小程序页面分享能力
    onShareAppMessage() {
        return {
            title: 'XXX\n29天12时11分10秒',
            path: '/pages/home/index'
        }
    }

    // 定义绘制图片的方法
    drawImage() {
        this.setState({
            isShowCanvas: true
        })
        const { drawTempFilePath, qcodePath, timerItem, timeSeconds } = this.state
        const { day, hours, minutes, seconds } = calculateTime(timeSeconds);

        // 创建canvas对象
        let ctx = Taro.createCanvasContext('cardCanvas')

        ctx.setFillStyle('#ffffff')
        ctx.fillRect(0, 0, 300, 450)


        // 绘制背景图
        ctx.drawImage(drawTempFilePath, 10, 10, 280, 380);

        ctx.setFontSize(12)
        ctx.setFillStyle('#ffffff')
        ctx.setTextAlign('left')
        // ctx.fillText(timerItem.dateSel.replace(/-/g, '/') + ' ' + timerItem.timeSel+':00', 20, 30)
        const crtTime = getTimeInfo()
        ctx.fillText(`${crtTime.year}/${crtTime.month}/${crtTime.day} ${crtTime.hours}:${crtTime.minutes}:${crtTime.seconds}`, 20, 30)

        ctx.setFontSize(24)
        ctx.setFillStyle('#ffffff')
        ctx.setTextAlign('center')
        ctx.fillText(timerItem.title, 150, 200)

        ctx.setFontSize(28)
        ctx.setFillStyle('#ffffff')
        ctx.setTextAlign('center')
        ctx.fillText(`${day}天${hours}时${minutes}分${seconds}秒`, 150, 240)

        ctx.restore()
        // 绘制二维码
        ctx.drawImage(qcodePath, 240, 395, 50, 50);
        ctx.restore()

        ctx.setFontSize(12)
        ctx.setFillStyle('#666666')
        ctx.setTextAlign('left')
        ctx.fillText('长按识别小程序码', 10, 410)
        ctx.fillText('打开极时刻，记录每一个美好的时刻', 10, 430)

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

    // 跳转到编辑页
    handleEditIcon() {
        const { _id } = this.$router.params;
        Taro.navigateTo({
            url: `/pages/publish/index?_id=${_id}`
        })
    }

    // 删除确认
    handleDeleteIcon() {
        const { _id } = this.$router.params;
        Taro.showModal({
            title: '提示',
            content: '是否删除该事件？',
            success: (res) => {
                if (res.confirm) {
                    deleteTimerById({ _id }).then(res => {
                        console.log('删除成功', res);
                        Taro.eventCenter.trigger('Poster.delete');
                        Taro.navigateBack();
                    })
                } else {
                    console.log('用户点击取消')
                }
            }
        })
    }

    // 隐藏绘制好的海报
    hiddenCanvas() {
        return;
        console.log('隐藏海报')
        this.setState({
            isShowCanvas: false
        })
    }

    // 更换背景图
    updateBackGroundImage() {
        Taro.chooseImage({
            count: 1,
            success: (res) => {
                var tempFilePaths = res.tempFilePaths;
                console.log('tempFilePaths', tempFilePaths)
                this.setState({
                    backGroundImage: tempFilePaths[0],
                    drawTempFilePath: tempFilePaths[0]
                })
            }
        })

    }

    render() {
        let { isShowCanvas, backGroundImage, isLoading, timerItem, timeSeconds} = this.state

        if (isLoading) {
            return (
                <View className='container'>
                    <AtActivityIndicator mode='center' size={96} content='努力加载中...'></AtActivityIndicator>
                </View>
            )
        }

        const { day, hours, minutes, seconds } = calculateTime(timeSeconds);

        return (
            <View className='poster'>
                <Image
                    className='poster__img'
                    src={backGroundImage}
                    mode='aspectFill'
                ></Image>
                <View className='poster__buttons'>
                    <AtButton circle={true} customStyle={{ border: 'none' }} onClick={() => this.handleEditIcon()}>
                        <AtIcon value='edit' size='20' color='#fff'></AtIcon>
                    </AtButton>
                    <AtButton circle={true} customStyle={{ border: 'none' }} onClick={() => this.handleDeleteIcon()}>
                        <AtIcon value='trash' size='20' color='#fff'></AtIcon>
                    </AtButton>
                    <AtButton openType='share' circle={true} customStyle={{ border: 'none' }}>
                        <AtIcon value='share' size='20' color='#fff'></AtIcon>
                    </AtButton>
                    <AtButton circle={true} customStyle={{ border: 'none' }} onClick={() => this.drawImage()}>
                        <AtIcon value='camera' size='20' color='#fff'></AtIcon>
                    </AtButton>
                    <AtButton circle={true} customStyle={{ border: 'none' }} onClick={() => this.updateBackGroundImage()}>
                        <AtIcon value='image' size='20' color='#fff'></AtIcon>
                    </AtButton>
                </View>
                <View className='poster__content'>
                    <Text className='poster__content-title'>{timerItem.title}</Text>
                    <Text className='poster__content-time'>{day}天{hours}时{minutes}分{seconds}秒</Text>
                </View>
                {
                    isShowCanvas &&
                    <View className="canvas-wrap" onClick={() => this.hiddenCanvas()}>
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

