var $ = require("cheerio")

export function examParser(data) {
  // console.log(this.data.html)
  $ = $.load(data.html)
  let result = []
  let reduce = 0
  if (data.fromOld===true) {
      // console.log(this.data)
      reduce = 1
  }
  // let node = [...$(".infolist_common"),...]
  for (let node of $(".infolist_common, .infolist_common_blur")) {
      node = $(node).children()
      let obj = {
          name: node.eq(1 - reduce).text(),
          time: node.eq(2 - reduce).text().replace("--", "-"),
          locat: node.eq(3 - reduce).text().trim(),

      }
      const a = node.eq(4 - reduce).text().trim()
      
      if (a !== "正常考试" && a !== "正常") {
          // console.log(a)
          obj.msg = a
      }
      result.push(obj)
  }

  return result
  //   console.log($(".infolist_common").eq(0)
}

export function scoreParser(html) {
  $ = $.load(html)
  let result = []
  for (let tr of $(".datalist tr")) {
      tr = $(tr).children()
      if(tr[0].name==="th"){
          continue
      }
      result.push({
          name:tr.eq(5).text().trim(),
          xuefen:tr.eq(6).text().trim(),
          score:tr.eq(15).text().trim(),
      })
  }
  return result
}


export function scheduleParser(html) {
    //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
    $ = $.load(html)
    
    let result = []
    let arr = $(".infolist_tab").children().children()
    // console.log($("body").html())
    // console.log(arr)
    for (let i = 0; i < arr.length; i++) {
        let value = $(arr[i]).children()
        if (value.eq(9).text().indexOf("星期") == -1) {
            continue
        }

        let courseName = value.eq(2).children().text().trim()
        
        //console.log(value.eq(3).children())
        let _teacher = value.eq(3).children()
        let teacher = []
        for(let i of _teacher){
            if(i.name === 'a'){
                teacher.push($(i).text())
            }
        }
        let infoArr = value.eq(9).children().children().children()
        for (let n = 0; n < infoArr.length; n++) {
            let info = $(infoArr[n]).children()
            let infoTextArr = info.text().trim().replace(/[\r\n]/g, "").split("                    ")
            //["第1-5全周", "星期三", "第6,7节", "康404"]
            
            let weeks = createWeeks(infoTextArr[0])
            
            let week = createWeek(infoTextArr[1])
            let sections = createSections(infoTextArr[2])
            let position = ""
            if(infoTextArr[3]){
                let newPosition = infoTextArr[3].match(/(\d{1,2}#[^-]+)\-(\S?\d+)/)
                if(newPosition && newPosition.length>= 3){
                  position = newPosition[2]
                }else{
                  position = infoTextArr[3]
                }
            }
            
            result.push({
                "name": courseName,
                "position": position,
                "teacher": teacher,
                "weeks": weeks,
                "day": week,
                "sections": sections,
            })
        }



    }
    
    return { courseInfos: result }
}

function createWeek(weekStr) {
    switch (weekStr) {
        case "星期五":
            return 5;
            break;
        case "星期四":
            return 4;
            break;
        case "星期三":
            return 3;
            break;
        case "星期二":
            return 2;
            break;
        case "星期一":
            return 1;
            break;
        case "星期六":
            return 6;
            break;
        case "星期日":
            return 7;
            break;
        default:
            return ""
            break;
    }
}

function createWeeks(weeksStr) {
    //"第1-5全周"
    if (weeksStr.indexOf("-") == -1) {
        return [parseInt(weeksStr.replace("单", "").replace("双", "").replace("全", "").replace("第", "").replace("周", ""))]
    }
    let flag = 0 //0全周，1单周，2双周
    if (weeksStr.indexOf("单周") != -1) {
        flag = 1
    } else if (weeksStr.indexOf("双周") != -1) {
        flag = 2
    }
    
    let WeekStrArr = []
    if(weeksStr.indexOf(",")==-1){
        WeekStrArr = [weeksStr]
    }else{
        WeekStrArr = weeksStr.split(",")
    }
let arr = []

for(let n =0; n<WeekStrArr.length;n++){
    if(WeekStrArr[n].indexOf("第")==-1){
        WeekStrArr[n] = "第"+WeekStrArr[n]
    }
    if(WeekStrArr[n].indexOf("周")==-1){
        WeekStrArr[n] = WeekStrArr[n]+"周"
    }
    if (WeekStrArr[n].indexOf("-") == -1) {
        arr.push(parseInt(WeekStrArr[n].replace("单", "").replace("双", "").replace("全", "").replace("第", "").replace("周", "")))
        continue
    }
    let end = parseInt(getMidValue(WeekStrArr[n], "-", "周").replace("单", "").replace("双", "").replace("全", ""))
    for (let i = parseInt(getMidValue(WeekStrArr[n], "第", "-")); i <= end; i++) {
        if (flag == 0) {
            arr.push(i)
        } else {
            let a = i % 2
            if (a == 0) {
                if (flag == 2) {
                    arr.push(i)
                }
            } else {
                if (flag == 1) {
                    arr.push(i)
                }
            }
        }

    }
}
    
    return arr
}

function getMidValue(str, firstStr, secondStr) {
    if (str == "" || str == null || str == undefined) { // "",null,undefined
        return "";
    }
    if (str.indexOf(firstStr) < 0) {
        return "";
    }
    var subFirstStr = str.substring(str.indexOf(firstStr) + firstStr.length, str.length);
    var subSecondStr = subFirstStr.substring(0, subFirstStr.indexOf(secondStr));
    return subSecondStr;
}

function createSections(str){
     //第1,2节
     let arr = []
     if(!str){
         return arr
     }
     if(str.indexOf(",")==-1){
         arr.push({
            section: parseInt(str.replace("第","").replace("节",""))
        })
        return arr
    }
     let strArr = str.replace("第","").replace("节","").split(",")
     for (let i =0; i< strArr.length;i++){
        arr.push({
            section: parseInt(strArr[i])
        })
     }
     return arr
}

