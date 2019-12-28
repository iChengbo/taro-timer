import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'

import { AtInput, AtButton, AtImagePicker, AtActivityIndicator } from 'taro-ui'

import { getTimeInfo } from '../../utils/timeFunctions';
import { uploadImage, deleteImageList } from '../../utils/fileManager';
import { postTimer, updateTimerById, getTimerById } from '../../apis/timer';
import { throttle } from 'lodash';
import './index.scss';


export default class Publish extends Component {

    config = {
        navigationBarTitleText: '新建',
    }

    constructor(props) {
        super(props);
        const { year, month, day, hours, minutes } = getTimeInfo();
        this.state = {
            title: '',
            dateSel: `${year}-${month}-${day}`,
            timeSel: `${hours}:${minutes}`,
            isCountDown: false,
            isTop: false,
            loading: true,
            isSaving: false,
            images: [],
        }

        this.handleSave = throttle(this.handleSave, 1000);
    }

    componentDidMount() {
        const { _id } = this.$router.params;
        console.log('_id', _id);
        if (!!_id) {
            getTimerById({
                _id
            }).then(res => {
                const { title, dateSel, timeSel, isCountDown, isTop, images } = res;
                console.log('获取时间事件成功', res)
                this.setState({
                    title,
                    dateSel,
                    timeSel,
                    isCountDown,
                    isTop,
                    loading: false,
                    images
                })
            }).catch(err => {
                console.log('获取时间事件失败', err)
                this.setState({
                    loading: false,
                })
                Taro.showToast({
                    title: '获取数据失败',
                    icon: 'loading'
                })
            })
        } else {
            this.setState({
                loading: false,
            })
        }
    }

    handleChangeImages(images) {
        console.log('图片资源', images);
        this.setState({
            images
        }, () => {
            uploadImage(images[0]).then(fileId => {
                if (!!fileId) {
                    console.log('上传后的fildId', fileId);
                    // 先把之前的给删除
                    // deleteImageList(this.state.images).then(res => {
                        // console.log('删除操作', res);
                        this.setState({
                            images: [].concat([{
                                url: fileId
                            }])
                        })
                    // })
                }
            })
        })
    }

    handleSave() {
        const { _id } = this.$router.params;
        const { title, dateSel, timeSel, isCountDown, isTop, images } = this.state;
        const data = {
            title,
            dateSel,
            timeSel,
            isCountDown,
            isTop,
            images
        }
        this.setState({
            isSaving: true,
        }, () => {
            console.log('data', data)
            if (!_id) {
                postTimer(data).then((res) => {
                    if (res.errMsg == 'collection.add:ok') {
                        console.log('存储成功', res)
                        Taro.eventCenter.trigger('Publish.complete')
                        Taro.navigateBack()
                    } else {
                        console.log('存储失败', res)
                    }
                }).catch(err => {
                    console.log('存储失败', err)
                })
            } else {
                // 修改
                updateTimerById(_id, data).then(res => {
                    if (res.errMsg == 'document.update:ok') {
                        console.log('更新成功', res);
                        Taro.eventCenter.trigger('Publish.complete');
                        Taro.navigateBack();
                    } else {
                        console.log('更新失败', res)
                    }
                }).catch(err => {
                    console.log('更新失败', err)
                })
            }
        })
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

    render() {
        const { dateSel, timeSel, isCountDown, title, isSaving, images } = this.state;
        const { screenWidth, windowHeight } = Taro.getSystemInfo()
        console.log('图片', images)

        if (this.state.loading) {
            return (
                <View className='container'>
                    <AtActivityIndicator mode='center' size={96} content='努力加载中...'></AtActivityIndicator>
                </View>
            )
        }

        return (
            <View className='container'>
                <View className='slctTimer'>
                    <AtButton full={false} size='small' circle={true} type={isCountDown ? 'secondary' : 'primary'} onClick={() => this.onIsCountDownChange(false)}>正计时</AtButton>
                    <AtButton full={false} size='small' circle={true} type={isCountDown ? 'primary' : 'secondary'} onClick={() => this.onIsCountDownChange(true)}>倒计时</AtButton>
                </View>
                <AtInput
                    focus={true}
                    name='value'
                    title='标题'
                    type='text'
                    placeholder='请输入事件标题'
                    value={title}
                    onChange={this.handleChange.bind(this)}
                />
                <View className='page-body'>
                    <View className='page-section'>
                        <View>
                            <Picker mode='date' value={dateSel} onChange={this.onDateChange}>
                                <AtInput
                                    name='value'
                                    title='日期'
                                    type='text'
                                    editable={false}
                                    value={dateSel}
                                />
                            </Picker>
                        </View>
                    </View>
                    <View className='page-section'>
                        <View>
                            <Picker mode='time' value={timeSel} onChange={this.onTimeChange}>
                                <View className='picker'>
                                    <AtInput
                                        name='value'
                                        title='时间'
                                        type='text'
                                        editable={false}
                                        value={timeSel}
                                    />
                                </View>
                            </Picker>
                        </View>
                    </View>
                    {/* <AtSwitch title='置顶' onChange={(value) => this.onIsTopChange(value)} /> */}
                    {/* <AtImagePicker
                        length={1}
                        count={1}
                        showAddBtn={images.length < 1}
                        files={images}
                        onChange={() => this.handleChangeImages(images)}
                    >
                    </AtImagePicker> */}
                </View>
                <View className='save-btn'>
                    <AtButton type='primary' loading={isSaving} disabled={!title && !isSaving} circle={true} onClick={() => this.handleSave()}>保存</AtButton>
                </View>
            </View>
        )
    }
}