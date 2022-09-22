// pages/index/exam.js
import bus from 'iny-bus'
import { examParser } from '../../parser'
let exam = wx.getStorageSync("exam")
const jwzx = getApp().globalData.jwzx
const moment = require('../../moment.js');
import {
  errorHandle
} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagStyle: {
      table: 'box-sizing: border-box; border-top: 1px solid #dfe2e5; border-left: 1px solid #dfe2e5;',
      th: 'border-right: 1px solid #dfe2e5; border-bottom: 1px solid #dfe2e5;',
      td: 'border-right: 1px solid #dfe2e5; border-bottom: 1px solid #dfe2e5;',
      li: 'margin: 5px 0;'
    },
    examData: []

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.eventId = bus.on('exam', () => {
      this.updateExam()
    })
    if (!exam) {
      wx.showModal({
        title: "提示",
        content: "当前设备还没有考试数据，立即导入？",
        success: (res) => {
          if (res.confirm) {
            this.updateExam()

          } else if (res.cancel) {

            wx.navigateBack()
          }
        }
      })
    } else {
      if (exam.ver !== 2) {
        this.updateExam(true)
      } else {
        this.setExam()
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
  async updateExam(fromStorage) {
    wx.showLoading({
      title: '正在加载',
    })
    try {
      let table
      if (fromStorage === true) {
        table = exam.table
      } else {
        let html = await jwzx.request("academic/accessModule.do?moduleId=2030&groupId=", "GET", {}, "exam")
        // console.log(html.data)
        table = html.data.match(/\<table cellpadding="0" cellspacing="0" class="infolist_tab"\>(.*?)<\/table\>/s)
        if (table && table.length == 2) {
          //匹配到了
        } else {
          //没匹配到
          throw new Error("未获取到考试安排表格")
        }
        table = table[0]
      }
      const result = examParser({
        html: table,
        fromOld: fromStorage === true ? true : false
      })
      if (result.length === 0) {
        throw new Error("当前可能没有考试安排")
      }
      const oldTime = exam.updateTime
      exam = {
        data: result,
        ver: 2
      }

      if (fromStorage === true) {
        exam.updateTime = oldTime
      } else {
        exam.updateTime = moment().format("YYYY-MM-DD HH:mm")
      }
      wx.setStorageSync("exam", exam)
      this.setExam()
    } catch (e) {
      errorHandle(e, true)
    } finally {
      wx.hideLoading()
    }

  },
  setExam() {
    let count = 0

    for (let i = 0; i < exam.data.length; i++) {
      let date = moment(exam.data[i].time.substring(0, 16))
      let now = moment()
      // now.set('day', 25);
      if (now.isAfter(date)) {
        exam.data[i].countDown = "已考完"
      } else {
        count++
        exam.data[i].countDown = "还有" + date.diff(now, 'days') + "天"
      }
    }
    this.setData({
      exam: exam,
      count
    })


  }
})