// pages/index/time.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qingyuan: "",
    xiaoche:""
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://cdn.linesoft.top/bipt/time/qingyuan.html',
      success: (e) => {
        this.setData(
          {
            qingyuan: e.data
          }
        )
      }
    })
    wx.request({
      url: 'https://cdn.linesoft.top/bipt/time/xiaoche.md',
      success: (e) => {
        this.setData(
          {
            xiaoche: e.data
          }
        )
      }
    })
    wx.request({
      url: 'https://cdn.linesoft.top/bipt/time/hesuan.md',
      success: (e) => {
        this.setData(
          {
            hesuan: e.data
          }
        )
      }
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})