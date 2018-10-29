// pages/view/presentationBox/wantAdd/wantAdd.js
var utilBox = require("../../../utils/utilBox.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: '有', value: '0'},
      { name: '部分', value: '1' }
    ], 
    radioItems1: [
      { name: '有', value: '0'},
      { name: '部分', value: '1' }
    ],
    rest:'',//其他
    projectId:'',//项目id
    cookie:'',
    isSee: false,
  },
  onLoad: function (options) {
    var that=this
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    this.setData({
      projectId: options.projectId,
      cookie: cookie
    })
    wx.request({
      url: utilBox.urlheader + "public/entrysignmaterials/queryByIds",
      data: [options.projectId],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        var list = res.data.info.list
        if (list.length) {
          var radioItems = that.data.radioItems
          var radioItems1 = that.data.radioItems1
          for (let i in radioItems){
            radioItems[i].checked=false
          }
          if (list[0].detailed==false){
            radioItems[0].checked = false
            radioItems[1].checked = true
          }else{
            radioItems[0].checked = true
            radioItems[1].checked = false
          }
          for (let i in radioItems1) {
            radioItems1[i].checked = false
          }
          if (list[0].manual == false) {
            radioItems1[0].checked = false
            radioItems1[1].checked = true
          } else {
            radioItems1[0].checked = true
            radioItems1[1].checked = false
          }
          that.setData({
            isSee: false,
            rest: list[0].rest,
            radioItems1: radioItems1,
            radioItems: radioItems
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
  radioChange: function (e) {
    var chk = e.currentTarget.dataset.chk
    if (chk =='radioItems'){
      var radioItems = this.data.radioItems;
    }else{
      var radioItems = this.data.radioItems1;
    }
    var len = e.detail.value
    var ind = len[(len.length - 1)]
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      if (radioItems[i].value == ind) {
        radioItems[i].checked = true;
      } else {
        radioItems[i].checked = false;
      }
    }
    if (chk == 'radioItems') {
      this.setData({
        radioItems: radioItems
      });
    } else {
      this.setData({
        radioItems1: radioItems
      });
    }
  },
  rest(e){
    this.setData({
      rest: e.detail.value
    })
  },
  showTopTips(){ //确定提交
    if (wx.getStorageSync('isEdit') == 1) {
      wx.showToast({
        title: '没有编辑权限',
        icon: 'none',
      })
      return
    }
    var data={}
    data.projectId = this.data.projectId;
    data.rest = this.data.rest;
    var radioItems = this.data.radioItems;
    var radioItems1 = this.data.radioItems1
    for (let i in radioItems){
      if (radioItems[i].checked == true){
        if (radioItems[i].value == 0){
          data.detailed = false
        }else{
          data.detailed = true
        }
      }
    }
    for (let i in radioItems1) {
      if (radioItems1[i].checked == true) {
        if (radioItems1[i].value == 0) {
          data.manual = false
        } else {
          data.manual = true
        }
      }
    }
    let cookie = this.data.cookie
    wx.request({
      url: utilBox.urlheader + "public/entrysignmaterials/insertOne",
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