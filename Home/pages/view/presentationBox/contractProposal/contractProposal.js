// pages/view/presentationBox/wantAdd/wantAdd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: '杭州市推荐版', value: '0', checked: true },
      { name: '自印版', value: '1'}
    ],
    radioItemsa: [
      { name: 'cell standard', value: '0', checked: true },
      { name: 'cell standard', value: '1' },
      { name: 'cell standard', value: '2' }
    ],
    checkboxItems: [
      { name: '杭州市推荐版', value: '0', checked: true },
      { name: '自印版', value: '1' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    var len = e.detail.value
    var ind=len[(len.length-1)]
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      if (radioItems[i].value==ind){
        radioItems[i].checked = true;
      }else{
        radioItems[i].checked=false;
      }
    }
    this.setData({
      radioItems: radioItems
    });
  },
})