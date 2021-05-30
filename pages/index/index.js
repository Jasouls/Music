// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recommendList:[],
    topList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //请求轮播图数据
    const resulta = await request("/banner",{type:2})
    this.setData({
      bannerList: resulta.banners
    })

    //请求推荐数据
    const resultb = await request('/personalized',{limit:10})
    this.setData({
      recommendList:resultb.result
    })

    //请求排行榜数据
    let index = 0
    let resultArr = []
    while(index < 5){
      let resultc = await request('/top/list?idx=1',{idx:index++})
      let topListItem = {
        name:resultc.playlist.name,
        tracks:resultc.playlist.tracks.slice(0,3)
      }
      resultArr.push(topListItem)
      //拿到数据立即更新，防止用户等待时间过长
      this.setData({
        topList:resultArr
      })
    }
  },

  toRecommendSong(){
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})