import bus from 'iny-bus'
// pages/welcome/welcome1.js

const app = getApp()
const server = app.globalData.server
const jwzx = app.globalData.jwzx
const util = require("../../utils/util.js")
let canSubmit = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowheight: app.globalData.windowheight,
    btn_load: false,
    cap:"",
    id:"",
    pwd:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if(options){
      this.event = options.event
    }
    const data = wx.getStorageSync('jwzx')
    if(data){
      this.setData(
        {
          id:data.username,
          pwd: data.password,
          checked:true
        }
      )
    }
    if (options && options.info) {
      wx.showModal({
        title: '提示',
        content: options.info,
        showCancel:false
      })
    }
    try {
      this.setData({
        capAddress: await jwzx.getCaptcha()
      })
    } catch (e) {
      util.showError("获取验证码失败：" + e)
    }

  },
  changeCap() {
    // console.log("test")
    this.onLoad()
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
    this.onLoad()
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

  submit: async function (res) {
    // if (!this.data.checked) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请阅读并同意相关条款',
    //     showCancel: false
    //   })
    //   return
    // }
    if (canSubmit == false) return
    canSubmit = false
    // console.log(res)
    this.setData({
      btn_load: true
    })
    let value = res.detail.value
    try {
      await jwzx.loginUseParam(value.username, value.jwzx_pwd, value.captcha)
        if(this.data.checked){
          wx.setStorageSync('jwzx', {
            username:value.username,
            password:value.jwzx_pwd
          })
        }else{
          wx.removeStorageSync('jwzx')
        }
        wx.navigateBack({
          success:()=>{
            if(this.event){
              bus.emit(this.event)
            }
          }
        })
        
        
      
    } catch (e) {
      if (e.message && e.message == "学号或密码错误") {
        this.onLoad()
        this.setData({
          cap:""
        })
      }
      util.showError(e)
    } finally {
      this.setData({
        btn_load: false
      })
      canSubmit = true
    }
  },
  clickTbsm() {
    wx.navigateTo({
      url: '/pages/me/richtext?url=https://cdn.linesoft.top/bipt/tbsm.md',
    })
    
  },
  clickMzsm(){
    wx.navigateTo({
      url: '/pages/me/richtext?url=https://cdn.linesoft.top/bipt/mzsm.md',
    })
  }
})