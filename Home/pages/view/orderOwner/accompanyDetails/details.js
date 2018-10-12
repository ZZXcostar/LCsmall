// pages/login/login.js
var utilBox = require("../../../../utils/utilBox.js");
var network = require("../../../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo:"",
    appointTime:'',
    tabs: [
      {
        name: '陪签备忘录',
        list: ['后期可能存在的增项', '材料工艺项目', '施工图纸建议', '合同记录','其他注意事项及疑义事项']
      },
      {
        name: '数据收集表',
        list: ['数据收集表']
      },
      {
        name: '基础信息表',
        list: ['业主基本信息','房屋基本信息','需求信息']
      }
    ],
    activeIndex: 0,
    sliderLeft: 0,
    projectId:'',
    showcancle:true,
    countryCodes:["清 包","半 包","全 包","半包+主材"],
    huxing:'',
    cookie:'',
    inputVal:'',
    workId:''
  },
  onLoad: function (options) {
    var id = options.orderId;
    var workId = options.workId
    wx.setStorageSync('addDesignerId', id);
    var that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    this.setData({
      projectId: id,
      cookie:cookie,
      workId: workId
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
        res.data.info[0].acreage=parseInt(res.data.info[0].acreage)
        wx.setStorageSync('pqOrderInfo', res.data.info[0])
        that.setData({
          orderInfo: res.data.info[0]
        })
        let appointTimes = res.data.info[0].orderDetail.appointment
        if (appointTimes == null){
          that.setData({
            appointTime: ''
          })
        }else{
          let appointTimeArr1 = appointTimes.startTime.split(" ")
          let appointTimeStr1 = appointTimeArr1[0]
          let appointTimeStr2 = appointTimeArr1[1]
          let appointTimeArr2 = appointTimeStr2.split(":")
          let appointTimeStr3 = appointTimeArr2[0] +":"+ appointTimeArr2[1]
            that.setData({
              appointTime: appointTimeStr1 +" "+ appointTimeStr3
          })
        }
        that.setData({
          huxing: that.data.orderInfo.decorate == null ? '' : that.data.orderInfo.decorate
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  onShow: function (){
    let addDesignerId = wx.getStorageSync('addDesignerId');
    if (addDesignerId){
      var id = addDesignerId;
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
            huxing: that.data.orderInfo.decorate == null ? '' : that.data.orderInfo.decorate
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  },
  changeshow: function (e) {
    var isshow = null;
    if (e.target.id == 'overback') {
      isshow = true;
    }
    else if (e.target.id == 'cancle') {
      isshow = this.data.showcancle ? false : true;
    }
    this.setData({ showcancle: isshow });
    this.setData({ inputVal: '' });
  },
  //修改装修类型
  bindCountryCodeChange: function (e) {
    var list = e.detail.value
    var countryCodes = this.data.countryCodes
    this.setData({
      huxing: countryCodes[e.detail.value]
    })
    let cookie = this.data.cookie
    let updataData = {
      id: this.data.projectId,
      decorate: this.data.huxing,
    }
    wx.request({
      url: utilBox.urlheader + "/product/ProjectEstablish/update",
      data: updataData,
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        if (res.status == 200){
          wx.showToast({
            title: "修改成功",
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  resonInput: function (e) {
    let str = e.detail.value
    this.setData({
      inputVal: str
    })
  },
  //放弃接单
  giveupOrder(){
    let that = this;
    let ids = this.data.workId;
    let reason = this.data.inputVal;
    let replaceVlaue = reason.trim()
    if (reason == '' || replaceVlaue == '') {
      wx.showToast({
        title: '请输入放弃原因',
        icon: 'none'
      })
    }else{
      network.requestLoading(
        utilBox.urlheader + `product/workList/update`,
        {
          id: ids,
          isAccepted: 4,
          rejectedReason: reason
        }, "",
        function (res) {
          console.log(res)
          let resMessage = res.info

          if (res.status == 200) {
            wx.showToast({
              title: "放弃订单成功",
            })
            that.setData({ showcancle: true });
            wx.switchTab({
              url: '../../orderOwner/list/list',
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              }
            })
          } else {
            wx.showToast({
              title: res.msg,
            })
          }


        }, function (res) {
          wx.showToast({
            title: '放弃派单失败',
          })
        }, 'application/json')
    }
    
  },
  //添加设计师信息
  addDesigner(event){
    console.log(event)
    let projectId = event.currentTarget.dataset.projectid;
    console.log(projectId)
      wx.navigateTo({
        url: '../../addDesigner/addDesigner?projectId=' + projectId,
      })
  },
  towantAdd(e){
    var goWantAdd = e.currentTarget.dataset.towantadd
    var goDetail = ''
    if (goWantAdd =='后期可能存在的增项'){
      goDetail = '../../wantAddEidt/wantAddEidt';
    } else if (goWantAdd =='材料工艺项目'){
      goDetail = '../../materialScience/materialScience';
    } else if (goWantAdd == '施工图纸建议') {
      goDetail = '../onstructionDrawings/onstructionDrawings';
    } else if (goWantAdd == '合同记录') {
      goDetail = '../../presentationBox/contractProposal/contractProposal';
    } else if (goWantAdd == '其他注意事项及疑义事项') {
      goDetail = '../../orderother/orderother';
    } else if (goWantAdd == '数据收集表') {
      goDetail = '../dataInfo/dataInfo';
    } else if (goWantAdd == '业主基本信息') {
      goDetail = '../../orderbasic/orderbasic';
    } else if (goWantAdd == '房屋基本信息') {
      goDetail = '../../orderHose/orderHose';
    } else{
      goDetail = '../../demandinformaction/demandinformaction';
    }
    goDetail += '?projectId=' + this.data.projectId
    wx.navigateTo({
      url: goDetail,
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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
})