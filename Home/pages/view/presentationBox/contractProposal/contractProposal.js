// pages/view/presentationBox/wantAdd/wantAdd.js
var utilBox = require("../../../../utils/utilBox.js");
Page({
  data: {
    radioItems: [
      { name: '杭州市推荐版', value: '0' },
      { name: '自印版', value: '1'}
    ],
    projectId: '',//项目id
    rest:'',//备注
    timeLimit:'',//工期约定
    payment:'',//合同付款方式
    cookie: '',
    isSee: false
  },
  onLoad: function (options) {
    var that=this
    var id = options.projectId
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    this.setData({
      projectId: id,
      cookie
    })
    wx.request({
      url: utilBox.urlheader + "public/entrysigncontract/queryByIds",
      data: [id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        var list = res.data.info.list
        if (list.length) {
          let radioItems = that.data.radioItems
          if (list[0].contract==false){
            radioItems[0].checked=true;
            radioItems[1].checked = false;
          }else{
            radioItems[0].checked = false;
            radioItems[1].checked = true;
          }
          that.setData({
            isSee: false,
            rest: list[0].rest,
            radioItems,
            payment: list[0].payment,
            timeLimit: list[0].duration,
            rest: list[0].rest
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
  payment(e) {//合同付款方式
    this.setData({
      payment: e.detail.value
    })
  },
  timeLimit(e) {//工期约定
    this.setData({
      timeLimit: e.detail.value
    })
  },
  radioChange: function (e) {
    var len = e.detail.value
    var ind=len[(len.length-1)]
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      if (radioItems[i].value==ind){
        radioItems[i].checked = true;
      }else{
        radioItems[i].checked=false;
      }
    }
    this.setData({
      radioItems: radioItems
    });
  },
  showTopTips(){
    var data = {}
    data.projectId = this.data.projectId;
    data.rest = this.data.rest;
    data.payment = this.data.payment
    data.duration = this.data.timeLimit
    var radioItems = this.data.radioItems
    for (let i in radioItems) {
      if (radioItems[i].checked == true) {
        if (radioItems[i].value == 0) {
          data.contract = false
        } else {
          data.contract = true
        }
      }
    }
    let cookie = this.data.cookie
    wx.request({
      url: utilBox.urlheader + "public/entrysigncontract/insertOne",
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