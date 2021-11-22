// pages/me.js
const app = getApp()
const server = app.globalData.server
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wodeheight: wx.getMenuButtonBoundingClientRect().height,
    windowheight: getApp().globalData.windowheight,
    banji: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: "#ededed"
    })
    if (app.globalData.testAccount) {
      this.setData({
        banji: "测试账号"
      })
    } else {
      try{
        // const result = await server.getValue("userInfo")
        // this.setData({
        //   // banji:result.class+"-"+result.name
        //   banji:"计201 - 赵一霖"
        // })
      }catch(e){

      }
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
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1
      })
    }
    wx.setNavigationBarColor({
      backgroundColor: '#000000',
      frontColor: '#ffffff',
    })
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

  }


})