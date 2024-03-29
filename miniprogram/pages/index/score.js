import { errorHandle } from '../../utils/util'
import { scoreParser } from '../../parser'
const jwzx = getApp().globalData.jwzx
import bus from 'iny-bus'
Page({
  _data: {
    value1: 42,
    value2: 1,
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
      if(result.data.indexOf("没有参加评教")!==-1){
        throw new Error("没有参加评教，请登录教务系统点击“教学评价”模块评教后才可查看成绩。")
      }

      this.setData({
        score: scoreParser(result.data)
      })
      
    } catch (e) {
      errorHandle(e)
    }finally{
      wx.hideLoading()
    }

  }
})