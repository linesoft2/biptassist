// pages/index/exam.js

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
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {



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
      this.setExam()
    }
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
  async updateExam() {
    wx.showLoading({
      title: '正在加载',
    })
    try {
      let html = await jwzx.request("academic/accessModule.do?moduleId=2030&groupId=", "GET")
      // console.log(html.data)
      let table = html.data.match(/\<table cellpadding="0" cellspacing="0" class="infolist_tab"\>(.*?)<\/table\>/s)
      if (table && table.length == 2) {
        //匹配到了
      } else {
        //没匹配到
        throw new Error("未获取到考试安排表格")
      }
      table = table[0]
      const reg = /<td >(.*?)--/g
      let timeMatch = Array.from(reg[Symbol.matchAll](table))
      for (let index = 0; index < timeMatch.length; index++) {
        timeMatch[index] = timeMatch[index][1]

      }
      const reg1 = /<td  >(.*?)<\/td>/gs
      let numMatch = Array.from(reg1[Symbol.matchAll](table))
      for (let i of numMatch) {
        table = table.replace(i[0], "")
      }
      table = table.replace("<th>课程号</th>", "")
      if (timeMatch && timeMatch.length != 0) {

      } else {
        throw new Error("当前可能没有考试安排")
      }
      // console.log(table)
      table = table.replace(/<td >/g, "<td>")
      // console.log(table)
      exam = {
        timeMatch,
        table,
        updateTime: moment().format("YYYY-MM-DD HH:mm")
      }
      wx.setStorageSync("exam", exam)
      this.setExam()
    } catch (e) {
      errorHandle(e, true)
    }finally{
      
    }

  },
  setExam() {
    wx.showLoading({
      title: '正在加载',
    })
    try{
      let tableReplace = exam.table
      let count = 0
      for (let i of exam.timeMatch) {
        if (moment().isAfter(moment(i))) {
          for (let index = 0; index <= 4; index++) {
            tableReplace = tableReplace.replace("<td>", "<td ><s>").replace("</td>", "</s></td >")
          }
  
        } else {
          count++
        }
      }
  
  
      // console.log(exam.table)
      this.setData({
        html: tableReplace,
        count,
        updateTime: exam.updateTime
      })
    }catch(e){
      errorHandle(e)
    }finally{
      wx.hideLoading()
    }
    
    
  }
})