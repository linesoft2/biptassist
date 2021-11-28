// pages/captcha.js
const app = getApp()
const server = app.globalData.server
const jwzx = app.globalData.jwzx
const util = require("../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    capAddress: "",
    inputCap: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    try {
      this.setData({
        capAddress: await jwzx.getCaptcha()
      })
    } catch (e) {
      util.showError("获取验证码失败：" + e)
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  changeCap() {
    this.onLoad()
  },
  async submitForm() {
    wx.showLoading({
      title: '正在加载',
      mask: true
    })
    try {
      let result = await server.getValue("jwzx")
      await jwzx.loginUseParam(result.username, result.password, this.data.inputCap)
      wx.showModal({
        title:"提示",
        showCancel:false,
        content:"登录成功，请重新点击一下您要进行的操作",
        complete: ()=>{
          wx.navigateBack()
        }
      })
      
    } catch (e) {
      if (e.message && e.message == "学号或密码错误") {
        jwzx.delParam()
        wx.redirectTo({
          url: "/pages/welcome/welcome1?info=您的密码可能被修改，请重新登录"
        })
        return
      }
      util.showError(e)
    }finally{
      wx.hideLoading({
        success: (res) => {},
      })
    }

  }
})