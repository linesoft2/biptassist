// pages/index/kcb.js
const app = getApp()
const kcbpaerser = app.globalData.kcbpaerser
// let load = false
import {
  errorHandle
} from '../../utils/util'
Page({
  load: false,
  /**
   * 页面的初始数据
   */
  data: {
    xingqiList: [],
    range: [],
    choose:0,
    showOverlay:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let range = []
    for (let i = 1; i <= 17; i++) {
      range.push("第" + i + "周")
    }
    this.setData({
      range
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

    // let kcbJson = wx.getStorageSync("kcb")
    if (!kcbpaerser.checkStorage()) {
      wx.showModal({
        title: "提示",
        content: "当前设备还没有课程表数据，立即导入？",
        success: (res) => {
          if (res.confirm) {
            this.updateKcb()

          } else if (res.cancel) {
            wx.navigateBack()
          }
        }
      })
    } else {
      if(!wx.getStorageSync("hidden_overlay")){
        this.setData({
          showOverlay:true
        })
      }
      this.setkcb()

    }



    // wx.showModal({
    //   title: '提示',
    //   showCancel: false,
    //   content: "当前功能暂未开放",
    //   complete: function(){
    //     wx.navigateBack({
    //       delta: 0,
    //     })
    //   }
    // })
  },


  setkcb(week) {
    if (this.load == true) {
      return
    }
    this.load = true
    wx.showLoading({
      title: '正在加载',
    })
    const query = wx.createSelectorQuery()
    query.select(".jieci").fields({
      size: true
    }).select(".fengexian").fields({
      size: true
    }).select(".wuxiu").fields({
      size: true
    }).exec(async res => {
      try {
        this.setData({
          xingqiList: await kcbpaerser.getThisWeek(res[0].height, res[1].height, res[2].height,week),
          week: week ? week : kcbpaerser.getWeekNum(),
          updateTime: kcbpaerser.allweek.updateTime ? kcbpaerser.allweek.updateTime : "未知"
        })
        this.setData({
          choose:this.data.week-1
        })

        // throw new Error("test")
      } catch (e) {
        errorHandle(e, true)
      } finally {
        wx.hideLoading({
          success: (res) => {},
        })
      }

    })
  },
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
  async updateKcb() {
    try {
      wx.showLoading({
        title: '正在加载',
      })
      await kcbpaerser.getNewAllWeek()
      this.load = false
      this.setkcb()
      wx.hideLoading()
      wx.showModal({
        title: "提示",
        content: "导入完成",
        showCancel: false
      })
    } catch (e) {
      errorHandle(e)
    }
  },
  changeWeek() {
    // wx.showToast({
    //   title: '切换周数功能还未完成，敬请期待',
    //   icon:"none"
    // })

  },
  pickerChange(event) {
    let selectWeek =Number(event.detail.value)  + 1
    this.load = false
    this.setkcb(selectWeek)
  },
  clickKnow(){
    wx.setStorageSync('hidden_overlay', true)
    this.setData({
      showOverlay : false
    })
    
  }

})