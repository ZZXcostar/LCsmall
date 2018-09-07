// pages/view/decorate/decorate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commpontName: "圣都装饰城西分公司",
    signDate: '2018-02-10',
    dectype: "欧式",
    household: '三室一厅一卫',
    measure: '132㎡',
    offer: '14万',
    Design: '1万',
    Administration: '10%',
    direct: '1万',
    project: '1万',
    iskuang:false,
    countryCodes: ["1", "2", "3", "4",'5','6','7'],
    checkboxItems: {
      decorationType: [
        { name: '平层公寓', value: '0', checked: true },
        { name: '复式、LOFT', value: '1' },
        { name: '排屋、别墅', value: '2' }
      ],
      decorationSituation: [
        { name: '毛坯房', value: '0', checked: true },
        { name: '二手房', value: '1' },
        { name: '精装房改造', value: '2' }
      ],
      decorationUse: [
        { name: '自助', value: '0', checked: true },
        { name: '出租', value: '1' },
        { name: '其他', value: '2' }
      ],
      decorationForm: [
        { name: '全包', value: '0', checked: true },
        { name: '半包', value: '1' },
        { name: '清场', value: '2' },
        { name: '整装', value: '3' },
        { name: '半包+部分主', value: '4' },
      ]
    },
    roomRate:[
      { name: '主卧', square: '32' },
      { name: '次卧', square: '32' },
      { name: '餐厅', square: '32' },
      { name: '主卧', square: '32' },
      { name: '主卧', square: '32' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    console.log(e.currentTarget.dataset.chk)
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
    console.log('picker country code 发生选择改变，携带值为', e.detail.value);
    console.log(e.currentTarget.dataset.chk)
    var chk = e.currentTarget.dataset.chk
    if(chk=='index'){
      this.setData({
        countryCodeIndex: e.detail.value
      })
    }else if(chk=='index1'){
      this.setData({
        countryCodeIndex1: e.detail.value
      })
    } else if (chk == 'index2') {
      this.setData({
        countryCodeIndex2: e.detail.value
      })
    } else if (chk == 'index3') {
      this.setData({
        countryCodeIndex3: e.detail.value
      })
    } else if (chk == 'index4') {
      this.setData({
        countryCodeIndex4: e.detail.value
      })
    }
  },
  istankuang(){
    this.setData({
      iskuang:true
    })
  },
  iskuangfrom(){
    this.setData({
      iskuang: false
    })
  }
})