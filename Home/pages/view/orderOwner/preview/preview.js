// pages/view/reportAccept/reportAccept.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src_bingimg:'',
    bigimghidden:true,
    nodeInfo:'',
    userInfos:''
  },
  enlarge:function(e){
    var src=e.currentTarget.dataset.src;
    var ind=e.currentTarget.dataset.ind
    var imgList = this.data.nodeInfo.entryReportStandards[0].imgs
    for (let i in imgList){
      imgList[i] = 'http://101.89.175.155/api/' + imgList[i]
    }
    wx.previewImage({
      current: imgList[ind],     //当前图片地址
      urls: imgList,               //所有要预览的图片的地址集合 数组形式
    })   
  },
  hideBigimg:function(){
    this.setData({ bigimghidden: true });    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var jlNodeInfo = wx.getStorageSync("jlNodeInfo");
    var userInfos = wx.getStorageSync("userInfos");
    var imgs=jlNodeInfo.entryReportStandards[0].imgs.split(',')
    imgs.pop()
    jlNodeInfo.entryReportStandards[0].imgs=imgs
    console.log(jlNodeInfo)
    this.setData({
      nodeInfo: jlNodeInfo,
      userInfos: userInfos
    })
  },
})