//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  onLoad () {
   wx.request({
     url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit',
     data: { "access_token":"f0528cb424ad115c7867bafbe82ad4da92ff6bd8"},
     success: function (res) {
       console.log(res)
     },
     fail: function (res)  {
       return reject(res);
     }
   }) 
  },
  getpeople(){
    wx.navigateTo({
      url: '/pages/shopcart/shopcart',
    })
  }
})
