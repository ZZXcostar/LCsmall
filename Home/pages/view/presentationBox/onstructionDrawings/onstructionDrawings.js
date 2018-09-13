// pages/view/presentationBox/wantAdd/wantAdd.js
var utilBox = require("../../../../utils/utilBox.js");
Page({
  data: {
    checkboxItems: [
      {name: '原始尺寸图', value: '0', checked: true },
      { name: '拆除平面图', value: '1' },
      { name: '砌墙平面图', value: '2' },
      { name: '平面布置图', value: '3' },
      { name: '平面尺寸图', value: '4' },
      { name: '家具尺寸图', value: '5' },
      { name: '吊顶布置图', value: '6' },
      { name: '吊顶尺寸图', value: '7' },
      { name: '灯位尺寸图', value: '8' },
      { name: '插座布置图', value: '9' },
      { name: '弱电布置图', value: '10' },
      { name: '空调系统图', value: '11' },
      { name: '开关布置图', value: '12' },
      { name: '配电系统图', value: '13' },
      { name: '地面铺贴图', value: '14' },
      { name: '立面索引图', value: '15' },
      { name: '各节点详图', value: '16' },
      { name: '各立面展开图', value: '17' },
      { name: '给水管布置图', value: '18' },
      { name: '效果图（VR/草图）', value: '19' },
    ],
    projectId:'',//项目id
    rest:'',
    cookie:'',
    isSee:false
  },
  onLoad: function (options) {
    var that=this
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    var id = options.projectId
    this.setData({
      projectId: id,
      cookie: cookie
    })
    
    wx.request({
      url: utilBox.urlheader + "public/entrysignsuggest/queryByIds",
      data: [id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        var list = res.data.info.list
        console.log(list)
        if (list.length) {
          var drawing = list[0].drawing.split('+')
          let checkboxItems = that.data.checkboxItems
          for (let k in checkboxItems){
            for(let i in drawing){
              if (drawing[i] == checkboxItems[k].name){
                checkboxItems[k].checked=true
              }
            }
          }
          that.setData({
            isSee: false,
            rest: list[0].rest,
            checkboxItems
          })
        } else {
          that.setData({
            isSee: true
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  rest(e) {
    this.setData({
      rest: e.detail.value
    })
  },
  checkboxChange: function (e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      checkboxItems: checkboxItems
    });
  },
  showTopTips(){
    var data = {}
    data.projectId = this.data.projectId;
    data.rest = this.data.rest;
    var checkboxItems = this.data.checkboxItems;
    var list = ""
    for (let i in checkboxItems){
      if (checkboxItems[i].checked==true){
        list += checkboxItems[i].name + '+'
      }
    }
    data.drawing = list
    // console.log(data)
    let cookie = this.data.cookie
    wx.request({
      url: utilBox.urlheader + "public/entrysignsuggest/insertOne",
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        // console.log(res)
        if (res.data.status == 200) {
          wx.navigateBack({ changed: true });//返回上一页
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})