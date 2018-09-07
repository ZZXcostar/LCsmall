// pages/view/presentationBox/wantAdd/wantAdd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radioItems: [
      { name: 'cell standard', value: '0', checked: true },
      { name: 'cell standard', value: '1'},
      { name: 'cell standard', value: '2' }
    ],
    radioItemsa: [
      { name: 'cell standard', value: '0', checked: true },
      { name: 'cell standard', value: '1' },
      { name: 'cell standard', value: '2' }
    ],
    checkboxItems: [
      { name: '是否存在中央空调6平方外机线或者4平方内机线增项；', value: '0', checked: true },
      { name: '水电工程是否包含水电打孔？', value: '1' },
      { name: '空开漏保以及弱电模块是否自理；', value: '2' },
      { name: '是否有厨卫4平方线单独增加费用；', value: '4' },
      { name: '是否有强弱电箱移位或者安装费用？此外若有移位注意进线是否需要另接/更换；', value: '5' }
    ],
    checkboxItems1: [  //泥土工程存在增项
      { name: '存在铺贴方式的增项（拼花、斜铺、倒角等）；', value: '0', checked: true },
      { name: '存在铺贴辅材胶泥、背胶的增项', value: '1' },
      { name: '存在原始地面找平费用——非实木地板基础找平层或者原始基础不平整；', value: '2' },
      { name: '存在墙地砖铺贴勾缝/填缝增项（注意美缝一般自理）', value: '4' }
    ],
    checkboxItems2: [  //防水工程存在增项
      { name: '阳台防水视情况决定是否需要', value: '0', checked: true },
    ],
    checkboxItems3: [  //木作工程存在增项
      { name: '后期视情况决定增减木工板门套基础', value: '0', checked: true },
      { name: '封门头另计？', value: '1' }
    ],
    checkboxItems4: [  //油漆工程存在增项
      { name: '后期根据墙面实际情况决定需要网格布', value: '0', checked: true },
      { name: '存在乳胶漆调色费用', value: '1' },
      { name: '腻子工程包含阳角条', value: '2' },
      { name: '有石膏线修补', value: '4' }
    ],
    checkboxItems5: [  //其他增项
      { name: '全场拆除及外墙饰面铲除自理', value: '0', checked: true },
      { name: '有下沉式卫生间回填', value: '1' }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    console.log(e.currentTarget.dataset.chk)
    var chk = e.currentTarget.dataset.chk
    var values = e.detail.value;
    if (chk == 'checkboxItems'){
      var checkboxItems = this.data.checkboxItems
    } else if (chk == 'checkboxItems1'){
      var checkboxItems = this.data.checkboxItems1
    } else if (chk == 'checkboxItems2') {
      var checkboxItems = this.data.checkboxItems2
    }else if (chk == 'checkboxItems3') {
      var checkboxItems = this.data.checkboxItems3
    } else if (chk == 'checkboxItems4') {
      var checkboxItems = this.data.checkboxItems4
    }else{
      var checkboxItems = this.data.checkboxItems5
    }
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    if (chk == 'checkboxItems') {
      this.setData({
        checkboxItems: checkboxItems
      });
    } else if (chk == 'checkboxItems1') {
      this.setData({
        checkboxItems1: checkboxItems
      });
    } else if (chk == 'checkboxItems2') {
      this.setData({
        checkboxItems2: checkboxItems
      });
    } else if (chk == 'checkboxItems3') {
      this.setData({
        checkboxItems3: checkboxItems
      });
    } else if (chk == 'checkboxItems4') {
      this.setData({
        checkboxItems4: checkboxItems
      });
    } else {
      this.setData({
        checkboxItems5: checkboxItems
      });
    }
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },
  radioChanges: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItemsa = this.data.radioItemsa;
    for (var i = 0, len = radioItemsa.length; i < len; ++i) {
      radioItemsa[i].checked = radioItemsa[i].value == e.detail.value;
    }

    this.setData({
      radioItemsa: radioItemsa
    });
  },
  
})