// components/qianming/index.js
var uploadImage = require('../../utils/upload/uploadAliyun.js');
import regeneratorRuntime from '../../utils/regenerator-runtime'
// canvas 全局配置
var context = null;// 使用 wx.createContext 获取绘图上下文 context
var isButtonDown = false;
var arrx = [];
var arry = [];
var arrz = [];
var canvasw = 0;
var canvash = 0;
//获取系统信息
wx.getSystemInfo({
  success: function (res) {
    canvasw = res.windowWidth;//设备宽度
    // canvash = res.windowWidth * 7 / 15;
    canvash = res.windowHeight
  }
});
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    src: ""
  },
  ready(){
    // 使用 wx.createContext 获取绘图上下文 context
    context = wx.createCanvasContext('canvas', this);
    context.beginPath()
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    console.log("3")
  },
  /**
   * 组件的方法列表
   */
  methods: {
    canvasIdErrorCallback: function (e) {
      console.error(e.detail.errMsg)
    },
    //开始
    canvasStart: function (event) {
      isButtonDown = true;
      arrz.push(0);
      arrx.push(event.changedTouches[0].x);
      arry.push(event.changedTouches[0].y);
      //context.moveTo(event.changedTouches[0].x, event.changedTouches[0].y);
    },
    //过程
    canvasMove: function (event) {
      if (isButtonDown) {
        arrz.push(1);
        arrx.push(event.changedTouches[0].x);
        arry.push(event.changedTouches[0].y);
        // context.lineTo(event.changedTouches[0].x, event.changedTouches[0].y);
        // context.stroke();
        // context.draw()
      };
      for (var i = 0; i < arrx.length; i++) {
        if (arrz[i] == 0) {
          context.moveTo(arrx[i], arry[i])
        } else {
          context.lineTo(arrx[i], arry[i])
        };

      };
      context.clearRect(0, 0, canvasw, canvash);

      context.setStrokeStyle('#000000');
      context.setLineWidth(4);
      context.setLineCap('round');
      context.setLineJoin('round');
      context.stroke();

      context.draw(false);
    },
    canvasEnd: function (event) {
      isButtonDown = false;
    },
    cleardraw: function () {
      //清除画布
      arrx = [];
      arry = [];
      arrz = [];
      context.clearRect(0, 0, canvasw, canvash);
      context.draw(true);
    },
    //导出图片
    getimg() {
      console.log('tupian')
      if (arrx.length == 0) {
        wx.showModal({
          title: '提示',
          content: '签名内容不能为空！',
          showCancel: false
        });
        return false;
      }
      //生成图片
      wx.canvasToTempFilePath({
        canvasId: 'canvas',
        success: function (res) {
          console.log(res.tempFilePath);
          //存入服务器
          wx.showToast({
            icon: "loading",
            title: "正在上传"
          }),
          uploadImage({
            filePath: res.tempFilePath,
            dir: "uploads/20190830/",
            success: (res) => {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000//持续的时间
              })
              console.log(res)
              let img = "https://jx360.oss-cn-beijing.aliyuncs.com/" + res
              // this.upLoadImg(img, res)
            },
            fail: (res) => {
              console.log("上传失败")
              console.log(res)
            }
          })
        },
        fail: (res) => {
          console.log(res);
        }
      }, this)

    },
  }
})
