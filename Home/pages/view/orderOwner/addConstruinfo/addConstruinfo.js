var utilBox = require("../../../../utils/utilBox.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectId: '',
    cookie: '',
    orderInfo: '',
    decoration:'',
    duration:'',
    // 装修方式
    countryCodes: ["清包", "半包", "全包","半包+主材"],
    renovationIndex:0,
    huxing:'',
    pmname:'',
    pmphone:'',
    workerArr: [],
    // 计价方式
    typelist_price: ["按小时算","按天算"],
    priceIndex:0,
    // 工种
    typelist_worker: ["油漆工", "水电工", "泥工","木工"],
    workerIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    var id = options.projectId;
    var that = this;
    let userInfo = wx.getStorageSync("userInfo");
    let reg = /[\W\w]*(JSESSIONID\=[\w\d\-]*)[\W\w]*/;
    let arr = reg.exec(userInfo.adminPassword);
    let cookie = RegExp.$1;
    this.setData({
      projectId: id,
      cookie: cookie
    })
    wx.request({
      url: utilBox.urlheader + "/product/ProjectEstablish/queryMap", //查询项目信息
      data: [id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        res.data.info[0].acreage = parseInt(res.data.info[0].acreage)
        wx.setStorageSync('pqOrderInfo', res.data.info[0])
        that.setData({
          orderInfo: res.data.info[0]
        })
        that.setData({
          decoration: that.data.orderInfo.decoration == null ? '' : that.data.orderInfo.decoration,
          duration: that.data.orderInfo.duration == null ? '' : that.data.orderInfo.duration,
          huxing: that.data.orderInfo.decorate == null ? '' : that.data.orderInfo.decorate,
          pmname: that.data.orderInfo.pmname == null ? '' : that.data.orderInfo.pmname,
          pmphone: that.data.orderInfo.pmphone == null ? '' : that.data.orderInfo.pmphone,
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
    wx.request({
      url: utilBox.urlheader + "product/worker/queryMapByProjectIds", //根据项目id查询工人信息
      data: [id],
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
       // wx.setStorageSync('pqOrderInfo', res.data.info)
        let worker = res.data.info
          console.log(res.data.info)
        that.setData({
          workerArr: worker
        })
        console.log(that.data.workerArr)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  decorationInput: function (e) {
    this.data.decoration = e.detail.value;
  },
  durationInput: function (e) {
    this.data.duration = e.detail.value;
  },
  bindPickerChange: function (e) {
    var list = e.detail.value
    var countryCodes = this.data.countryCodes
    this.setData({
      huxing: countryCodes[e.detail.value]
    })
  },
  pmnameInput:function(e){
    this.data.pmname = e.detail.value;
  },
  pmphoneInput: function (e) {
    // this.data.pmphone = e.detail.value;
  },
  pmphoneInputAuth:function(e){
    console.log(e.detail.value)
    if (utilBox.isPhone(e.detail.value)){
      this.data.pmphone = e.detail.value;
    }else{
      wx.showToast({
        title: '手机号码错误',
        image: '../../../images/fail.png',  //自定义图标的本地路径，image 的优先级高于 icon
        duration: 3000, //提示的延迟时间，单位毫秒，默认：1500
        mask: false,  //是否显示透明蒙层，防止触摸穿透，默认：false
        success: function () { }, //接口调用成功的回调函数
        fail: function () { },  //接口调用失败的回调函数
        complete: function () { } //接口调用结束的回调函数
      });
    }
  },
  addWorker(){
      var obj = {
        "name": "",
        "phone": "",
        "manpower": 0,
        "pricing": "按小时算",
        "profession": "油漆工",
        "projectId": this.data.projectId
      }
    let newArr = this.data.workerArr;
     newArr.push(obj);
      this.setData({
        workerArr: newArr
      })
     // worker.push(obj)
  },
  delWorker(e){    //删除某个工人
    var that = this
    console.log(e.currentTarget.dataset.ind) 
    let ind = e.currentTarget.dataset.ind   //下标
    let workerList= this.data.workerArr
    if (workerList[ind].name || workerList[ind].name){   //有工人信息 删除
      wx.showModal({
        title: '提示',
        content: '是否删除此工人',
        success: function (res) {
          if (res.confirm) {
            workerList.splice(ind, 1)
            that.setData({
              workerArr: workerList
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else { //没有工人信息 删除
      workerList.splice(ind, 1)
      this.setData({
        workerArr: workerList
      })
    }
    
  },
  nameInput: function (e) {
  //  console.log(e.currentTarget.dataset.nameindex)//下标
   // console.log(e.detail.value)//值
    let arr = this.data.workerArr
    arr[e.currentTarget.dataset.nameindex].name = e.detail.value
    this.setData({
      workerArr: arr
    })
  },
  phoneInput: function (e) {
    // let arr = this.data.workerArr
    // arr[e.currentTarget.dataset.phoneindex].phone = e.detail.value
    // this.setData({
    //   workerArr: arr
    // })
  },
  phoneInputAuth:function(e){
    console.log(e.detail.value)
    if (utilBox.isPhone(e.detail.value)) {
      let arr = this.data.workerArr
      arr[e.currentTarget.dataset.phoneindex].phone = e.detail.value
      this.setData({
        workerArr: arr
      })
    } else {
      wx.showToast({
        title: '手机号码错误',
        image: '../../../images/fail.png',  //自定义图标的本地路径，image 的优先级高于 icon
        duration: 3000, //提示的延迟时间，单位毫秒，默认：1500
        mask: false,  //是否显示透明蒙层，防止触摸穿透，默认：false
        success: function () { }, //接口调用成功的回调函数
        fail: function () { },  //接口调用失败的回调函数
        complete: function () { } //接口调用结束的回调函数
      });
    }
  },
  durationInputAuth(e){ //
    if (utilBox.isNumber(e.detail.value)) {
      this.data.duration = e.detail.value;
    }else{
      wx.showToast({
        title: '工期必须为数字',
        icon: 'none',  //自定义图标的本地路径，image 的优先级高于 icon
        duration: 3000, //提示的延迟时间，单位毫秒，默认：1500
        mask: false,  //是否显示透明蒙层，防止触摸穿透，默认：false
      });
    }
  },
  manpowerInput: function (e) {
    let arr = this.data.workerArr
    arr[e.currentTarget.dataset.manpowerindex].manpower = e.detail.value
    this.setData({
      workerArr: arr
    })
  },
  pricingChange: function (e) {
    console.log(e.currentTarget.dataset.pricingindex)//下标
    console.log(e.detail.value)//值
    var typelist_price = this.data.typelist_price
    let arr = this.data.workerArr
    arr[e.currentTarget.dataset.pricingindex].pricing = typelist_price[e.detail.value]
    this.setData({
      workerArr: arr
    })
  },
  professionChange: function (e) {
    console.log(e.currentTarget.dataset.professionindex)//下标
    console.log(e.detail.value)//值
    var typelist_worker = this.data.typelist_worker
    let arr = this.data.workerArr
    arr[e.currentTarget.dataset.professionindex].profession = typelist_worker[e.detail.value]
    this.setData({
      workerArr: arr
    })
  },
  sureAddConstructionInfo(){
    var that = this;
    //需要保存的项目信息
    var datas = {
      id: this.data.projectId,
      decorate: this.data.huxing,
      duration: this.data.duration,
      decoration: this.data.decoration,
      pmname: this.data.pmname,
      pmphone: this.data.pmphone
    }
    //需要保存的工人信息
    var workerData = this.data.workerArr
    var arrData=[]
    for (let i in workerData){
      if (workerData[i].name != "" && workerData[i].phone !=""){
        arrData.push(workerData[i])
      }
    }
    

    let cookie = this.data.cookie

    //保存项目信息
    wx.request({
      url: utilBox.urlheader + "/product/ProjectEstablish/update",
      data: datas,
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        if (res.status == 200) {
          wx.showToast({
            title: "添加成功",
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
    //保存工人信息
    wx.request({
      url: utilBox.urlheader + "product/worker/insert",
      data: arrData,
      header: {
        'content-type': 'application/json', // 默认值
        cookie: cookie
      },
      method: 'post',
      success: function (res) {
        if (res.status == 200) {
          wx.showToast({
            title: "添加成功",
          })
        }
        wx.setStorageSync('addDesignerId', that.data.projectId)
        wx.navigateBack({
          url: '../supervisionDetails/details',
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})