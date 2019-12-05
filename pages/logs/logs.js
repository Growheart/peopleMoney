//logs.js
import regeneratorRuntime from '../../utils/regenerator-runtime'
const util = require('../../utils/util.js')

Page({
  data: {
    latitude: null,
    longitude: null,
    markers: []
  },
  async onLoad() {
    wx.getLocation({
      type: "gcj02",
      success:async res => {
        var latitude = res.latitude;
        var longitude = res.longitude;
        console.log(res);
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            latitude: res.latitude,
            longitude: res.longitude
          }]
        })
        // wx.openLocation({
        //   latitude,
        //   longitude,
        //   scale: 18
        // })
      }
    })
  }
})