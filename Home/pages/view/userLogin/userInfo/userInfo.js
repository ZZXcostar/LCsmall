// pages/quickLogon/quickLogon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo)
    this.setData({
      'userinfo': userInfo
    })
  },
  onShareAppMessage: function (res) {
    return {
      title: '绿城装修管家',
      desc: '最具人气的装修管家！！',
      path: '/pages/view/userLogin/login/login',
      imageUrl: "../../../images/fx.jpg",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },
  onReady: function () {
   
  },
  onShow() {
    this.onLoad()
  },
  onHide: function () {

  },
  goPerfect: () => {
    wx.navigateTo({
      url: '../perfectUser/perfectUser',
    })
  },  
})