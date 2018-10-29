// pages/view/orderother/orderother.js
var utilBox = require("../../../utils/utilBox.js");
Page({
  data: {
    rest:'',
    projectId:'',
    cookie: '',
    isSee: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    var id = options.projectId
    this.setData({
      projectId: id,
      cookie
    })
    wx.request({
      url: utilBox.urlheader + "public/entrysignmatter/queryByIds",
      data: [id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        var list = res.data.info.list
        if (list.length) {
          that.setData({
            isSee: false,
            rest: list[0].remark,
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
  rest(e) { //其他
    this.setData({
      rest: e.detail.value
    })
  },
  showTopTips(){
    if (wx.getStorageSync('isEdit') == 1) {
      wx.showToast({
        title: '没有编辑权限',
        icon: 'none',
      })
      return
    }
    var data = {}
    data.projectId = this.data.projectId;
    data.remark = this.data.rest;
    let cookie = this.data.cookie
    wx.request({
      url: utilBox.urlheader + "public/entrysignmatter/insertOne",
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
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