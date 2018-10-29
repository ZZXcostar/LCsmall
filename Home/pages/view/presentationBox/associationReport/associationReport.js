// pages/login/login.js
var utilBox = require("../../../../utils/utilBox.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      name: '王维',
      phone: '15000865574',
      add: '是的冯绍峰看放到视'
    }, {
      name: '王维',
      phone: '15000865574',
      add: '是的冯绍峰看放到视'
    }, {
      name: '王维',
      phone: '15000865574',
      add: '是的冯绍峰看放到视'
    },
    {
      name: '王维',
      phone: '15000865574',
      add: '是的冯绍峰看放到视'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorageSync('isEdit')
    var id = options.reportId;
    var phone=options.phone;
    // console.log(id)
    var that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    console.log(phone)
    wx.request({
      url: utilBox.urlheader + "product/ProjectEstablish/queryListByOrderInfoPhone?phone=" + phone, //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        let obj=[]
        for (let i in res.data.info){
          if (id != res.data.info[i].id) {
            obj.push(res.data.info[i])
          }
        }
        that.setData({
          list: obj
        })
        console.log(obj)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  onReady: function () {

  },
  buttonSize(e){
    console.log(e.target.dataset)
    let orderId = e.target.dataset.ind;
    let orderNum = e.target.dataset.num;
    let typeName = e.target.dataset.name;
    wx.setStorageSync('id', orderId)
    wx.setStorageSync('orderNum', orderNum)
    if (typeName == "陪签服务" || typeName == "装修规划" || typeName == "全案服务") {
      wx.navigateTo({
        url: '../accompany/accompany',
      })
    } else if (typeName == "") {
      wx.showToast({
        icon: 'none',
        title: '此项类别为空',
      })
    } else {
      wx.navigateTo({
        url: '../supervisor/supervisor',
      })
    } 
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
})