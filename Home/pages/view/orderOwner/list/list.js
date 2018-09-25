// pages/orderOwner/orderOwner.js
var network = require("../../../../utils/network.js");
var utilBox = require("../../../../utils/utilBox.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pageSize: 3,
    contentlist: [],
    hasMoreData: true,
    orderIds: "",
    inputVal: "",
    list: [
      {
        ordernum: 123456,
        name: '姓名',
        phone: '15058160089',
        address: '上海浦东',
        conditon1: '复层',
        conditon2: '89',
        conditon3: '开工交底3.0',
        conditon4: '延寿街店3.0',
        status: '服务中',
        service: '陪签服务'
      }
    ],
    showcancle: true
  },
  changeshows:function(e){
    console.log(e)
    wx.setStorageSync('worklists', e.currentTarget.dataset.worklists)
    this.setData({ orderIds: e.currentTarget.dataset.ids });
    this.setData({ showcancle: false });
  },
  changeshow: function (e) {
    console.log(e.currentTarget)
    var isshow = null;
    if (e.target.id == 'overback') {
      isshow = true;

    }
    else if (e.target.id == 'cancle') {
      isshow = this.data.showcancle ? false : true;

    }
    this.setData({ showcancle: isshow });
  },
  formSubmit: function (options) {
    console.log(this.data.orderIds)
    this.setData({
      inputVal: '',
    })
    console.log(options.detail.value.text)
    network.requestLoading(
      utilBox.urlheader + `product/workList/bulkDeleteByAdminId?adminId=${[wx.getStorageSync("userInfo").id]}`,
      [this.data.orderIds], "",
      function (res) {
        console.log(res)
        let resMessage = res.info

        if (res.status == 200) {
          wx.showToast({
            title: "放弃接单",
          })
          this.getMusicInfo('正在加载数据...')
        } else {
          wx.showToast({
            title: res.showapi_res_error,
          })
        }


      }, function (res) {
        wx.showToast({
          title: '加载数据失败',
        })
      }, 'application/json')




  },
  /**
   * 生命周期函数--监听页面加载
   */


  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    var that = this
    this.data.page = 1
    that.getMusicInfo('正在加载数据...')
  },
  onPullDownRefresh: function () {
    console.log(1)
    this.data.page = 1
    this.getMusicInfo('正在刷新数据')
  },
  onReachBottom: function () {
    console.log(1)
    if (this.data.hasMoreData) {
      this.getMusicInfo('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },
  getMusicInfo: function (message) {
    var that = this;
    network.requestLoading(
      utilBox.urlheader + `product/workList/queryListByAdminIds?page=${that.data.page}&pageSize=${that.data.pageSize}&isAccepted=1&keyword=`,
       [wx.getStorageSync("userInfo").id],
      message, function (res) {
        console.log(res)
        var contentlistTem = that.data.contentlist
        let resMessage = res.info.list
        var contentlistTem = that.data.contentlist
        if (res.status == 200) {

          if (that.data.page == 1) {
            contentlistTem = []
          }
          var contentlist = res.info.list
          if (contentlist != null) {
            for (let i = 0; i < contentlist.length; i++) {
              contentlist[i].node = contentlist[i].entryReports
              let node = contentlist[i].node
                var index = -1;
                if (node.length>2){
                  for (let j = 0; j < node.length; j++) {
                    if (node[i].okCount == node[i].reportCount) {
                      index=i
                    }
                  }
                  if(index==-1){
                    node = node.splice(0,2)
                  } else if (index == node.length-1){
                    node = node.splice(index, 1)
                  }else{
                    node = node.splice(index, 2)
                  }
                }
               contentlist[i].node =node
            }
          }
          if (contentlist.length < that.data.pageSize) {
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
          if (res.info == "尚未登录"){
            wx.navigateTo({
              url: '../../orderWait/list/list',
            })
          }
          wx.showToast({
            title: "加载数据失败",
          })
        }


      }, function (res) {
        wx.showToast({
          title: '加载数据失败',
        })
      }, 'application/json')
  },
  onShow(){
    this.onLoad()
  },
  toDetails(event) {
    console.log(event)
    wx.removeStorageSync('addDesignerId')
    let orderId = event.currentTarget.dataset.id;
    if(event.currentTarget.dataset.type == "陪签"){
      wx.navigateTo({
        url: '../accompanyDetails/details?orderId='+orderId,
      })
    }else if(event.currentTarget.dataset.type == "监理"){
      wx.navigateTo({
        url: '../supervisionDetails/details?orderId='+orderId,
      })
    }
  }
})