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
    nodeInfo:'',
    index:'',
    bgId:'',
    orderNum:''
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
    console.log(wx.getStorageSync('id'))
    // 
    this.setData({
      orderId: options.id,
      types: options.types,
      cookie: cookie,
      bgId: options.bgid,
      standard: options.standard,
      acceptance: options.acceptance,
      index: options.index,
      orderNum: wx.getStorageSync('orderNum')
    })
  },
  noNeed(){ //无需验收
    var that = this;
    var cookie = this.data.cookie
    var id = wx.getStorageSync('id')
    wx.showModal({
      title: '是否提交报告',
      content: '报告提交后不可修改！！',
      success: function (res) {
        wx.request({
          url: utilBox.urlheader + "public/entryreport/updateType", //仅为示例，并非真实的接口地址
          data: {
            isService: 2,
            reportId: that.data.bgId,
            id:  that.data.orderId,
            remark: "无需验收"
          },
          header: {
            'content-type': 'application/json', // 默认值
            cookie: cookie
          },
          method: 'post',
          success: function (res) {
            console.log(res)
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
            })
            if(res.data.status == 200){
              wx.navigateBack({ changed: true });//返回上一页
            }
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    })  
  },
  
  formSub(e){ //数据提交
    var that = this;
    var cookie = this.data.cookie
    var id = that.data.bgId
    if (e.detail.value.aa0 == '' && e.detail.value.bb0==''){
      wx.showToast({
        icon: 'none',
        title: '检测说明不能为空',
      })
      return
    }
    if (that.data.activeIndex==0){ //不合格输入框数据
      var aa0 = e.detail.value.aa0
      var aa1 = e.detail.value.aa1
      var aa2 = e.detail.value.aa2
      var aa3 = e.detail.value.aa3
      if (this.data.imglists == '') {
        wx.showToast({
          icon: 'none',
          title: '不合格图片不能为空',
        })
        return;
      }
      if (aa1==''){
        wx.showToast({
          icon: 'none',
          title: '解决方案不能为空',
        })
        return;
      }
      if (aa2 == '') {
        wx.showToast({
          icon: 'none',
          title: '施工隐患不能为空',
        })
        return;
      }
      if (aa3 == '') {
        wx.showToast({
          icon: 'none',
          title: '解决方法不能为空',
        })
        return;
      }
    } else {  //合格输入框数据
      var aa0 = e.detail.value.bb0
      var aa1 = ''
      var aa2 = ''
      var aa3 = ''
    }
    var imgList = this.data.imglists;
    var data={}
    data.imgs = imgList;
    data.solution=aa1;
    data.hdanger=aa2;
    data.solutionf=aa3;
    data.instructions=aa0;
    data.isService = that.data.activeIndex;
    data.reportId=id;
    data.id = that.data.orderId
    data.remark = "合格与不合格";
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
        data.imgs = img
        if (res.confirm) {
          wx.request({
              url: utilBox.urlheader + "public/entryreport/updateType",
              data: data,
              header: {
                'content-type': 'application/json', // 默认值
                cookie: cookie
              },
              method: 'post',
              success: function (res) {
                if (res.data.status == 200){
                  wx.navigateBack({ changed: true });//返回上一页
                  // wx.navigateTo({//刷新页面的返回
                  //   url: '../../presentationBox/disclose/disclose?id='+that.data.bgId,
                  // })
                }
               
              },
              fail: function (err) {
                console.log(err)
              }
            })
        } else if (res.cancel) {
          wx.setStorageSync('jlNodeInfos', data)
          wx.navigateTo({
            url: '../../orderOwner/preview/preview?act=11&index='+that.data.index
          })
        }
      }
    })  
    // 订单信息查询
  },
})