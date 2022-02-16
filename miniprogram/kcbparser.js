let wxp = {}
const moment = require('moment.js');

function getTop(num, jieci, fengexian, wuxiu) {
  let plus = 0
  if (num >= 5) {
    if (num >= 9) {
      plus = wuxiu * 2 + fengexian * 2
    } else {
      plus = wuxiu + fengexian
    }
  }
  let result = (num - 1) * (jieci + fengexian)
  return result + plus
}

function getHeight(num, jieci, fengexian) {
  return jieci * num + fengexian * (num - 1)
}

function getStart(num) {
  let result = moment("19700101")
  switch (num) {
    case 1:
      result.set('hour', 8);
      result.set('minute', 0);
      return result
    case 2:
      result.set('hour', 8);
      result.set('minute', 55);
      return result
    case 3:
      result.set('hour', 10);
      result.set('minute', 0);
      return result
    case 4:
      result.set('hour', 10);
      result.set('minute', 55);
      return result
    case 5:
      result.set('hour', 13);
      result.set('minute', 30);
      return result
    case 6:
      result.set('hour', 14);
      result.set('minute', 25);
      return result
    case 7:
      result.set('hour', 15);
      result.set('minute', 30);
      return result
    case 8:
      result.set('hour', 16);
      result.set('minute', 25);
      return result
    case 9:
      result.set('hour', 19);
      result.set('minute', 0);
      return result
    case 10:
      result.set('hour', 19);
      result.set('minute', 50);
      return result
    case 11:
      result.set('hour', 20);
      result.set('minute', 40);
      return result
    case 12:
      result.set('hour', 19);
      result.set('minute', 50);
      return result
    case 13:
      result.set('hour', 20);
      result.set('minute', 40);
      return result
  }
}

function getEnd(num) {
  let result = moment("19700101")
  switch (num) {
    case 1:
      result.set('hour', 8);
      result.set('minute', 45);
      return result
    case 2:
      result.set('hour', 9);
      result.set('minute', 40);
      return result
    case 3:
      result.set('hour', 10);
      result.set('minute', 45);
      return result
    case 4:
      result.set('hour', 11);
      result.set('minute', 40);
      return result
    case 5:
      result.set('hour', 14);
      result.set('minute', 15);
      return result
    case 6:
      result.set('hour', 15);
      result.set('minute', 10);
      return result
    case 7:
      result.set('hour', 16);
      result.set('minute', 15);
      return result
    case 8:
      result.set('hour', 17);
      result.set('minute', 10);
      return result
    case 9:
      result.set('hour', 19);
      result.set('minute', 45);
      return result
    case 10:
      result.set('hour', 20);
      result.set('minute', 35);
      return result
    case 11:
      result.set('hour', 21);
      result.set('minute', 25);
      return result
  }
}
export class Kcbpaerser {
  constructor(wxp1, jwzx) {

    this.allweek = wx.getStorageSync("kcb")
    // if(this.isVacation()===false && this.allweek.next===true){
    //   this.allweek.next = false
    //   wx.setStorageSync('kcb', this.allweek)
    // }
    this.currentCount = 1
    wxp = wxp1
    this.jwzx = jwzx
  }

  checkStorage() {
    return Boolean(this.allweek)
  }

  isOld() {
    // return this.isVacation()&& !this.allweek.next
    if (this.allweek.count !== undefined) {
      return this.allweek.count < this.currentCount
    } else {
      return true
    }
  }

  isVacation() {
    return this._getWeekNum() >= 17
  }

  _getWeekNum() {
    let weekFirst = moment("20220221")
    let today = moment()
    today.set('hour', weekFirst.get("hour"));
    today.set('minute', weekFirst.get("minute"));
    today.set('second', weekFirst.get("second"));
    today.set('millisecond', weekFirst.get("millisecond"));
    if (today.isBefore(weekFirst)) {
      return 1
    } else {
      const count = parseInt(today.diff(weekFirst, "day") / 7) + 1
      return count

    }
  }
  getWeekNum() {
    // return 1
    const count = this._getWeekNum()
    if (count >= 17) {
      return 1;
    } else {

      return count
    }
    // let result = await wxp.request({
    //   url: "https://jwzx.bipt.edu.cn/academic/calendarinfo/viewCalendarInfo.do",
    //   // header:{"Cookie":this.jwzx.Cookie}
    // })
    // let reg = /\<strong\>(.*?)\<\/strong\>/
    // return parseInt(reg.exec(result.data)[1])
  }
  async getNewAllWeek(develop,data) {
    if(develop === true){
      this.allweek = data
    this.allweek.updateTime = moment().format("YYYY-MM-DD HH:mm")
    this.allweek.count = this.currentCount
    wx.setStorageSync('kcb', this.allweek)
    return
    }
    this.thisweek = undefined
    //https://jwzx.bipt.edu.cn/academic/student/currcourse/currcourse.jsdo?year=42&term=1
    let html = await this.jwzx.request("academic/student/currcourse/currcourse.jsdo?year=42&term=1", "GET", {},"kcb")
    html = html.data
    // let html
    // const modalResult = await wx.showModal({
    //   showCancel: true,
    //   title: "课程表解析，输入html源码",
    //   // content:"",
    //   editable: true
    // })
    // if (modalResult.confirm) {
    //   html = modalResult.content
    // } else {
    //   return
    // }

    // console.log(html)
    // let result = await wxp.request({
    //   url: "https://bipt.linesoft.top:8080/parserBiptSchedule",
    //   // url:"http://127.0.0.1:8080/parserBiptSchedule",
    //   method: "POST",
    //   header: {
    //     "content-type": "application/x-www-form-urlencoded"
    //   },
    //   data: html
    // })
    let result = await wx.cloud.callFunction({
      name: "kcbparser",
      data: {
        html
      }
    })
    result = result.result
    if (result.errcode != 0) {
      throw new Error("课程表服务器解析失败，错误信息：" + result.data)
      return
    }

    this.allweek = result.data
    this.allweek.updateTime = moment().format("YYYY-MM-DD HH:mm")
    this.allweek.count = this.currentCount
    wx.setStorageSync('kcb', this.allweek)
  }
  async getThisWeek(jieci, fengexian, wuxiu, week) {
    if (!this.checkStorage()) return
    let kcbColor =  wx.getStorageSync('kcbColor')
    let thisweek = [{
        t1: "周一",
        t2: "1",
        course: []
      },
      {
        t1: "周二",
        t2: "2",
        course: []
      },
      {
        t1: "周三",
        t2: "3",
        course: []
      },
      {
        t1: "周四",
        t2: "4",
        course: []
      },
      {
        t1: "周五",
        t2: "5",
        course: []
      },
      {
        t1: "周六",
        t2: "6",
        course: []
      },
      {
        t1: "周日",
        t2: "7",
        course: []
      },
    ]
    let day = moment().day()
    if (day == 0) {
      day = 7
    }
    // day = 1
    thisweek[day - 1].today = true
    let thisWeekNum = week ? week : this.getWeekNum()
    // console.log(thisWeekNum)
    if (!this.allweek.courseInfos) {
      this.allweek = {
        courseInfos: this.allweek
      }
    }
    for (let i of this.allweek.courseInfos) {
      let canContinue = false

      for (let n of i.weeks) {
        if (n == thisWeekNum) {
          canContinue = true
          break
        }
      }
      if (canContinue == false) {
        continue
      } //不能继续，所以用continue跳过

      let name = i.name
      let classroom = i.position

      let teacher
      if (i.teacher.length > 4) {
        teacher = "多名老师"
      } else {
        teacher = i.teacher
      }
      if (!i.sections || i.sections.length === 0) {
        continue
      }
      let top = getTop(i.sections[0].section, jieci, fengexian, wuxiu)
      let height = getHeight(i.sections.length, jieci, fengexian)
      let start = getStart(i.sections[0].section)
      let end = getEnd(i.sections[i.sections.length - 1].section)
      let sections = []
      for (let n of i.sections) {
        // console.log(n)
        sections.push(n.section)
      }
      if(!kcbColor){
        kcbColor = {globalColor:1}
      }
      if(kcbColor.globalColor >= 5){
        kcbColor.globalColor = 1
      }
      let color
      if(kcbColor[name]){
        color = kcbColor[name]
        
      }else{
        color = kcbColor.globalColor
        kcbColor[name] = color
        kcbColor.globalColor++
      }
      let courceinfo = {
        name,
        classroom,
        teacher,
        top,
        height,
        start,
        end,
        color,
        sections
      }
      // console.log(i.day - 1)
      // console.log(i)
      thisweek[i.day - 1].course.push(courceinfo)
    }
    // console.log(thisweek)
    if (thisweek[5].course.length == 0 && thisweek[6].course.length == 0) {
      // 如果周六日都没课就把周六日删了
      thisweek.pop()
      thisweek.pop()
    }
    this.thisweek = thisweek
    wx.setStorageSync('kcbColor', kcbColor)
    console.log(thisweek)
    return thisweek
  }
}