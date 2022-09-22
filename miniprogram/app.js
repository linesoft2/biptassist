//app.js
const utils = require("./utils/util.js")
import { promisifyAll } from 'miniprogram-api-promise';
import { Kcbpaerser } from './kcbparser'


App({
  globalData: {
    windowheight: 10,
    mainHeight: 900,
    server: undefined,
    jwzx: undefined,
    kcbpaerser: undefined,
    canRefresh: false,
    testAccount: false,
    wxp: {},
    loginFun: {}
  },
  onLaunch: function () {
    wx.cloud.init()
    const sysInfo = wx.getSystemInfoSync()
    this.globalData.windowheight = sysInfo.statusBarHeight - wx.getMenuButtonBoundingClientRect().height
    this.globalData.mainHeight = sysInfo.safeArea.height
    promisifyAll(wx, this.globalData.wxp)
    let server = require("./server.js").Server
    server = new server(this.globalData.wxp)
    this.globalData.server = server
    let jwzx = require("./jwzx.js").Jwzx
    jwzx = new jwzx(server, this.globalData.wxp)
    this.globalData.jwzx = jwzx
    this.globalData.kcbpaerser = new Kcbpaerser(this.globalData.wxp, jwzx)


    // server.init()
    // server.request({mod:"getValue",value:"test"})
    // server.haveValue("test").then(res => {
    //   console.log(res)
    // })
    return
    //登录自有后端
    var that = this
    wx.login({
      success: async function (res) {
        try {
          let result = await server.request("init", {
            code: res.code
          }, "GET", true)

          server.session = result.session

          // server.checkBindAndJump()
          if (that.indexRefresh) await that.indexRefresh()
          that.globalData.canRefresh = true
          wx.hideLoading()
          //测试某个页面
          // wx.navigateTo({
          //   url: '/pages/index/xyk',
          // })
        } catch (e) {
          // console.log(e)
          wx.hideLoading()
          utils.showError("初始化失败，请重新进入小程序再试，原因：" + e)
        }

      },
      fail: function (res) {
        wx.hideLoading()
        utils.showError("wx.login失败，请重新进入小程序再试" + res)
      }
    })
  }

})