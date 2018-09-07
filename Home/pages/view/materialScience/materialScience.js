// pages/view/presentationBox/wantAdd/wantAdd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: '有', value: '0', checked: true },
      { name: '部分', value: '1' }
    ], 
    radioItems1: [
      { name: '有', value: '0', checked: true },
      { name: '部分', value: '1' }
    ],
    checkboxItems: [
      { name: '有', value: '0', checked: true },
      { name: '部分', value: '1' },
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var chk = e.currentTarget.dataset.chk
    if (chk =='radioItems'){
      var radioItems = this.data.radioItems;
    }else{
      var radioItems = this.data.radioItems1;
    }
    var len = e.detail.value
    var ind = len[(len.length - 1)]
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      if (radioItems[i].value == ind) {
        radioItems[i].checked = true;
      } else {
        radioItems[i].checked = false;
      }
    }
    if (chk == 'radioItems') {
      this.setData({
        radioItems: radioItems
      });
    } else {
      this.setData({
        radioItems1: radioItems
      });
    }
  },
})