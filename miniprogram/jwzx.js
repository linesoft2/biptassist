
const url = "https://jwzx.bipt.edu.cn/"
let wxp = {}
class LoginInvalidError extends Error {
  constructor(message) {
    super(message)
    this.name = "loginInvalidError"
  }
}
class Jwzx {
  constructor(server1, wxp1) {
    this.cookie = undefined
    this.server = server1
    wxp = wxp1
  }

  //必须先调用获取验证码,返回验证码的临时路径,并将cookie存进对象

  async getCaptcha() {
    let result = await wxp.downloadFile({
      url: url + "academic/getCaptcha.do",
    })
    this.cookie = result.cookies[0].split(';')[0]+';'
    return result.tempFilePath
  }
  async request(url1, method, data = {}, event, getData) {
    const proxy = false
    let result
    if (proxy) {
      if (typeof data !== "string") {
        data = JSON.stringify(data)
      }
      let timeStamp = (Date.parse(new Date()) / 1000).toString()
      let addr
      if (getData === true) {
        addr = url + url1 + data
      } else {
        addr = url + url1
      }

      let md5 = require('md5')
      result = await wxp.request({
        url: "https://biptproxy.linesoft.top/main",
        method: "POST",
        data: {
          addr,
          method: method,
          body: data,
          timeStamp,
          sign: md5('jwzxproxy00Zl' + addr + timeStamp),
          cookie: this.cookie
        }
      })
    }else{
      try {
        result = await wxp.request({
          url: url + url1,
          data: data,
          header: {
            "Cookie": this.cookie,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: method,
          dataType: "notjson",
          responseType: "arraybuffer",
          timeout: 5000
        })
      } catch (e) {
        if (e.errMsg.indexOf('timeout') !== -1 || e.errMsg.indexOf('time out') !== -1) {
          throw new Error('本功能需要连接到学校内网（Wi-Fi：“bipt”/宿舍网口等）使用')
        } else {
          throw e
        }
      }
      const { Buffer } = require("buffer");
      var iconv = require("iconv-lite");
      if (result.header["Content-Type"].indexOf("UTF-8") == -1) {
        result.data = iconv.decode(Buffer.from(result.data), 'GBK');
      } else {
        result.data = iconv.decode(Buffer.from(result.data), 'UTF-8');
      }
    }


    if (typeof result.data !== "string") {
      result.data = result.data.toString()
    }
    if (result.data.indexOf("##Error##") !== -1) {
      throw new Error("BIPTProxy：" + result.data)
    }
    if (result.cookies[0] && result.cookies[0].indexOf("JSESSIONID") != -1) {
      this.cookie = result.cookies[0]
    }
    // console.log(result)

    if (result.data.indexOf("login_sub1.gif") != -1 || result.data.indexOf("用户登录:") != -1 || result.data.indexOf("优慕课在线教育技术支持") != -1) {
      //登录态失效，跳到登录页
      if (event) {
        wx.navigateTo({
          url: '/pages/welcome/welcome1?event=' + event,
        })
      } else {
        wx.navigateTo({
          url: '/pages/welcome/welcome1',
        })
      }

      throw new LoginInvalidError("登录态失效")
    }
    return result
  }
  async checkCaptcha(captcha) {
    let result = await this.request("academic/checkCaptcha.do", "GET", {
      captchaCode: captcha
    }, undefined, true)
    return result.data === "false" ? false : true;
  }
  async loginUseParam(schoolID, passwd, captcha) {
    let result = await this.checkCaptcha(captcha)
    if (result == false) {
      throw new Error("验证码错误")
    }
    const {rc4Base64Encrypt} = require('npm-rc4')
    result = await wxp.request({
      url: 'https://biptproxy2.linesoft.top:8080/login',
      method:"POST",
      data:{
        username:schoolID,
        password:rc4Base64Encrypt(passwd,'V300Zljwzx'),
        captcha,
        cookie: this.cookie
      }
    })
    
    if (result.data.code === 0) {
      //登录成功
      this.cookie = result.data.data
    } else {
      throw new Error(result.data.msg)
    }
  }

  async haveParam() {
    console.Error("函数弃用")
    // return await this.server.haveValue("jwzx")
  }
  async delParam() {

    // return await this.server.delValue("jwzx")
  }
  async setParam(username, password) {
    console.Error("函数弃用")
    // return await this.server.setValue("jwzx", {
    //   username,
    //   password
    // })
  }
}
module.exports.LoginInvalidError = LoginInvalidError
module.exports.Jwzx = Jwzx