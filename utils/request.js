//发送ajax请求
import config from './config'
export default (url,data={},method='GET') => {
  return new Promise((resolve,reject) => {
    wx.request({
      url:config.host + url,
      data,
      method,
      header:{
        cookie:wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
      },
      success: (res) => {
        if(data.isLogin){
          wx.setStorage({
            key:'cookies',
            data:res.cookies
          })
        }
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}