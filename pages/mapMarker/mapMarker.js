// map.js
import regeneratorRuntime from '../../utils/regenerator-runtime'
var app = getApp()
var mymap = '';
var lat = '';
var long = '';
Page({
  data: {
    markers: [{
      iconPath: "/image/location.png",
      id: 0,
      latitude: 39.92855,
      longitude: 116.51637,
      width: 50,
      height: 50
    }, {
        iconPath: "/image/location.png",
        id: 1,
        latitude: 39.82855,
        longitude: 116.41637,
        width: 50,
        height: 50
      }],
    latitude:"",
    longitude:""
  },
  //引入数据库
  onLoad: function (option) {
    wx.getLocation({
      type: "gcj02",
      success: async res => {
        var latitude = res.latitude;
        var longitude = res.longitude;
        console.log(res);
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          // markers: [{
          //   latitude: res.latitude,
          //   longitude: res.longitude
          // }]
        })
      }
    })
  },

  //显示对话框
  showModal: function (event) {
    //console.log(event.markerId);
    var i = event.markerId;
    // var url = app.url + 'Api/Api/get_shop_dp_detail&PHPSESSID=' + wx.getStorageSync('PHPSESSID');
    var that = this;
    console.log('====get_detail====')
    // wx.request({
    //   url: url,
    //   data: {
    //     id: i,
    //     openid: wx.getStorageSync('openid')
    //   },
    //   success: function (res) {
    //     console.log(res);
    //     that.setData({
    //       myall: res.data.data
    //     });
    //   }
    // });

    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  opendetail: function (event) {
    console.log('-----跳转商品-----');
    //console.log(event);
    var id = event.currentTarget.dataset.id;
    this.setData({
      id: id
    });
    wx.navigateTo({
      url: "/pages/detail/detail?id=" + id
    }),
      console.log(id);
  },

  calling: function (event) {
    var tel = event.currentTarget.dataset.id.tel;
    this.setData({
      tel: tel
    });
    wx.makePhoneCall({
      phoneNumber: tel,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  }
})