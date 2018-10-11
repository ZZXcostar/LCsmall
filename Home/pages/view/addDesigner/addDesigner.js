var utilBox = require("../../../utils/utilBox.js");
Page({
  data: {
    countryCodes: ["清 包", "半 包", "全 包","半包+主材"],
    countryIndex: 0,
    huxing:'请选择',
    decoration:'',
    duration:'',
    stylistname:'',
    stylistphone:'',
    stylistremark:'',
    projectId:'',
    cookie:'',
    orderInfo:''
  },
  onLoad: function (options) {
   // console.log(options)
    var id = options.projectId;
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
        that.setData({
          huxing: that.data.orderInfo.decorate == null ? '请选择' : that.data.orderInfo.decorate,
          decoration: that.data.orderInfo.decoration == null ? '' : that.data.orderInfo.decoration,
          duration: that.data.orderInfo.duration == null ? '' : that.data.orderInfo.duration,
          stylistname: that.data.orderInfo.stylistname == null ? '' : that.data.orderInfo.stylistname,
          stylistphone: that.data.orderInfo.stylistphone == null ? '' : that.data.orderInfo.stylistphone,
          stylistremark: that.data.orderInfo.stylistremark == null ? '' : that.data.orderInfo.stylistremark
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  decorationInput:function(e){
    this.data.decoration = e.detail.value;
  },
  decorateInput: function (e) {
    this.data.decorate = e.detail.value;
  },
  durationInput: function (e) {
    this.data.duration = e.detail.value;
  },
  stylistnameInput: function (e) {
    this.data.stylistname = e.detail.value;
  },
  stylistphoneInput: function (e) {
    this.data.stylistphone = e.detail.value;
  },
  stylistremarkInput: function (e) {
    this.data.stylistremark = e.detail.value;
  },
  bindCountryChange: function (e) {
    var list = e.detail.value
    var countryCodes = this.data.countryCodes
    this.setData({
      huxing: countryCodes[e.detail.value]
    })
  },
  sureAddDesigner(){
    var that = this;
    var datas = {
      id: this.data.projectId,
      decorate: this.data.huxing,
      duration: this.data.duration,
      decoration: this.data.decoration,
      stylistname: this.data.stylistname,
      stylistphone: this.data.stylistphone,
      stylistremark: this.data.stylistremark
    }
    console.log(datas)
    let cookie = this.data.cookie
    wx.request({
      url: utilBox.urlheader + "/product/ProjectEstablish/update", 
      data: datas,
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        if (res.status == 200) {
          wx.showToast({
            title: "添加成功",
          })
        }
        wx.setStorageSync('addDesignerId', that.data.projectId)
        wx.navigateBack({
          url: '../orderOwner/accompanyDetails/details',
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
});