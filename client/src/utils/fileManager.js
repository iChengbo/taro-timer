import Taro from '@tarojs/taro';

/**
 * https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/storage/api.html
 * 上传单张照片
 */
export function uploadImage({ url }) {
    if (/^cloud:/.test(url)) {
        console.log('该图片已经在云上了', url);
        return Promise.resolve(url);
    }
    const filePath = url;
    const name = +new Date() + '_' + (Math.random() + '').replace(/\./, '');
    const cloudPath = name + filePath.match(/\.[^.]+?$/)[0];
    return new Promise((resolve, reject) => {
        Taro.cloud.uploadFile({
            cloudPath: cloudPath,
            filePath: filePath,
            success: res => {
                // 返回文件 ID
                console.log(res.fileID)
                return resolve(res.fileID);
            },
            fail: err => {
                console.log('上传失败', err)
                return reject(err);
            }
        })
    })
}

/**
 * https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/storage/api.html
 * 批量删除图片
 * @param {*} imageList 
 */
export function deleteImageList(imageList) {
    return Taro.cloud.deleteFile({
        fileList: imageList
    });
}