'use strict';
const fun = {
    data: {},
    async scoreParser() {
        var $ = require("cheerio").load(this.data.html)
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
    },
    async examParser() {
        // console.log(this.data.html)
        var $ = require("cheerio").load(this.data.html)
        let result = []
        let reduce = 0
        if (this.data.fromOld===true) {
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