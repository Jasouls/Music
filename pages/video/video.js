// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],
    navId:'',
    videoList:[],
    videoId:'',
    videoUpdateTime:[],
    isTriggered:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupData()
  },

  async getVideoGroupData(){
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList:videoGroupListData.data.slice(0,14),
      navId: videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId)
  },

  //获取视频列表数据
  async getVideoList(navId){
    let index = 0
    let videoListData = await request(`/video/group`,{id:navId}) 
    wx.hideLoading()
    let videoList = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList,
      isTriggered:false
    })
  },

  changeNav(event){
    let navId = event.currentTarget.dataset.id
    this.setData({
      navId,
      videoList:[]
    })
    wx.showLoading({
      title: '正在加载'
    })
    this.getVideoList(this.data.navId)
  },

  // 点击播放回调
  handlePlay(event){
    this.vid = event.currentTarget.id
    // if(this.vid === vid || !this.videoContext){
    //   this.vid = vid
    //   this.videoContext = wx.createVideoContext(vid)
    // }else{
    //   this.videoContext.stop()
    //   this.videoContext = wx.createVideoContext(vid)
    //   this.vid = vid
    // }

    //视频优化，用图片代替未播放视频
    this.setData({
      videoId:this.vid
    })
    
    this.videoContext = wx.createVideoContext(this.vid)
    
    //判断当前视频是否有播放记录
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === this.vid)
    if(videoItem){
      this.videoContext.seek(videoItem.currentTime)
    }
  
    // this.videoContext.play()
  },

  //记录视频播放时间
  handleTimeUpdate(event){
    let videoTimeObj = {
      vid:event.currentTarget.id,
      currentTime:event.detail.currentTime
    }
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if(videoItem){
      videoItem.currentTime = event.detail.currentTime
    }else{
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },

  //视频结束时触发
  handleEnded(event){
    let {videoUpdateTime} = this.data
    let index = videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id)
    videoUpdateTime.splice(index,1)
    this.setData({
      videoUpdateTime
    })
  },

  //下拉刷新
  handleRefresher(){
    this.getVideoList(this.data.navId)
  },

  //上拉加载更多
  handleToLower(){
    let newVideo = this.data.videoList.slice(0,8)
    let newArr = this.data.videoList
    newArr.push(...newVideo)
    this.setData({
      videoList:newArr
    })
  },

  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search'
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