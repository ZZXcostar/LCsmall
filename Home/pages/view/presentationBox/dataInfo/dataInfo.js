// pages/view/presentationBox/dataInfo/dataInfo.js
var utilBox = require("../../../../utils/utilBox.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectId:'',
    orderInfo:'',
    cookie: '',
    isSee: false
  },
  onLoad: function (options) {
    var that=this
    var orderInfo = wx.getStorageSync("pqOrderInfo")
    console.log(orderInfo)
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    var id = options.projectId
    this.setData({
      projectId: id,
      cookie,
      orderInfo
    })
    wx.request({
      url: utilBox.urlheader + "public/entrysigncollection/queryByIds",
      data: [id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        var list = res.data.info.list;
        var orderInfo = that.data.orderInfo;
        orderInfo.list = list[0]
        console.log(list)
        if (list.length) {
          that.setData({
            isSee: false,
            orderInfo
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
    var data = e.detail.value
    data.direct = parseFloat(data.direct)
    data.salary = parseFloat(data.salary)
    data.design = parseFloat(data.design)
    data.acreage = parseFloat(data.acreage)
    data.original = parseFloat(data.original)
    data.projectId = this.data.projectId;
    console.log(data)
    var isInfo=true
    for(let i in data){
      if(data[i]==""){
        isInfo=false
      }
    }
    if (isInfo==false){
      wx.showToast({
        title: '请输入完整信息',
        icon:'none',
        duration: 1000,
        mask: true
      })
    }else{
      let cookie = this.data.cookie
      wx.request({
        url: utilBox.urlheader + "public/entrysigncollection/insertOne",
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
    console.log(isInfo)
  }
})