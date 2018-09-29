// pages/view/decorate/decorate.js
var utilBox = require("../../../utils/utilBox.js");
Page({
  data: {
    iskuang:false,
    countryCodes: [
      ["1房", "2房", "3房", "4房", '5房', '6房', '7房'],
      [ "1厅", "2厅", "3厅", "4厅", '5厅', '6厅', '7厅'],
      [ "1卫", "2卫", "3卫", "4卫", '5卫', '6卫', '7卫'],
      [ "1厨", "2厨", "3厨", "4厨", '5厨', '6厨', '7厨'],
      [ "1阳台", "2阳台", "3阳台", "4阳台", '5阳台', '6阳台', '7阳台']
      ],
    huxing:'',
    checkboxItems: {
      decorationType: [
        { name: '平层公寓', value: '0'},
        { name: '复式/LOFT', value: '1' },
        { name: '排屋', value: '2' },
        { name: '别墅', value: '3' }
      ],
      decorationSituation: [
        { name: '毛坯房', value: '0'},
        { name: '二手房', value: '1' },
        { name: '精装房改造', value: '2' }
      ],
      decorationUse: [
        { name: '自住', value: '0'},
        { name: '出租', value: '1' },
        { name: '其他', value: '2' }
      ],
      decorationForm: [
        { name: '全包', value: '0'},
        { name: '半包', value: '1' },
        { name: '清包', value: '2' },
        { name: '整装', value: '3' },
        { name: '半包+部分主', value: '4' },
      ]
    },
    roomRate:[
      { name: '主卧', square: '' },
      { name: '厨房', square: '' },
      { name: '次卧', square: '' },
      { name: '阳台1', square: '' },
      { name: '阳台2', square: '' },
      { name: '儿童房', square: '' },
      { name: '更衣室', square: '' },
      { name: '书房', square: '' },
      { name: '客厅过道', square: '' },
      { name: '客房', square: '' },
      { name: '主卫', square: '' },
      { name: '次卫', square: '' },
    ],
    orderInfo:'',
    projectId:'',
    types:'',
    measure:'',
    dates:"2018-09-20",
    cookie: '',
    isSee: false,
    data:''
  },
  /**
   * 生命周期函数
   */
  onLoad: function (options) {
    var that=this
    var id = options.projectId
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    var orderInfo = wx.getStorageSync("pqOrderInfo")
    this.setData({
      projectId: id,
      orderInfo: orderInfo,
      cookie
    })
    wx.request({
      url: utilBox.urlheader + "public/entrysignhousinginformation/queryByIds",
      data: [id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        var list = res.data.info.list;
        if (list.length) {
          var addHousehold = list[0].addHousehold.split('+')
          var arr = []
          for (let i in addHousehold) { //得房率处理
            let obj = {}
            var aa = addHousehold[i].split(':')
            obj.name = aa[0]
            obj.square = aa[1]
            arr.push(obj)
          }
          arr.pop()
          var checkboxItems = that.data.checkboxItems
          checkboxItems.decorationType = that.homeData(checkboxItems.decorationType, list[0].housingType)
          checkboxItems.decorationSituation = that.homeData(checkboxItems.decorationSituation, list[0].decorateSituation)
          checkboxItems.decorationUse = that.homeData(checkboxItems.decorationUse, list[0].decorationPurposes)
          checkboxItems.decorationForm = that.homeData(checkboxItems.decorationForm, list[0].decorateForm)
          that.setData({
            isSee: false,
            huxing:list[0].householdType,
            roomRate:arr,
            data:list[0],
            dates: list[0].decorateTime,
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
  homeData(list,data){ //单选数据处理
    for(let i in list){
      if(list[i].name==data){
        list[i].checked=true
      }else{
        list[i].checked = false
      }
    }
    return list
  },
  checkboxChange: function (e) {
    var chk = e.currentTarget.dataset.chk;
    var values = e.detail.value;
    var checkboxItems = this.data.checkboxItems
    var checkboxItem = ""
    if (chk == 'decorationType') {
      checkboxItem = checkboxItems.decorationType
    } else if (chk == 'decorationSituation') {
      checkboxItem = checkboxItems.decorationSituation
    } else if (chk == 'decorationUse') {
      checkboxItem = checkboxItems.decorationUse
    } else if (chk == 'decorationForm') {
      checkboxItem = checkboxItems.decorationForm
    }
    var len = e.detail.value
    var ind = len[(len.length - 1)]
    for (var i = 0, len = checkboxItem.length; i < len; ++i) {
      if (checkboxItem[i].value == ind) {
        checkboxItem[i].checked = true;
      } else {
        checkboxItem[i].checked = false;
      }
    }
    if (chk == 'decorationType') {
      checkboxItems.decorationType = checkboxItem
    } else if (chk == 'decorationSituation') {
      checkboxItems.decorationSituation = checkboxItem
    } else if (chk == 'decorationUse') {
      checkboxItems.decorationUse = checkboxItem
    } else if (chk == 'decorationForm') {
      checkboxItems.decorationForm = checkboxItem
    }

    this.setData({
      checkboxItems: checkboxItems
    });
  },
  bindCountryCodeChange: function (e) {
    var list = e.detail.value
    var countryCodes = this.data.countryCodes
    var huxing=""
    for (let i in countryCodes){
      let aa = list[i]
      huxing += countryCodes[i][aa]
    }
    this.setData({
      huxing: huxing
    })
  },
  istankuang(){
    this.setData({
      iskuang:true
    })
  },
  iskuangfrom(e){
    var istrue = e.currentTarget.dataset.istrue
    var list={}
    list.name = this.data.types
    list.square = this.data.measure
    if (istrue=='true'){
      if (list.name==''){
        wx.showToast({
          icon: 'none',
          title: '类型不能为空！',
        })
      }else{
        let roomRate = this.data.roomRate
        roomRate.push(list)
        this.setData({
          roomRate: roomRate,
          iskuang: false
        })
      }
      
    }else{
      this.setData({
        iskuang: false
      })
    }
  },
  measure(e){
    this.setData({
      measure: e.detail.value
    })
  },
  types(e) {
    this.setData({
      types: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      dates: e.detail.value
    })
  },
  roomRate(e){
    var ind = e.currentTarget.dataset.ind
    var value = e.detail.value
    var roomRate = this.data.roomRate
    roomRate[ind].square = value
    this.setData({
      roomRate: roomRate
    })
  },
  formSubmit(e){
    var checkboxItems = this.data.checkboxItems
    var list = e.detail.value
    var data={}
    data.projectId = this.data.projectId;
    data.householdType = this.data.huxing;
    data.acreage = list.acreage;
    data.contract = list.contract;
    data.decorateTime = this.data.dates;
    data.decoration = list.decoration;
    data.furnishingStyle = list.furnishingStyle;
    for (let k in checkboxItems){
      for (let i in checkboxItems[k]){
        if (k == "decorationType" && checkboxItems[k][i].checked==true){
          data.housingType = checkboxItems[k][i].name
        } else if (k == "decorationSituation" && checkboxItems[k][i].checked == true){
          data.decorateSituation = checkboxItems[k][i].name
        } else if (k == "decorationUse" && checkboxItems[k][i].checked == true) {
          data.decorationPurposes = checkboxItems[k][i].name
        } else if (k == "decorationForm" && checkboxItems[k][i].checked == true) {
          data.decorateForm = checkboxItems[k][i].name
        }
      }
    }
    var roomRate = this.data.roomRate
    var addHousehold=""
    for (let j in roomRate){
      addHousehold += roomRate[j].name + ':' + roomRate[j].square+'+'
    }
    data.addHousehold = addHousehold
    let cookie = this.data.cookie
    wx.request({
      url: utilBox.urlheader + "public/entrysignhousinginformation/insertOne",
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