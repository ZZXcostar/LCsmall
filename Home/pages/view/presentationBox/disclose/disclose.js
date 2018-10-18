// pages/login/login.js
var utilBox = require("../../../../utils/utilBox.js");
Page({
  data: {
    datalist:[],
    bgId: "",
    cookie:'',
    id:'',//报告id
    dates: "2018-09-20",
  },
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('nodeName')
    })
    var id = wx.getStorageSync('nodeId')
    this.setData({
      bgId: id,
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
        wx.setStorageSync('jlNodeInfo', res.data.info.list[0])
        // console.log(res.data.info.list[0])
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
          datalist:aa,
          id: res.data.info.list[0].id
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  onShow() { //返回显示页面状态函数
    //错误处理
    this.onLoad()//再次加载，实现返回上一页页面刷新
    //正确方法
    //只执行获取地址的方法，来进行局部刷新
  },
  bindDateChange: function (e) { //验收时间选折
    this.setData({
      dates: e.detail.value
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
    var index = e.currentTarget.dataset.ind
    var id = e.currentTarget.dataset.id
    var types = e.currentTarget.dataset.types
    var bgid = e.currentTarget.dataset.bgid
    var standard = e.currentTarget.dataset.standard
    var acceptance = e.currentTarget.dataset.acceptance
    var datalist= this.data.datalist
    for (let k in datalist){
      console.log(datalist[k].isService)
      if (datalist[k].isService == '') {
        wx.navigateTo({
          url: '../../orderOwner/reportAccept/reportAccept?id=' + id + "&types=" + types + "&bgid=" + bgid + "&acceptance=" + acceptance + "&standard=" + standard+'&index='+index,
        })
      } else if (datalist[k].isService == '无需验收') {
        // wx.showToast({
        //   icon:'none',
        //   title: '此节点无需验收',
        // })
        // console.log(this.data.datalist[index])
        let nodeInfo = this.data.datalist[index]
        wx.showModal({
          title: '此节点无需验收',
          content: nodeInfo.instructions,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        wx.navigateTo({
          url: '../../orderOwner/preview/preview?index=' + index
        })
      }
    }
  },
  preview(){
    wx.navigateTo({
      url: '../../orderOwner/preview/preview'
    })
  },
  submit(){
    for (let i in this.data.datalist){
      if (this.data.datalist[i].remark==null){
        wx.showToast({
          title: '有节点未提交报告',
          icon: 'none',
        })
        return
      }
    }
    var date=new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1  
    var day = date.getDate()  
    var hour = date.getHours()  
    var minute = date.getMinutes()  
    var second = date.getSeconds()
    var time = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    var that=this;
    let cookie = this.data.cookie
    wx.request({
      url: utilBox.urlheader + "public/entryreport/submitReport", //仅为示例，并非真实的接口地址
      data: { isService: 1, endTime: time, id: that.data.id, receptionTime: that.data.dates},
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        if (res.data.status==200){
          wx.showToast({
            title: '提交成功！',
            icon: 'none',
            mask: true
          })
          wx.navigateBack({ changed: true });//返回上一页
        } else if (res.data.status==300){
          wx.showToast({
            title: res.data.msg+'，可能已提交过了',
            icon: 'none',
            mask: true
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})