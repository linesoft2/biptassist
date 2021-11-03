'use strict';
exports.main = async (event, context) => {
    const biptParser = require("./biptParser1")
    // console.log(event.html)
    try{
        const result = biptParser.scheduleHtmlParser(event.html)
        return {
            errcode: 0,
            data: result
          }
    }catch(e){
        console.error(e)
        return {
            errcode: -1,
            data: e.message
          }
          
    }
};
