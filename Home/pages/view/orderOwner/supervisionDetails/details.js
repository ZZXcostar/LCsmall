// pages/login/login.js
var utilBox = require("../../../../utils/utilBox.js");
var network = require("../../../../utils/network.js");
Page({
  data: {
    orderInfo:"",
    node:"",
    showcancle:true,
    projectId:'',
    cookie:'',
    inputVal:''
  },
  onLoad: function (options) {
    var id = options.orderId;
    wx.setStorageSync('addDesignerId', id);
    var that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    this.setData({
      projectId: id,
      cookie: cookie
    })
    // 订单信息查询
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
        wx.setStorageSync('userInfos', res.data.info[0] )
        that.setData({
          orderInfo: res.data.info[0],
          node: res.data.info[0].entryReports      
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  onShow: function () {
    let addDesignerId = wx.getStorageSync('addDesignerId');
    if (addDesignerId) {
      var id = addDesignerId;
      var that = this;
      let userInfo = wx.getStorageSync("userInfo");
      let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
      let arr = reg.exec(userInfo.adminPassword);
      let cookie = RegExp.$1;
      this.setData({
        projectId: id,
        cookie: cookie
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
          wx.setStorageSync('pqOrderInfo', res.data.info[0])
          that.setData({
            orderInfo: res.data.info[0]
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  },
  changeshow: function (e) {
    var isshow = null;
    if (e.target.id == 'overback') {
      isshow = true;
    }
    else if (e.target.id == 'cancle') {
      isshow = this.data.showcancle ? false : true;
    }
    this.setData({ showcancle: isshow });
  },
  giveupOrder() {
    let that = this;
    let ids = this.data.projectId;
    let reason = this.data.inputVal;
    network.requestLoading(
      utilBox.urlheader + `product/workList/update`,
      {
        id: ids,
        isAccepted: 2,
        rejectedReason: reason
      }, "",
      function (res) {
        console.log(res)
        let resMessage = res.info

        if (res.status == 200) {
          wx.showToast({
            title: "放弃派单成功",
          })
          that.setData({ showcancle: true });
        } else {
          wx.showToast({
            title: res.msg,
          })
        }


      }, function (res) {
        wx.showToast({
          title: '放弃派单失败',
        })
      }, 'application/json')
  },
  //添加施工信息
  addSupervision(event){
    console.log(event)
    let projectId = event.currentTarget.dataset.projectid;
    console.log(projectId)
    wx.navigateTo({
      url: '../addConstruinfo/addConstruinfo?projectId=' + projectId,
    })
  },
  godisclose: (e) => {
    console.log(e)
    // var id = e.currentTarget.dataset.index
    // var tit = e.currentTarget.dataset.tit
    // wx.navigateTo({
    //   url: '../disclose/disclose?id='+id+'&tit='+tit
    // })
  },
  login: () => {
    wx.switchTab({
      url: '../orderOwner/orderOwner',
    })
  },
})