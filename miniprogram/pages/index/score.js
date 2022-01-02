import {
  errorHandle
} from '../../utils/util'
const jwzx = getApp().globalData.jwzx
import bus from 'iny-bus'
Page({
  _data: {
    value1: 41,
    value2: 2,
  },
  data: {
    option1: [{
        text: '2022',
        value: 42
      },
      {
        text: '2021',
        value: 41
      },
      {
        text: '2020',
        value: 40
      },
      {
        text: '2019',
        value: 39
      },
      {
        text: '2018',
        value: 38
      },
      {
        text: '2017',
        value: 37
      },
      {
        text: '2016',
        value: 36
      },
    ],
    option2: [{
        text: '春',
        value: 1
      },
      {
        text: '秋',
        value: 2
      },
    ],
    score:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.eventId = bus.on('score', () => {
      this.getScore()
    })
    this.setData(this._data)
    this.getScore()
  },

  changeValue1(e) {
    this._data.value1 = e.detail
    this.getScore()
  },
  changeValue2(e) {
    this._data.value2 = e.detail
    this.getScore()
  },
  async getScore() {
    wx.showLoading({
      title: '正在加载',
    })
    try {
      await jwzx.request("academic/accessModule.do?moduleId=2070", "GET", {}, "score")
      let result = await jwzx.request("academic/manager/score/studentOwnScore.do", "POST", "year=" + this._data.value1 + "&term=" + this._data.value2 + "&prop=&groupName=&para=0&sortColumn=&Submit=%E6%9F%A5%E8%AF%A2")
      let funResult = await wx.cloud.callFunction({
        name: "main",
        data: {
          fun: "scoreParser",
          html: result.data
        }
      })
      funResult = funResult.result
      if (funResult.code !== 0) {
        throw new Error("云函数错误：" + funResult.msg)
      }
      this.setData({
        score: funResult.data
      })
      
    } catch (e) {
      errorHandle(e)
    }finally{
      wx.hideLoading()
    }

  }
})