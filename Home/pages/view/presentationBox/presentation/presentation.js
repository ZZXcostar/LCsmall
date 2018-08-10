var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
//引入封装好的请求模块
var utilBox = require("../../../../utils/utilBox.js");
var network = require("../../../../utils/network.js");

Page({
  data: {
    tabs: ["待服务", "服务中", "已放弃", "已完成"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    currentTab: 0,
    inputShowed: false,
    inputVal: "",
    navLeftId:0,//左侧列表的id号    
    listInfo:[
      {"name":"全程"},
      { "name": "精装" },
      { "name": "毛培" },
      { "name": "决算" },
      { "name": "单次水电" },
      { "name": "单次泥工" }
      ],
    orderdataeList:[
      {orderNumber:'201814815144',
      types:"服务中",
      typedata:"监理服务",
      name:"张三",
      add:"杭州市胜多负少发链接是登陆副科级",
      node:"开工交点3.0",
      nextnode:"验收节点3.0"
      }, 
      {
        orderNumber: '201814815144',
        types: "服务中",
        typedata: "陪迁服务",
        name: "张三",
        add: "杭州市胜多负少发链接是登陆副科级",
        node: "开工交点3.0",
        nextnode: "验收节点3.0"
      },
      {orderNumber: '201814815144',
        types: "服务中",
        typedata: "陪迁服务",
        name: "张三",
        add: "杭州市胜多负少发链接是登陆副科级",
        node: "开工交点3.0",
        nextnode: "验收节点3.0"
      },
      {orderNumber: '201814815144',
        types: "服务中",
        typedata: "陪迁服务",
        name: "张三",
        add: "杭州市胜多负少发链接是登陆副科级",
        node: "开工交点3.0",
        nextnode: "验收节点3.0"
      }
      ]
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 4,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    //服务类型查询
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    wx.request({
      url: utilBox.urlheader + "product/serviceType/find", //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        console.log(res.data.info.list)
        let navLeftData = res.data.info.list;
        that.setData({
          listInfo: navLeftData,
          navLeftId: navLeftData[0].id
        })
        that.getRightData(that.data.activeIndex, that.data.navLeftId)
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  clickTab: function(e){
    var that = this;
    this.setData({
      currentTab: e.target.dataset.current,
      navLeftId: e.currentTarget.dataset.currenttabid
    })
    this.getRightData(this.data.activeIndex, this.data.navLeftId)
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      currentTab: 0
    });
    this.getRightData(this.data.activeIndex, this.data.navLeftId)
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  goassociationReport:function(e){
    console.log(e.currentTarget.dataset.reportid)
    let reportId = e.currentTarget.dataset.reportid
    wx.navigateTo({
      url: '../associationReport/associationReport?reportId=' + reportId,
    })
  },
  gopresent: function (val){
    console.log(val.currentTarget.dataset.reportid)
    let orderId = val.currentTarget.dataset.reportid
    if(val.currentTarget.dataset.type == "陪签"){
      wx.navigateTo({
        url: '../accompany/accompany?reportid='+orderId,
      })
    } else if (val.currentTarget.dataset.type == "监理服务"){
      wx.navigateTo({
        url: '../supervisor/supervisor?reportid=' + orderId,
      })
    }
    
  },
  // 右侧数据请求
  getRightData(topNav,leftNav){
    var that=this;
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    console.log(topNav)
    console.log(leftNav)
    wx.request({
      url: utilBox.urlheader + "/product/workList/queryType?typeId=" + leftNav, //仅为示例，并非真实的接口地址
      data: {
        isAccepted: topNav
      },
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        console.log(res.data.info)
        let data = res.data.info
        var newData=[]
        if(data!=null){
          for (let i = 0; i < data.length; i++) {
            let obj = {}
            obj.name = data[i].projectEstablish.orderDetail.name;
            obj.phone = data[i].projectEstablish.orderDetail.phone;
            obj.orderNum = data[i].projectEstablish.orderDetail.orderNumber;
            obj.add = data[i].projectEstablish.orderDetail.detailAddress;
            obj.types = that.data.tabs[that.data.activeIndex];
            obj.typedata = data[i].projectEstablish.orderDetail.categoryName
            obj.reportId = data[i].projectEstablishId
            newData.push(obj)
          }
          wx.request({
            url: utilBox.urlheader + "public/entryreport/query", //仅为示例，并非真实的接口地址
            data: {
              serviceTypeId :1,
              projectId:data[0].projectEstablishId
            },
            header: {
              'content-type': 'application/json', // 默认值
              cookie: cookie
            },
            method: 'post',
            success: function (res) {
              console.log(res)
            },
            fail: function (err) {
              console.log(err)
            }

          })
        }
        console.log(newData)
        that.setData({
          orderdataeList: newData
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
});