// pages/index/xyk.js
const app = getApp()
const server = app.globalData.server
const util = require("../../utils/util.js")
let page = 1
async function getBill(that) {
  try {
    let result = await server.request("user/getBill", {
      page: page,
      num: 20
    })
    let arr = result.bill
    if (arr.length == 0) that.setData({
      xianshigengduo: false
    })
    // console.log(arr)
    for (let i = 0; i < arr.length; i++) {
      arr[i].time = util.getdate(parseInt(arr[i].time))
    }
    that.setData({
      list: that.data.list.concat(arr)
    })
    page = page + 1
  } catch (e) {
    util.showError("加载消费记录失败：" + e)
  }


}

async function refresh(that) {
  if (app.globalData.testAccount) {
    that.setData({
      yue: "38.88"
    })
    
  } else {
    try {
      let result = await server.request("user/getLastSetBalance")
      if (result.time == 0) {
        that.setData({
          yue: "未设置"
        })
        if (!wx.getStorageSync('notShowFirstInputSet')) {
          wx.setStorageSync('notShowFirstInputSet', true)
          wx.showModal({
            cancelText: '我不知道',
            confirmText: '立即设置',
            content: '您还未设置校园卡余额，请立即设置',
            showCancel: true,
            title: '余额设置提示',
            success: (result) => {
              if (result.confirm) {
                that.setData({
                  showInput: true
                })
              } else {
                wx.showModal({
                  title: "提示",
                  content: "若您不知道校园卡余额，可到刷卡处查询，再点击本页面的余额设置按钮重新设置",
                  showCancel: false
                })
              }
            }
          })
        }
      } else {

        let result = await server.request("user/getCardBalance")
        that.setData({
          yue: result.balance
        })
      }
    } catch (e) {
      util.showError("读取余额失败：" + e)
    }
    page = 1
    that.setData({
      list: []
    })
    getBill(that)
  }



}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    xianshigengduo: true,
    yue: "加载中",
    showInput: false,
    inputValue: ""


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {





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
    refresh(this)

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
    getBill(this)
  },
  
  clickYuexiuzheng: function () {
    if (app.globalData.testAccount) {
      util.showError("测试用户无法自定义余额")
    }else{this.setData({
      showInput: true
    })}
    
  },
  onInputConfirm: async function () {
    wx.showLoading({
      title: '正在设置',
    })
    try {
      let that = this
      await server.request("user/setCardBalance", {
        balance: that.data.inputValue
      })
      wx.hideLoading()
      wx.showToast({
        title: '余额设置成功！',
      })
      refresh(that)
    } catch (e) {
      wx.hideLoading()
      util.showError("设置余额错误：" + e)
    } finally {

    }

  }
})