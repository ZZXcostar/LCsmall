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
    isSee: false,
    dates: "请选择时间",
  },
  onLoad: function (options) {
    var that=this
    var orderInfo = wx.getStorageSync("pqOrderInfo")
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
        console.log(orderInfo, list)
        orderInfo.list = list[0]
        // orderInfo.list.overheadRate=parseFloat(orderInfo.list.overheadRate)
        // orderInfo.list.design = parseFloat(orderInfo.list.design)
        // orderInfo.list.contract = parseFloat(orderInfo.list.contract)
        // orderInfo.list.original = parseFloat(oorderInfo.list.original)
        // orderInfo.list.acreage = parseFloat(orderInfo.list.acreage)
        // orderInfo.list.salary = parseFloat(orderInfo.list.salary)
        // orderInfo.list.direct = parseFloat(orderInfo.list.direct)
        // orderInfo.list.documentaryRate = parseFloat(orderInfo.list.documentaryRate)
        // orderInfo.list.taxRate = parseFloat(orderInfo.list.taxRate)
        if (list.length) {
          that.setData({
            isSee: false,
            orderInfo
          })
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
  bindDateChange: function (e) {
    this.setData({
      dates: e.detail.value
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
    if (this.data.dates =='请选择时间'){
      wx.showToast({
        title: '请选择陪签时间',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    data.signTime = this.data.dates
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
      console.log(data)
      // wx.request({
      //   url: utilBox.urlheader + "public/entrysigncollection/insertOne",
      //   data: data,
      //   header: {
      //     'content-type': 'application/json', // 默认值
      //     cookie: cookie
      //   },
      //   method: 'post',
      //   success: function (res) {
      //     if (res.data.status == 200) {
      //       wx.navigateBack({ changed: true });//返回上一页
      //     }
      //   },
      //   fail: function (err) {
      //     console.log(err)
      //   }
      // })
    }
  }
})