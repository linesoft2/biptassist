Page({

  /**
   * 页面的初始数据
   */
  data: {
    md: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    })
    let that = this
    wx.request({
      dataType: "notjson",
      url: options.url,
      success: function (res) {
        that.setData({
          md: res.data
        })

      },
      fail: function () {
        wx.showModal({
          title: "错误",
          content: "加载失败",
          showCancel:false,
          complete: function () {
            wx.navigateBack({
              delta: 0
            })
          }
        })
      },
      complete: function(){
        wx.hideLoading()
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

  }
})