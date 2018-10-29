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
    isSee: false,
    children:"无",
    sex:["男孩","女孩","男孩+女孩"],
    peoples:[1,2,3,4,5,6,7,8,9],
    people:2
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var id = options.projectId;
    var orderInfo = wx.getStorageSync("pqOrderInfo");
    let userInfo = wx.getStorageSync("userInfo");
    // console.log(orderInfo)
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
        var orderInfo1 = that.data.orderInfo;
        orderInfo1.list=list[0]
        if (list.length) {
          that.setData({
            isSee: false,
            orderInfo: orderInfo1,
            children: orderInfo1.list.child,
            people: orderInfo1.list.permanent,
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
  sexChange(e){
    let sex = e.detail.value
    let childrenSex=this.data.sex
    this.setData({
      children: childrenSex[sex]
    })
    console.log(childrenSex[sex])
  },
  peopleChange(e){
    let people = e.detail.value
    let peoples = this.data.peoples
    this.setData({
      people: peoples[people]
    })
  },
  formSubmit(e){
    if (wx.getStorageSync('isEdit') == 1) {
      wx.showToast({
        title: '没有编辑权限',
        icon: 'none',
      })
      return
    }
    var list = e.detail.value
    var data={}
    data.projectId = this.data.projectId
    data.age = parseInt(list.age);
    data.profession=list.job;
    data.permanent = parseInt(this.data.people);
    data.child = this.data.children;
    data.childAge = parseInt(list.childrenAge);
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