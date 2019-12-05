const Base64 = require('./Base64.js');

require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');
var env = require('../../config.js')


const uploadFile = function(params) {
  if (!params.filePath) {
    wx.showModal({
      title: '图片错误',
      content: '请重试',
      showCancel: false,
    })
    return;
  }
  console.log(params.filePath)
  // const aliyunFileKey = params.dir + params.filePath.replace('wxfile://', ''); //在手机上检测
  // const aliyunFileKey = params.dir + params.filePath.replace('http://', '');  //在开发者工具里检测
  const substring = params.filePath.substring(params.filePath.lastIndexOf(".") + 1)
  const aliyunFileKey = params.dir + new Date().getTime() + Math.floor(Math.random() * 150) + '.' + substring
  console.log(aliyunFileKey)
    // console.log(1)
  const aliyunServerURL = env.config.uploadImageUrl;
  // console.log(2)

  const accessid = env.config.OSSAccessKeyId;
  // console.log(3)
  // 
  const policyBase64 = getPolicyBase64();
  // console.log(4)

  const signature = getSignature(policyBase64);
  // console.log(5)
  wx.uploadFile({
    url: aliyunServerURL,
    filePath: params.filePath,
    name: 'file',
    formData: {
      'key': aliyunFileKey,
      'policy': policyBase64,
      'OSSAccessKeyId': accessid,
      'signature': signature,
      'success_action_status': '200'
    },
    success: function(res) {
      if (res.statusCode != 200) {
        if (params.fail) {
          params.fail(res)
        }
        return;
      }
      if (params.success) {
        return params.success(aliyunFileKey);
      }
    },
    fail: function(err) {
      err.wxaddinfo = aliyunServerURL;
      if (params.fail) {
        params.fail(err)
      }
    },
  })
}

const getPolicyBase64 = function() {
  let date = new Date();
  date.setHours(date.getHours() + env.config.timeout);

  let srcT = date.toISOString();

  const policyText = {
    "expiration": srcT, //设置该Policy的失效时间
    "conditions": [
      ["content-length-range", 0, 5 * 1024 * 1024] // 设置上传文件的大小限制,5mb
    ]
  };
  // console.log(14)

  const policyBase64 = Base64.encode(JSON.stringify(policyText));
  // console.log(15)

  return policyBase64;
}

const getSignature = function(policyBase64) {
  // console.log(3.1)
  // console.log(env)
  const accesskey = env.config.AccessKeySecret;
  // console.log(accesskey)
  // console.log(3.2)

  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  // console.log(3.3)

  const signature = Crypto.util.bytesToBase64(bytes);
  // console.log(3.4)

  return signature;
}

module.exports = uploadFile;