// pages/view/presentationBox/wantAdd/wantAdd.js
var utilBox = require("../../../utils/utilBox.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxItems:{
      equipment:[  //设备
        { name: '中央空调', value: '0'},
        { name: '挂机', value: '1' },
        { name: '地暖', value: '2' },
        { name: '新风', value: '3' },
        { name: '前置', value: '4' },
        { name: '直饮水', value: '5' },
        { name: '智能化', value: '6' },
        { name: '安防', value: '7' },
        { name: '水循环', value: '8' },
        { name: '燃气', value: '9' },
        { name: '空气能', value: '10'},
        { name: '电热水器', value: '11' },
      ],
      kitchen: [ //厨房
        { name: '烤箱', value: '0'},
        { name: '蒸箱', value: '1'},
        { name: '集成灶', value: '2' },
        { name: '消毒柜', value: '3' },
        { name: '洗碗机', value: '4' },
        { name: '双门冰箱', value: '5' },
        { name: '电热水器', value: '6' },
        { name: '嵌入式电器', value: '7' },
        { name: '垃圾处理器', value: '8' },
        { name: '燃气热水器', value: '9' }
      ],
      toilet: [ //卫生间
        { name: '浴缸', value: '0'},
        { name: '智能坐便器', value: '1' },
        { name: '入墙式预埋花洒', value: '2' },
      ],
      balcony: [  //阳台
        { name: '热水', value: '0'},
        { name: '冷水', value: '1' },
        { name: '小厨宝', value: '2' },
        { name: '洗衣机', value: '3' },
        { name: '地板', value: '4' },
        { name: '地砖', value: '5' },
        { name: '乳胶漆', value: '6' },
        { name: '瓷砖', value: '7' },
        { name: '铝合金包阳台', value: '8' }
      ],
      room: [ //房间
        { name: '卡机', value: '0',},
        { name: '涂料', value: '1' },
        { name: '壁灯', value: '2' },
        { name: '地砖', value: '3' },
        { name: '中央空调', value: '4' },
        { name: '墙纸/布', value: '5' },
        { name: '强化地板', value: '6' },
        { name: '实木复合地板', value: '7' },
        { name: '实木地板', value: '8' },
        { name: '定制柜体', value: '9' },
        { name: '硬软转背包', value: '10' },
        { name: '木饰面背景', value: '11' },
        { name: '现场制作柜体', value: '12' }
      ],
      restaurant: [ //客餐厅
        { name: '卡机', value: '0',},
        { name: '涂料', value: '1' },
        { name: '壁灯', value: '2' },
        { name: '地砖', value: '3' },
        { name: '中央空调', value: '4' },
        { name: '墙纸/布', value: '5' },
        { name: '强化地板', value: '6' },
        { name: '实木复合地板', value: '7' },
        { name: '实木地板', value: '8' },
        { name: '定制柜体', value: '9' },
        { name: '硬软转背包', value: '10' },
        { name: '木饰面背景', value: '11' },
        { name: '现场制作柜体', value: '12' }
      ],
      projectId:'', //项目id
      cookie: '',
      isSee: false,
      data:''
    } 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    var id = options.projectId
    this.setData({
      projectId: id,
      cookie
    })
    wx.request({
      url: utilBox.urlheader + "public/entrysigndemand/queryByIds",
      data: [id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        var list = res.data.info.list;
        if (list.length) {
          var checkboxItems = that.data.checkboxItems
          checkboxItems.equipment = that.demandData(checkboxItems.equipment, list[0].equipment)
          checkboxItems.kitchen = that.demandData(checkboxItems.kitchen, list[0].kitchen)
          checkboxItems.toilet = that.demandData(checkboxItems.toilet, list[0].toilet)
          checkboxItems.balcony = that.demandData(checkboxItems.balcony, list[0].balcony)
          checkboxItems.room = that.demandData(checkboxItems.equipment, list[0].room)
          checkboxItems.restaurant = that.demandData(checkboxItems.restaurant, list[0].parlor)
          that.setData({
            isSee: false,
            data:list[0],
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
  demandData(list, data) { //单选数据处理
    var arr=data.split("+")
    arr.pop()
    for (let i in list) {
      for(let j in arr){
        if(list[i].name==arr[j]){
          list[i].checked=true
        }
      }
    }
    return list
  },
  checkboxChange: function (e) { //多选按钮点击事件
    var chk = e.currentTarget.dataset.chk;
    var values = e.detail.value;
    var checkboxItems = this.data.checkboxItems
    var checkboxItem=""
    if (chk =='equipment'){
      checkboxItem = checkboxItems.equipment
    } else if (chk =='kitchen'){
      checkboxItem = checkboxItems.kitchen
    } else if (chk =='toilet'){
      checkboxItem = checkboxItems.toilet
    } else if (chk =='balcony'){
      checkboxItem = checkboxItems.balcony
    }else if(chk=='room'){
      checkboxItem = checkboxItems.room
    }else{
      checkboxItem = checkboxItems.restaurant
    }
    for (var i = 0, lenI = checkboxItem.length; i < lenI; ++i) {
      checkboxItem[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItem[i].value == values[j]) {
          checkboxItem[i].checked = true;
          break;
        }
      }
    }
    if (chk == 'equipment') {
      checkboxItems.equipment = checkboxItem
    } else if (chk == 'kitchen') {
      checkboxItems.kitchen=checkboxItem
    } else if (chk == 'toilet') {
      checkboxItems.toilet=checkboxItem
    } else if (chk == 'balcony') {
      checkboxItems.balcony=checkboxItem
    } else if (chk == 'room') {
      checkboxItems.room=checkboxItem
    } else {
      checkboxItems.restaurant=checkboxItem
    }
    this.setData({
      checkboxItems: checkboxItems
    });
  },
  formSubmit(e){ //数据提交
    var data={}
    var list = e.detail.value
    data.projectId = this.data.projectId;
    data.equipmentr = list.equipmentr;
    data.kitchenr = list.kitchenr;
    data.toiletr = list.toiletr;
    data.balconyr = list.balconyr;
    data.roomr = list.roomr;
    data.parlorr = list.parlorr;
    data.rest = list.rest;
    var checkboxItems = this.data.checkboxItems
    for (let k in checkboxItems) {
      var dd = ""
      for (let i in checkboxItems[k]) {
        if (checkboxItems[k][i].checked) {
          dd += checkboxItems[k][i].name + '+';
        }
      }
      if (k == 'equipment') {
        data.equipment = dd
      } else if (k == 'kitchen') {
        data.kitchen = dd
      } else if (k == 'toilet') {
        data.toilet = dd
      } else if (k == 'balcony') {
        data.balcony = dd
      } else if (k == 'room') {
        data.room = dd
      } else if (k == 'restaurant'){
        data.parlor = dd
      }
    }
    let cookie = this.data.cookie
    wx.request({
      url: utilBox.urlheader + "public/entrysigndemand/insertOne",
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
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