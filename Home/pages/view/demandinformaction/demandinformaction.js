// pages/view/presentationBox/wantAdd/wantAdd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkboxItems:{
      equipment:[  //设备
        { name: '中央空调', value: '0', checked: true },
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
        { name: '烤箱', value: '0', checked: true  },
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
        { name: '浴缸', value: '0', checked: true },
        { name: '智能坐便器', value: '1' },
        { name: '入墙式预埋花洒', value: '2' },
      ],
      balcony: [  //阳台
        { name: '热水', value: '0', checked: true },
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
        { name: '卡机', value: '0', checked: true },
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
        { name: '卡机', value: '0', checked: true },
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
    } 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  checkboxChange: function (e) { //多选按钮点击事件
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    console.log(e.currentTarget.dataset.chk)
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
})