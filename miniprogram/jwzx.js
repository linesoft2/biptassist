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
    this.cookie = result.cookies[0]
    return result.tempFilePath
  }
  async request(url1, method, data = {}) {
    let result = await wxp.request({
      url: url + url1,
      data: data,
      header: {
        "cookie": this.cookie,
        "content-type": "application/x-www-form-urlencoded"
      },
      method: method,
      dataType: "notjson",
      responseType: "arraybuffer"
    })
    const {
      Buffer
    } = require("buffer");
    var iconv = require("iconv-lite");
    if(result.header["Content-Type"].indexOf("UTF-8") ==-1){
      result.data = iconv.decode(Buffer.from(result.data), 'GBK');
    }else{
      result.data = iconv.decode(Buffer.from(result.data), 'UTF-8');
    }
    // console.log(result)
    if (result.cookies[0] && result.cookies[0].substring("JSESSIONID") != -1) {
      this.cookie = result.cookies[0]
    }
    if (result.data.indexOf("login_sub1.gif") != -1 || result.data.indexOf("error_black") != -1) {
      //登录态失效，跳到登录页
      wx.navigateTo({
        url: '/pages/welcome/welcome1',
      })
      throw new LoginInvalidError("登录态失效")
    }
    return result
  }
  async checkCaptcha(captcha) {
    let result = await this.request("academic/checkCaptcha.do", "GET", {
      captchaCode: captcha
    })
    // console.log(result)
    return result.data === "false" ? false : true;
  }
  async loginUseParam(schoolID, passwd, captcha) {
    let result = await this.checkCaptcha(captcha)
    if (result == false) {
      throw new Error("验证码错误")
    }
    result = await wxp.request({
      url: "https://bipt.linesoft.top/api/loginJwzx.php",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        cookie: this.cookie,
        username: schoolID,
        password: passwd,
        captcha
      },
      method: "POST",
      dataType: "notjson"
    })
    // console.log(result.data)
    this.cookie = result.data
    if (result.data.indexOf("JSESSIONID") != -1) {
      //有Cookie，登录成功
      // let result = await this.request("/academic/showPersonalInfo.do", "GET")
      // let reg = /\<td\>(.*?)\&nbsp\;/g
      // let arr = Array.from(reg[Symbol.matchAll](result.data))
      // let setdata = {}
      // for (let index = 0; index < arr.length; index++) {
      //   const arr1 = arr[index];
      //   switch (index) {
      //     case 1:
      //       setdata.name = arr1[1]
      //       break
      //     case 2:
      //       setdata.institute = arr1[1]
      //       break
      //     case 3:
      //       setdata.major = arr1[1]
      //       break
      //     case 6:
      //       setdata.class = arr1[1]
      //       break

      //   }

      // }
      // await this.server.setValue("userInfo", {
      //   ...setdata
      // })
    } else {
      throw new Error("学号或密码错误")
    }

    // await this.setParam(schoolID, passwd)
  }
  loginAuto() {

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

  async 
}
module.exports.LoginInvalidError = LoginInvalidError
module.exports.Jwzx = Jwzx