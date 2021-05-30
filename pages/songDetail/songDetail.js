// pages/songDetail/songDetail.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    song:{},
    musicId:'',
    musicLink:'',
    currentTime:'00:00',
    dutationTime:'00:00',
    currentWidth:0
  },

  handleMusicPlay(){
    let isPlay = !this.data.isPlay
    // this.setData({
    //   isPlay
    // })
    let {musicId} = this.data
    this.musicControl(isPlay,musicId)
  },

  // 控制音乐播放及暂停功能函数
  async musicControl(isPlay,musicId,musicLink){
    
    if(isPlay){
      if(!musicLink){
        // 获取音乐链接
        let musicLinkData = await request('/song/url',{id:musicId})
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name
    }else{
      this.backgroundAudioManager.pause()
    }
  },

  async getMusicInfo(musicId){
    let songData = await request('/song/detail',{ids:musicId})
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song:songData.songs[0],
      durationTime
    })
    wx.setNavigationBarTitle({
      title: this.data.song.name
    })
  },

  // 切换歌曲
  handleSwitch(event){
    let type = event.currentTarget.id
    this.backgroundAudioManager.stop()
    PubSub.subscribe('musicId',(msg,musicId) => {
      this.getMusicInfo(musicId)
      this.musicControl(true,musicId)
      PubSub.unsubscribe('musicId')
    })
    PubSub.publish('switchType',type)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId)

    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      this.setData({
        isPlay:true
      })
    }
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    //监听音乐播放的实时进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450
      this.setData({
        currentTime,
        currentWidth
      })
    })

    //监听音乐播放结束
    this.backgroundAudioManager.onEnded(() => {
      PubSub.publish('switchType','next')
      this.setData({
        currentWidth:0,
        currentTime:'00:00'
      })
    })
  },

  changePlayState(isPlay){
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
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