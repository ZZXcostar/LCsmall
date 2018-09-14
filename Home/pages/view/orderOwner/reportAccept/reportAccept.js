// pages/view/orderOwner/reportAccept/reportAccept.js
var utilBox = require("../../../../utils/utilBox.js");
var network = require("../../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    types:"",
    imglist: [
    ],
    imglists:[],
    tabs: [
      {
        name: '不合格',
        list: ['检测说明', '解决方案', '施工隐患', '解决方法']
      },
      {
        name: '合格',
        list: ['检测说明']
      }
    ],
    activeIndex: '',
    sliderOffset: 0,
    sliderLeft: 0,
    cookie:"",
    nodeInfo:''
  },
  // 切换内容tabs
  tabClick: function (e) {
    console.log(e.currentTarget)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  uploadImg(){
    let that = this;
    var imglist = this.data.imglist;
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 1000
          })
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths;
          let newImgList = imglist.concat(tempFilePaths)
          that.setData({
            imglist: newImgList
          })
          var cookie = that.data.cookie
          var list = []
          for (let i = 0; i < newImgList.length;i++){
            wx.uploadFile({
              url: utilBox.urlheader + 'zuul/sms/file/fileUpload?type=public',
              filePath: newImgList[i],
              name: 'fileUpload',
              header: {
                "Content-Type": "multipart/form-data",
                'accept': 'application/json',
                cookie: cookie
              },
              success: function (res) {
                var data = res.data;
                data = data.replace(" ", "");
                
                if (typeof data != 'object') {
                  data = data.replace(/\ufeff/g, "");//重点
                  var jj = JSON.parse(data);
                  jj = jj.info
                  list.push(jj);
                }
                console.log(list)
                that.setData({
                  imglists: list
                })
              },
              fail: function (res) {
                console.log('fail');
              },
            })
          }
          
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    console.log(options.index)
    var jlNodeInfo = wx.getStorageSync("jlNodeInfo");
    jlNodeInfo.entryReportStandards = jlNodeInfo.entryReportStandards[options.index]
    var imgs = jlNodeInfo.entryReportStandards.imgs.split(',')
    imgs.pop()
    for(let i in imgs){
      imgs[i] = 'http://101.89.175.155/api/' + imgs[i]
    }
    jlNodeInfo.entryReportStandards.imgs = imgs
    if (jlNodeInfo.entryReportStandards.isService==1){
      var left = wx.getSystemInfoSync().windowWidth/2
    }
    console.log(jlNodeInfo)
    this.setData({
      cookie: cookie,
      nodeInfo: jlNodeInfo,
      imglist: jlNodeInfo.entryReportStandards.imgs,
      activeIndex: jlNodeInfo.entryReportStandards.isService,
      sliderOffset: left
    })
  },
  noNeed(){ //无需验收
    var that = this;
    var cookie = this.data.cookie
    var id=that.data.bgId
    console.log
    // 订单信息查询
    wx.request({
      url: utilBox.urlheader + "public/entryreport/updateType", //仅为示例，并非真实的接口地址
      data: {
        isService:2,
        reportId: id,
        id: that.data.orderId,
        remark:"无需验收"
      },
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        console.log("修改成功")
        wx.navigateBack({ changed: true });//返回上一页
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  
  formSub(e){ //数据提交
    var that = this;
    var cookie = this.data.cookie
    var id = that.data.bgId
    var aa0 = e.detail.value.aa00
    var aa1 = e.detail.value.aa01
    var aa2 = e.detail.value.aa02
    var aa3 = e.detail.value.aa03
    var aa10 = e.detail.value.aa10
    console.log(aa0,aa1,aa2,aa3,aa10)
    var imgList = this.data.imglists;
    var a0= aa0==""? aa10 : aa0
    console.log(imgList)
    var img=""
    for (var i = 0; i < imgList.length;i++){
      if (imgList.length == 0 && i == (imgList.length)){
        img += imgList[i]
      }else{
        img += imgList[i] + ","
      }
    }
    wx.showModal({
      title: '是否提交报告',
      content: '预览是预览报告，确定是保存报告！！',
      cancelText:'预览',
      success: function (res) {
        if (res.confirm) {
          wx.request({
              url: utilBox.urlheader + "public/entryreport/updateType",
              data: {
                isService: that.data.activeIndex,
                reportId: id,
                id: that.data.orderId,
                imgs:img,
                instructions:a0,
                solution:aa1,
                hdanger:aa2,
                solutionf:aa3,
                remark:"合格与不合格"
              },
              header: {
                'content-type': 'application/json', // 默认值
                cookie: cookie
              },
              method: 'post',
              success: function (res) {
                console.log("修改成功")
                wx.navigateBack({ changed: true });//返回上一页
              },
              fail: function (err) {
                console.log(err)
              }
            })
        } else if (res.cancel) {
          wx.navigateTo({
            url: '../../orderOwner/preview/preview'
          })
        }
      }
    })  
    // 订单信息查询
  },
  
})