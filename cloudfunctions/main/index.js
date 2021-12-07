'use strict';
const fun = {
    data: {},
    async scoreParser() {
        var $ = require("cheerio").load(this.data.html)
        
    }
}
const result = {
    code: 0,
    msg: ""
}
exports.main = async (event, context) => {
    try {
        fun.data = event.data
        if (fun[event.fun]) {
            return await fun[event.fun]()
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