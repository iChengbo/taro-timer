import Taro, { Component, Config } from '@tarojs/taro'
import {
    ScrollView,
    View,
} from '@tarojs/components';

import { AtAvatar, AtFab, AtList, AtListItem } from "taro-ui";

import './index.scss';

export default class User extends Component {
    config = {
        navigationBarTitleText: '我'
    }

    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        }
    }

    handleClickListItem(pathAndParams) {
        Taro.navigateTo({
            url: pathAndParams,
        })
    }

    render() {
        return (
            <View className='user'>
                {/* <View className='user__fab'>
                    <Button openType={'share'}>分享</Button>
                    <AtFab openType='share'>
                        <Text className='at-fab__icon at-icon at-icon-add'></Text>
                    </AtFab>
                </View> */}
                <View className='user__header'>
                    <AtAvatar openData={{ type: 'userAvatarUrl' }} size='large' circle={true}></AtAvatar>
                </View>
                <View style={{ height: Taro.pxTransform(20) }}></View>
                <AtList hasBorder={false}>
                    {/* <AtListItem
                        onClick={() => this.handleClickListItem()}
                        title='关于我们'
                        arrow='right'
                        iconInfo={{ size: 25, color: '#000', value: 'tag' }}
                    /> */}
                    <AtListItem
                        onClick={() => this.handleClickListItem('/pages/user/feedBack/index')}
                        title='帮助与反馈'
                        arrow='right'
                        iconInfo={{ size: 25, color: '#000', value: 'message' }}
                    />
                </AtList>
                <View className='user__footer'>
                    {/* <Text>底部</Text> */}
                </View>
            </View>
        )
    }
}