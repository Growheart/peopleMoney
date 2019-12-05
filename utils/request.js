import {
  config
} from '../config.js'
import {
  aes
} from './aes.js'

class HTTP {
  whiteApi = [

  ];
  //封装加密
  Encrypt(word) {
    var encrypted = aes.CryptoJS.AES.encrypt(word, key, {
      mode: aes.CryptoJS.mode.ECB,
      padding: aes.CryptoJS.pad.Pkcs7
    });
    return encrypted.ciphertext.toString();
  };
  //封装解密
  Decrypt(word) {
    var encryptedHexStr = aes.CryptoJS.format.Hex.parse(word);
    var decrypt = aes.CryptoJS.AES.decrypt(encryptedHexStr, key, {
      mode: aes.CryptoJS.mode.ECB,
      padding: aes.CryptoJS.pad.Pkcs7
    });
    return aes.CryptoJS.enc.Utf8.stringify(decrypt);
  }

  request({ url, method = 'GET', data = {} }) {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('access_token');
      const isWhiteApi = this.whiteApi.includes(url);
      let dataPramas;
      if (!isWhiteApi) {
        if (token) {
          dataPramas = { ...data,
            access_token: token
          }
        } else {
          return this._errPage()
        }
      } else {
        dataPramas = data
      }
      dataPramas = this._delNullVal(dataPramas)
      // Encrypt(JSON.stringify(dataPramas))
      wx.request({
        url: config.api_base_url + url,
        data: dataPramas,
        header: {
          'X-Requested-With': 'XMLHttpRequest',
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        method: method,
        success: (res) => {
          if (Number(res.data.code) === 808) {
            this._errPage()
          } else if (Number(res.data.code) === 200) {
            // JSON.parse(Decrypt(res))
            return resolve(res);
          } else {
            wx.showToast({
              title: res.data.msg ? res.data.msg : '加载失败',
              icon: 'none'
            })
          }
        },
        fail: (res) => {
          return reject(res);
        }
      })
    })
  }

  validatePhone(number) {
    const reg = /^1[3|4|5|7|8][0-9]{9}$|^0\d{2,3}-?\d{7,8}$/
    return reg.test(number)
  }

  _errPage() {
    wx.showModal({
      title: '提示',
      content: '请先登陆或登陆已过期',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
  }

  _delNullVal(obj) {
    for (let item in obj) {
      if (obj[item] === null || obj[item] === undefined) {
        delete obj[item]
      }
    }
    return obj;
  }
}

export {
  HTTP
}