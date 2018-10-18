// pages/view/reportAccept/reportAccept.js
var utilBox = require("../../../../utils/utilBox.js");
Page({
  data: {
    src_bingimg:'',
    bigimghidden:true,
    nodeInfo:'',
    userInfos:''
  },
  enlarge:function(e){
    var src=e.currentTarget.dataset.src;
    var ind=e.currentTarget.dataset.ind
    var imgList = this.data.nodeInfo.entryReportStandards[0].imgs
    for (let i in imgList){
      imgList[i] = 'http://101.89.175.155/api/' + imgList[i]
    }
    wx.previewImage({
      current: imgList[ind],     //当前图片地址
      urls: imgList,               //所有要预览的图片的地址集合 数组形式
    })   
  },
  hideBigimg:function(){
    this.setData({ bigimghidden: true });    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var index = options.index
    this.setData({
      act: options.act
    })
    var userInfos = wx.getStorageSync("userInfos");
    var jlNodeInfo = wx.getStorageSync("jlNodeInfo");
    var xm = jlNodeInfo.entryReportStandards[index].items
    var bz = jlNodeInfo.entryReportStandards[index].standard
    var fs = jlNodeInfo.entryReportStandards[index].acceptance
    if (options.act==11){
      var jlNodeInfos = wx.getStorageSync("jlNodeInfos");
      jlNodeInfo.entryReportStandards[index] = jlNodeInfos
      var imgs = jlNodeInfo.entryReportStandards[index].imgs.split(',')
      imgs.pop()
      jlNodeInfo.entryReportStandards[index].imgs = imgs
      jlNodeInfo.entryReportStandards[index].items = xm
      jlNodeInfo.entryReportStandards[index].standard = bz
      jlNodeInfo.entryReportStandards[index].acceptance = fs
      this.setData({
        nodeInfo: jlNodeInfo,
        userInfos: userInfos
      })
    }else{
      var imgs = jlNodeInfo.entryReportStandards[index].imgs.split(',')
      imgs.pop()
      jlNodeInfo.entryReportStandards[index].imgs = imgs
      this.setData({
        nodeInfo: jlNodeInfo,
        userInfos: userInfos
      })
    }
  },
  submit(){
    var that=this;
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    var jlNodeInfos = wx.getStorageSync("jlNodeInfos");
    wx.showModal({
      title: '是否提交报告',
      content: '报告提交后不可修改！！',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: utilBox.urlheader + "public/entryreport/updateType",
            data: jlNodeInfos,
            header: {
              'content-type': 'application/json', // 默认值
              cookie: cookie
            },
            method: 'post',
            success: function (res) {
              if (res.data.status == 200) {
                wx.navigateBack({ //返回上两页
                  delta: 2
                })
                // wx.navigateTo({ //刷新页面的返回
                //   url: '../../presentationBox/disclose/disclose?id=' + that.data.nodeInfo.reportId + '&tit='+that.data.nodeInfo.reportname,
                // })
              } 
            },
            fail: function (err) {
              console.log(err)
            }
          })
        }else{

        }
      }
    })
  }
})