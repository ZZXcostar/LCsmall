// pages/view/orderbasic/orderbasic.js
var utilBox = require("../../../utils/utilBox.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:'',
    projectId:'',
    cookie: '',
    isSee: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var id = options.projectId;
    var orderInfo = wx.getStorageSync("pqOrderInfo");
    console.log(orderInfo)
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    this.setData({
      projectId: id,
      orderInfo: orderInfo,
      cookie
    })
    wx.request({
      url: utilBox.urlheader + "public/entrysigninformation/queryByIds",
      data: [id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        var list = res.data.info.list;
        console.log(list)
        var orderInfo1 = that.data.orderInfo;
        orderInfo1.list=list[0]
        if (list.length) {
          that.setData({
            isSee: false,
            orderInfo: orderInfo1
          })
          console.log(that.data.orderInfo)
        } else {
          that.setData({
            isSee: true
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  formSubmit(e){
    console.log(e.detail.value)
    var list = e.detail.value
    var data={}
    data.projectId = this.data.projectId
    data.age = parseInt(list.age);
    data.profession=list.job;
    data.permanent = parseInt(list.people);
    data.child = list.children;
    data.childAge = parseInt(list.childrenAge);
    console.log(data)
    let cookie = this.data.cookie;
    wx.request({
      url: utilBox.urlheader + "public/entrysigninformation/insertOne",
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        console.log(res)
        if (res.data.status == 200) {
          wx.navigateBack({ changed: true });//返回上一页
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })

  }
  
})