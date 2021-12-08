'use strict';
const fun = {
    data: {},
    async scoreParser() {
        var $ = require("cheerio").load(this.data.html)

    },
    async examParser() {

        const html = `<table cellpadding="0" cellspacing="0" class="infolist_tab">
        <tr>
          <th>课程号</th>  
          <th>课程名称</th>
          <th>考试时间</th>
          <th>考试地点</th>
          <!--<th>考试方式</th>-->
              <th>考试性质</th>
        </tr>
      </table>`
        console.log(this.data.html)
        var $ = require("cheerio").load(this.data.html)
        let result = []
        let reduce = 0
        if (this.data.formOld) {
            reduce = 1
        }
        for (let node of $(".infolist_common")) {
            node = $(node).children()
            let obj = {
                name: node.eq(1 - reduce).text(),
                time: node.eq(2 - reduce).text().replace("--", "-"),
                locat: node.eq(3 - reduce).text().trim(),

            }
            const a = node.eq(4 - reduce).text().trim()
            if (a !== "正常考试" || a !== "正常") {
                obj.msg = a
            }
            result.push(obj)
        }

        return result
        //   console.log($(".infolist_common").eq(0)
    }
}
const result = {
    code: 0,
    msg: ""
}
exports.main = async (event, context) => {
    try {
        console.log(event)
        fun.data = event
        if (fun[event.fun]) {
            result.code = 0
            result.data = await fun[event.fun]()
            return result
        } else {
            result.code = -1
            result.msg = "无此函数"
            return result
        }
    } catch (e) {
        result.code = -1
        result.msg = e.message
        return result
    }
};