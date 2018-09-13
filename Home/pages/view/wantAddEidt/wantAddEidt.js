// pages/view/presentationBox/wantAdd/wantAdd.js
var utilBox = require("../../../utils/utilBox.js");
Page({
  data: {
    checkboxItems: {},
    remarks:'', //备注
    projectId:'',//项目id
    cookie:'',
    isSee:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var id=options.projectId
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    var checkboxItems = {
      hydropower: [ //水电工程增项
        { name: '1.1是否存在中央空调6平方外机线或者4平方内机线增项；', value: '0' },
        { name: '1.2水电工程是否包含水电打孔？', value: '1' },
        { name: '1.3空开漏保以及弱电模块是否自理；', value: '2' },
        { name: '1.4是否有厨卫4平方线单独增加费用；', value: '4' },
        { name: '1.5是否有强弱电箱移位或者安装费用？此外若有移位注意进线是否需要另接/更换；', value: '5' }
      ],
      tiler: [  //泥土工程存在增项
        { name: '2.1存在铺贴方式的增项（拼花、斜铺、倒角等）；', value: '0' },
        { name: '2.2存在铺贴辅材胶泥、背胶的增项', value: '1' },
        { name: '2.3存在原始地面找平费用——非实木地板基础找平层或者原始基础不平整；', value: '2' },
        { name: '2.4存在墙地砖铺贴勾缝/填缝增项（注意美缝一般自理）', value: '4' }
      ],
      waterproof: [  //防水工程存在增项
        { name: '3.1阳台防水视情况决定是否需要', value: '0' },
      ],
      carpentry: [  //木作工程存在增项
        { name: '4.1后期视情况决定增减木工板门套基础', value: '0' },
        { name: '4.2封门头另计？', value: '1' }
      ],
      paint: [  //油漆工程存在增项
        { name: '5.1后期根据墙面实际情况决定需要网格布', value: '0' },
        { name: '5.2存在乳胶漆调色费用', value: '1' },
        { name: '5.3腻子工程包含阳角条', value: '2' },
        { name: '5.4有石膏线修补', value: '4' }
      ],
      rest: [  //其他增项
        { name: '6.1全场拆除及外墙饰面铲除自理', value: '0' },
        { name: '6.2有下沉式卫生间回填', value: '1' }
      ]
    }
    this.setData({
      projectId:id,
      cookie: cookie
    })
    wx.request({
      url: utilBox.urlheader + "public/entrysignadditmes/queryByIds",
      data:[id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        var list=res.data.info.list
        // console.log(list)
        if(list.length){
          let carpentry = list[0].carpentry.split('+')
          let hydropower = list[0].hydropower.split('+')
          let paint = list[0].paint.split('+')
          let rest = list[0].rest.split('+')
          let tiler = list[0].tiler.split('+')
          let waterproof = list[0].waterproof.split('+')
          // console.log(carpentry, hydropower, paint, rest, waterproof, tiler)
          for (let k in checkboxItems){
            if (k =='hydropower'){
              for (let i in hydropower){
                for (let j in checkboxItems.hydropower){
                  if (checkboxItems.hydropower[j].name == hydropower[i]){
                    checkboxItems.hydropower[j].checked=true
                  }
                }
              }
            } else if (k == 'tiler'){
              for (let i in tiler) {
                for (let j in checkboxItems.tiler) {
                  if (checkboxItems.tiler[j].name == tiler[i]) {
                    checkboxItems.tiler[j].checked = true
                  }
                }
              }
            } else if (k == 'waterproof') {
              for (let i in waterproof) {
                for (let j in checkboxItems.waterproof) {
                  if (checkboxItems.waterproof[j].name == waterproof[i]) {
                    checkboxItems.waterproof[j].checked = true
                  }
                }
              }
            } else if (k == 'carpentry') {
              for (let i in carpentry) {
                for (let j in checkboxItems.carpentry) {
                  if (checkboxItems.carpentry[j].name == carpentry[i]) {
                    checkboxItems.carpentry[j].checked = true
                  }
                }
              }
            } else if (k == 'paint') {
              for (let i in paint) {
                for (let j in checkboxItems.paint) {
                  if (checkboxItems.paint[j].name == paint[i]) {
                    checkboxItems.paint[j].checked = true
                  }
                }
              }
            } else if (k == 'rest') {
              for (let i in rest) {
                for (let j in checkboxItems.rest) {
                  if (checkboxItems.rest[j].name == rest[i]) {
                    checkboxItems.rest[j].checked = true
                  }
                }
              }
            }
          }
          // console.log(checkboxItems)
          that.setData({
            isSee: false,
            remarks: list[0].remark,
            checkboxItems: checkboxItems
          })
        }else{
          that.setData({
            isSee:true,
            checkboxItems: checkboxItems
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  remarks(e){
    this.setData({
      remarks: e.detail.value
    })
  },
  checkboxChange: function (e) {
    var chk = e.currentTarget.dataset.chk
    var checkboxItems = this.data.checkboxItems
    var checkboxItem = ""
    var values = e.detail.value;
    if (chk == 'hydropower'){
      checkboxItem = checkboxItems.hydropower
    } else if (chk == 'tiler'){
      checkboxItem = checkboxItems.tiler
    } else if (chk == 'waterproof') {
      checkboxItem = checkboxItems.waterproof
    } else if (chk == 'carpentry') {
      checkboxItem = checkboxItems.carpentry
    } else if (chk == 'paint') {
      checkboxItem = checkboxItems.paint
    }else{
      checkboxItem = checkboxItems.rest
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
    if (chk == 'hydropower') {
      checkboxItems.hydropower = checkboxItem
    } else if (chk == 'tiler') {
      checkboxItems.tiler = checkboxItem
    } else if (chk == 'waterproof') {
      checkboxItems.waterproof = checkboxItem
    } else if (chk == 'carpentry') {
      checkboxItems.carpentry = checkboxItem
    } else if (chk == 'paint') {
      checkboxItems.paint = checkboxItem
    } else {
      checkboxItems.rest = checkboxItem
    }
    this.setData({
      checkboxItems: checkboxItems
    });
  },
  showTopTips(){
    var data={}
    data.remark = this.data.remarks
    data.projectId = this.data.projectId
    var checkboxItems = this.data.checkboxItems
    var remarks = this.data.remarks
    for (let k in checkboxItems) {
      var list=""
      for (let i in checkboxItems[k]){
        if (checkboxItems[k][i].checked){
          list += checkboxItems[k][i].name + '+';
        }
      }
      if (k =='hydropower'){
        data.hydropower=list
      } else if (k == 'tiler'){
        data.tiler = list
      } else if (k == 'waterproof') {
        data.waterproof = list
      } else if (k == 'carpentry') {
        data.carpentry = list
      } else if (k == 'paint') {
        data.paint = list
      }else{
        data.rest = list
      }
    }
    // console.log(data)
    let cookie = this.data.cookie
    wx.request({
      url: utilBox.urlheader + "public/entrysignadditmes/insertOne",
      data: data,
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        // console.log(res.data.status)
        if (res.data.status==200){
          wx.navigateBack({ changed: true });//返回上一页
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })

  }
})