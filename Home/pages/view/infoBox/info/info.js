// pages/login/login.js
var network = require("../../../../utils/network.js");
var utilBox = require("../../../../utils/utilBox.js");
Page({
  data: {
    page: 1,
    pageSize: 30,
    hasMoreData: true,
    contentlist: [],
    userId:'',
    datalist: [{
      tiem: '2018-01-05  13:01',
      info: '你有一个新订单请尽快接收',
      urls: "../../../view/infoBox/comment/comment"
    },{
        tiem: '2018-01-06  13:01',
        info: '你有一个新评价，点击查看',
        urls: "../../../view/infoBox/orderDeil/orderDeil"
      }]
      
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    let userInfo = wx.getStorageSync("userInfo");
    that.setData({
      userId: userInfo.id,
    })
    that.getMusicInfo('正在加载数据...')
  },
  onShow(){
    this.onLoad()
  },
  onPullDownRefresh: function () {
    this.data.page = 1
    this.getMusicInfo('正在刷新数据')
  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getMusicInfo('加载更多数据')
    }
  },
  getMusicInfo: function (message) {
    var that = this
    network.requestLoading(
      utilBox.urlheader + `public/message/record/query?page=${this.data.page}&pageSize=10`, 
      {
        receiverAdminId:that.data.userId
      },
      message, function (res) {
        var contentlistTem = that.data.contentlist
        if (res.status == 200) {
        if (that.data.page == 1) {
          contentlistTem = []
        }
        var contentlist = res.info.list
        console.log(contentlist)
        for (let i in contentlist){//时间处理
          contentlist[i].createTime = contentlist[i].createTime.substr(0, contentlist[i].createTime.length - 2);  
        }
        if (contentlist.length < 10) {
          that.setData({
            contentlist: contentlistTem.concat(contentlist),
            hasMoreData: false
          })
        } else {
          that.setData({
            contentlist: contentlistTem.concat(contentlist),
            hasMoreData: true,
            page: that.data.page + 1
          })
        }
      } else {
        wx.showToast({
          title: res.showapi_res_error,
        })
      }
    }, function (res) {
      wx.showToast({
        title: '加载数据失败',
      })
      },'application/json')
  },
 
})