const api = "https://bipt.linesoft.top/api/"
let wxp = {}
class Server {
  constructor(wxp1) {
    this.session = undefined
    wxp = wxp1
  }
  async request(data, havevalue = false) {
    if (typeof data !== 'object') throw new Error("data数据类型错误")
    if (data.mod != "init") {
      if (!this.session) {
        await this.init()
        return await this.request(data, havevalue)
      }
    }
    if (this.session) {
      data = {
        ...data,
        session: this.session
      }
    }
    let result = await wxp.request({
      url: api,
      data,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      dataType: "json",
      method: "POST",
      timeout: 5000
    })
    let errCode = 0
    errCode = result.data.errcode
    if (isNaN(errCode)) errCode = 0
    if (errCode != 0) {
      if (parseInt(errCode) == -3) {
        await this.init()
        return await this.request(data, havevalue)
      }
      if (havevalue == true) {
        if(parseInt(errCode) == -10 || parseInt(errCode) == -20)
        return false
      }
      throw new Error("服务器返回错误：" + errCode + "，调用的api：" + data.mod)
    } else {
      // console.log(havevalue)
      if (havevalue == true) {
        return true
      } else {
        return result.data
      }

    }

  }
  async init() {
    let code = (await wxp.login({
      timeout: 5000,
    })).code
    let data = {
      mod: "init",
      code: code
    }
    let result = await this.request(data)
    this.session = result.session
  }
  async setValue(key, value) {
    let result = await this.request({
      mod: "setValue",
      value: JSON.stringify({
        key,
        value
      })
    })
    return result
  }
  async getValue(key) {
    let result = await this.request({
      mod: "getValue",
      value: JSON.stringify({
        key,
      })
    })
    return result.data.value
  }
  async haveValue(key) {
    let result = await this.request({
      mod: "getValue",
      value: JSON.stringify({
        key,
      })
    }, true)
    return result
  }
  async delValue(key) {
    let result = await this.request({
      mod: "delValue",
      value: JSON.stringify({
        key,
      })
    })
    return result
  }
}
module.exports.Server = Server