//index.js
//获取应用实例
const app = getApp()
const server = app.globalData.server
const jwzx = app.globalData.jwzx
const kcbpaerser = app.globalData.kcbpaerser
const wxp = app.globalData.wxp
const moment = require('../../moment.js');
let intervalId
import {
  errorHandle
} from '../../utils/util'

function getTimeDiff(mon, now) {
  let result = [mon.diff(now, "seconds"), ]
  if (result[0] > 60) {
    result[0] = mon.diff(now, "minutes") + 1
    result[1] = "分钟"
  } else {
    result[1] = "秒"
  }
  return result
}
Page({
  data: {
    mainHeight: 900,
    kcb: {
      xs: 3,
      info: "正在加载"
    }
  },

  onShareAppMessage: function () {

  },
  onShow: async function () {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    // wx.showLoading({
    //   title: '正在加载',
    //   mask: true
    // })
    this.setData({
      kcb: {
        info: "正在加载",
        xs: 3
      }
    })

    if (true) {
    // if (this.checked || await jwzx.haveParam()) {
      //执行初始化
      this.checked = true
      try {
        // await kcbpaerser.getNewAllWeek()
        if(kcbpaerser.isVacation()){
          this.setData({
            kcb: {
              info: "寒假快乐！\n点击可查看下学期课表",
              xs: 3
            }
          })
          return
        }
        
        
        if (kcbpaerser.checkStorage()) {

          

          let thisweek = await kcbpaerser.getThisWeek()
          let today
          for (let i of thisweek) {


            if (i.today == true) {
              today = i.course
              break
            }
          }
          if (!today || today.length == 0) {
            this.setData({
              kcb: {
                info: "今天没有课！",
                xs: 3
              }
            })
            return
          }

          today.sort((a, b) => {
            return (a.sections[0] - b.sections[0])
          })
          // if (intervalId) {
          //   clearInterval(intervalId)
          // }
          const reFreshKcbCard = (today) => {
            // console.log(today)
            let now = moment('19700101')
            now.set('hour', moment().get("hour"));

            // now.set('hour', 8);

            now.set('minute', moment().get("minute"));

            // now.set('minute', 15);

            now.set('second', moment().get("second"));
            let havingCourse = false

            for (let i = 0; i < today.length; i++) {
              // console.log(today[i].name)
              // console.log(today[i].start.format(),today[i].end.format())
              // console.log(now.format(),now.format())
              // console.log(now.isAfter(today[i].start),now.isBefore(today[i].end))
              // console.log("___________")
              if (now.isAfter(today[i].start) && now.isBefore(today[i].end)) {
                havingCourse = true
                // 上课中
                let result = getTimeDiff(today[i].end, now)
                if (i + 1 < today.length && today[i].sections[today[i].sections.length - 1] + 1 == today[i + 1].sections[0] && today[i + 1].sections[0] != 5 && today[i + 1].sections[0] != 9) {
                  //下节还有课

                  this.setData({
                    kcb: {
                      xs: 0,
                      course1: today[i].name,
                      course2: today[i + 1].name,
                      time: result[0],
                      unit: result[1]
                    }
                  })
                } else {
                  //下节没课
                  this.setData({
                    kcb: {
                      xs: 1,
                      course1: today[i].name,
                      time: result[0],
                      unit: result[1]
                    }
                  })
                }
                break // 应该不可能出现同时上两节课的情况
              }
            }
            // console.log(today)
            if (havingCourse == false) {
              //现在没课
              let haveNextCourse = false
              for (let i of today) {
                if (now.isBefore(i.start)) {
                  haveNextCourse = true
                  let result = getTimeDiff(i.start, now)
                  this.setData({
                    kcb: {
                      xs: 2,
                      course2: i.name,
                      time: result[0],
                      unit: result[1],
                      info: i.classroom
                    }
                  })
                  break
                }
              }
              if (haveNextCourse == false) {
                this.setData({
                  kcb: {
                    info: "今天没课了！",
                    xs: 3
                  }
                })
              }
            }
          }


          reFreshKcbCard(today)
          intervalId = setInterval((today)=>reFreshKcbCard(today), 1000, today)


        } else {
          this.setData({
            kcb: {
              info: "未导入课程表，请点击导入",
              xs: 3
            }
          })
        }
      } catch (e) {
        errorHandle(e)
      } finally {
        wx.hideLoading()
      }

    } else {
      wx.navigateTo({
        url: '/pages/welcome/welcome1',
      })
    }
    wx.hideLoading()
  },
  onLoad:async function () {
    // let cheerio = require('cheerio')
    // console.log(cheerio)
    let result = await wxp.request({
      url: 'https://bipt.linesoft.top/api/getNotice.json',
    })
    this.setData({
      notice:result.data
    })

  },
  jumpToXyk: function () {
    wx.requestSubscribeMessage({
      tmplIds: ["ibST0BeNkROjND2mJWfDhJHPynZpIFP861uTAZ8_JPE"]
    })
    wx.navigateTo({
      url: '/pages/index/xyk',
    })
  },
  jumpToKcb: function () {
    wx.navigateTo({
      url: '/pages/index/kcb',
    })
  },
  changekcbzt: function () {
    if (this.data.kcb.xs >= 3) {
      this.setData({
        kcb: {
          xs: 0
        }
      })
    } else {
      this.setData({
        kcb: {
          xs: this.data.kcb.xs + 1
        }
      })
    }
  },
  loginTest: function () {

    wx.login({
      timeout: 5000,
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        wx.showToast({
          title: '登录失败：' + res.errMsg
        })
      }
    })
  },
  apiTest: async function () {
    // jwzx.cookie = "JSESSIONID=FDF46A5D91ED80F564CFC90C165CD7E7.TA2"
    // jwzx.loginUseParam("2020311212","084084zlzL",5997).catch(a => console.log(a.message))
    // console.log(await server.delValue("test2")) 
    // server.haveValue("test").then(res => console.log(res))
  },
  onHide() {
    if (intervalId) {
      clearInterval(intervalId)
    }
  },
  clickBanner() {
    wx.navigateTo({
      url: '/pages/me/richtext?url=https://cdn.linesoft.top/bipt/about.md',
    })
  },
  tapXiaoli(){
    // wx.previewMedia({
    //   sources: [{url:"http://www.bipt.edu.cn/pub/jwc//images/content/2021-05/20210511162069747382501432.png"}],
    // })
    wx.previewImage({
      urls: ["http://www.bipt.edu.cn/pub/jwc//images/content/2021-05/20210511162069747382501432.png"],
    })
  }
})