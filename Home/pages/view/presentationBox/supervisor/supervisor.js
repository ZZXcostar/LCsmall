// pages/login/login.js
var utilBox = require("../../../../utils/utilBox.js");
var network = require("../../../../utils/network.js");
Page({
  data: {
    orderInfo: "",
    node: ""
  },
  onLoad: function (e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      isRefresh: true
    })
  },

  onLoad: function (options) {
    console.log(wx.getStorageSync('isEdit'))
    var id = wx.getStorageSync('id');
    var that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    var pages = getCurrentPages(); 
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      isRefresh: true
    })
    wx.request({
      url: utilBox.urlheader + "/product/ProjectEstablish/queryMap", //仅为示例，并非真实的接口地址
      data: [id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        res.data.info[0].acreage = parseInt(res.data.info[0].acreage)
        if (res.data.info[0].orderDetail.appointment != null) {
          var dateTime = res.data.info[0].orderDetail.appointment.startTime
          res.data.info[0].orderDetail.appointment.startTime = that.updateTime(dateTime)
        }
        // console.log(res.data.info[0].entryReports)
        
        let data = res.data.info[0]
        if (data.workerInfos){
          for (let i in data.workerInfos){
            if (data.workerInfos[i].pricing.indexOf('天')!=-1) {
              data.workerInfos[i].manpower = data.workerInfos[i].manpower + '元/天'
            } else if (data.workerInfos[i].pricing.indexOf('时') != -1) {
              data.workerInfos[i].manpower = data.workerInfos[i].manpower + '元/小时'
            } else {
              res.data.info[0].workerInfos[i].manpower='无'
            }
          } 
        }
        console.log(data)
        wx.setStorageSync('userInfos', res.data.info[0])
        that.setData({
          orderInfo: data,
          node: res.data.info[0].entryReports
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  onShow(){
    this.onLoad();
  },
  godisclose(e){  
    var id = e.currentTarget.dataset.index
    var tit = e.currentTarget.dataset.tit
    console.log(e.currentTarget.dataset.ind)
    var ind = e.currentTarget.dataset.ind
    if (ind > 0){
      if (this.data.node[ind - 1].okCount != this.data.node[ind - 1].reportCount) {
        wx.showToast({
          icon: 'none',
          title: this.data.node[ind - 1].reportname +'报告未上传！',
        })
        return
      } 
    }
    
    wx.setStorageSync('nodeId', id)
    wx.setStorageSync('nodeName', tit)
    wx.navigateTo({
      url: '../disclose/disclose'
    })
  },
  updateTime(dateTime) {
    var date = ''
    date = dateTime.split(' ')
    return date[0]
  },
  login: () => {
    wx.switchTab({
      url: '../orderOwner/orderOwner',
    })
  },
})