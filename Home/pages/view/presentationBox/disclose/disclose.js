// pages/login/login.js
var utilBox = require("../../../../utils/utilBox.js");
Page({
  data: {
    datalist:[],
    bgId: "",
    cookie:''
  },
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    wx.setNavigationBarTitle({
      title: options.tit
    })
    var id = options.id
    this.setData({
      bgId: options.id,
      cookie
    })
    var that = this;
    // 订单信息查询
    wx.request({
      url: utilBox.urlheader + "public/entryreport/queryByIds", //仅为示例，并非真实的接口地址
      data: [id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        console.log(res.data.info.list[0])
        wx.setStorageSync('jlNodeInfo', res.data.info.list[0])
        let aa = res.data.info.list[0].entryReportStandards;
        for(var i=0;i<aa.length;i++){
          if (aa[i].isService==0){
            aa[i].isService="不合格"
          } else if (aa[i].isService == 1) {
            aa[i].isService = "合格"
          } else if (aa[i].isService == 2) {
            aa[i].isService = "无需验收"
          } else {
            aa[i].isService = ""
          }
        }
        that.setData({
          datalist:aa
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
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
  reportAccept(e){
    console.log(e.currentTarget.dataset)
    var id = e.currentTarget.dataset.id
    var types = e.currentTarget.dataset.types
    var bgid = e.currentTarget.dataset.bgid
    var standard = e.currentTarget.dataset.standard
    var acceptance = e.currentTarget.dataset.acceptance
    var datalist= this.data.datalist
    for (let k in datalist){
      if (datalist[k].isService == '') {
        wx.navigateTo({
          url: '../../orderOwner/reportAccept/reportAccept?id=' + id + "&types=" + types + "&bgid=" + bgid + "&acceptance=" + acceptance + "&standard=" + standard,
        })
      } else {
        wx.navigateTo({
          url: '../../orderOwner/preview/preview'
        })
      }
    }
  },
  preview(){
    console.log('aaaaaaaaaaa')
    wx.navigateTo({
      url: '../../orderOwner/preview/preview'
    })
  },
  submit(){
    var that=this;
    let cookie = this.data.cookie
    // wx.request({
    //   url: utilBox.urlheader + "public/entryreport/submitReport", //仅为示例，并非真实的接口地址
    //   data: [id],
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //     cookie: cookie
    //   },
    //   method: 'post',
    //   success: function (res) {
    //     console.log(res.data.info.list[0])
    //     
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   }
    // })

  }
})