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
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    cookie:"",
    bgId:"",
    standard:"",
    acceptance:""
  },
  // 切换内容tabs
  tabClick: function (e) {
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
    console.log(options.id, options.types)
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    console.log(options.bgid)
    this.setData({
      orderId: options.id,
      types: options.types,
      cookie: cookie,
      bgId: options.bgid,
      standard: options.standard,
      acceptance: options.acceptance
    })
  },
  noNeed(){
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
        wx.navigateTo({
          url: '../../presentationBox/disclose/disclose?id=' + that.data.bgId,
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  
  formSub(e){
    var that = this;
    var cookie = this.data.cookie
    var id = that.data.bgId
    var aa0 = e.detail.value.aa00
    var aa1 = e.detail.value.aa01
    var aa2 = e.detail.value.aa02
    var aa3 = e.detail.value.aa03
    var aa10 = e.detail.value.aa10
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
    // 订单信息查询
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
        wx.navigateTo({
          url: '../../presentationBox/disclose/disclose?id=' + that.data.bgId,
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  
})