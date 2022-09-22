const api = "https://bipt.linesoft.top/api/"
const LoginInvalidError = require("../jwzx.js").LoginInvalidError

function showError(str, back) {
  wx.showModal({
    title: "错误",
    content: str.toString(),
    showCancel: false,
    success() {
      if (back == true) {
        wx.navigateBack()
      }
    }
  })
}

function request(url, data = {}, method = "GET") {

  return new Promise(function (resolve, reject) {
    wx.request({
      data: data,
      url: 'https://bipt.linesoft.top:8080/api/' + url,
      method: method,
      success: function (res) {
        resolve(res.data)
      },
      fail: function (res) {
        reject(res)
      }
    })
  })
}


function getdate(time) {
  var now = new Date(time * 1000),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate();
  return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
}
export function getMidValue(str, firstStr, secondStr) {
  if (str == "" || str == null || str == undefined) { // "",null,undefined
    return "";
  }
  if (str.indexOf(firstStr) < 0) {
    return "";
  }
  var subFirstStr = str.substring(str.indexOf(firstStr) + firstStr.length, str.length);
  var subSecondStr = subFirstStr.substring(0, subFirstStr.indexOf(secondStr));
  return subSecondStr;
}

export function errorHandle(e, back) {
  // console.log(e)

  wx.hideLoading({
    success: (res) => {},
  })
  if (!(e instanceof LoginInvalidError)) {
    console.log(e)
    if (e instanceof Error) {
      showError(e.message,back)
    } else if (e.errMsg) {
      // console.log()
      // console.log(e)
      showError(e.errMsg,back)
    } else {
      // console.log(e)
      showError(JSON.stringify(e),back)
    }

  }
}
module.exports.request = request
module.exports.showError = showError
module.exports.getdate = getdate