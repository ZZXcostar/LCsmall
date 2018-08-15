// pages/login/login.js
var utilBox = require("../../../../utils/utilBox.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      datalist:[
        { "name": '房间墙顶地面', "names": "房间正度", "types": "合格","condition":true},
        {"name":'房间墙顶地面',"names":"房间正度","types":"无需验收"},
        { "name": '房间墙顶地面', "names": "房间正度", "types": "不合格" },
        { "name": '房间墙顶地面', "names": "房间正度", "types": "合格" },
      ],
    bgId: ""
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id
    this.setData({
      bgId: options.id
    })
    var that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    // 订单信息查询
    wx.request({
      url: utilBox.urlheader + "public/entryreport/queryByIds", //仅为示例，并非真实的接口地址
      data: [id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        console.log(res.data.info.list[0].entryReportStandards)
        let aa = res.data.info.list[0].entryReportStandards;
        for(var i=0;i<aa.length;i++){
          if (aa[i].isService==0){
            aa[i].isService="不合格"
          } else if (aa[i].isService == 1) {
            aa[i].isService = "合格"
          } else if (aa[i].isService == 2) {
            aa[i].isService = "无需验收"
          } else {
            aa[i].isService = ""
          }
        }
        that.setData({
          datalist:aa
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  /*
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
  quickLogon: () => {
    wx.navigateTo({
      url: '../quickLogon/quickLogon'
    })
  },
  missCipher: () => {
    wx.navigateTo({
      url: '../missCipher/missCipher',
    })
  },
  login: () => {
    wx.switchTab({
      url: '../orderOwner/orderOwner',
    })
  },
  reportAccept:(e)=>{
    console.log(e.currentTarget.dataset)
    var id = e.currentTarget.dataset.id
    var types = e.currentTarget.dataset.types
    var bgid = e.currentTarget.dataset.bgid
    var standard = e.currentTarget.dataset.standard
    var acceptance = e.currentTarget.dataset.acceptance
    wx.navigateTo({
      url: '../../orderOwner/reportAccept/reportAccept?id=' + id + "&types=" + types + "&bgid=" + bgid + "&acceptance=" + acceptance + "&standard=" + standard,
    })
  }
})