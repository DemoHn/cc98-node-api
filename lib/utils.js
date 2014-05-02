var _ = require("underscore");
var cheerio = require("cheerio");

//trim some useless strings to let the output more pure.
exports.trim = function(string,reg){
  var string = string || "";
  var reg_replace = /\r|\n|\t/g;
  if(reg instanceof RegExp === true){
    reg_replace = reg;
  }
  return  string.replace(reg_replace,"");
};

//a safe & easy RegExp renderer.
exports.match = function(reg_exp,string,indexof){
  if(string == null){
    return null;
  }else{
    indexof = indexof || 0;
    if(_.isArray(reg_exp.exec(string)) === true){
      if(indexof >= 0){
        return reg_exp.exec(string)[indexof];
      }else{
        return reg_exp.exec(string);
      }
    }else{
      return reg_exp.exec(string);
    }
  }
};

// match the format of 2014/4/24 21:51:00
exports.matchTime = function(str){
    var reg_time = /(\d{4})\/(\d{1,2})\/(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/;
  if(reg_time.test(str) == true){
    var reg_arr = reg_time.exec(str);
    var date = new Date(reg_arr[1],reg_arr[2]-1,reg_arr[3],reg_arr[4],reg_arr[5],reg_arr[6]);
    return date;
  }else{
    return undefined;
  }
};

//match format: 2014/4/7 23:12
exports.matchTime_2 = function(str){
  var reg_time = /(\d{4})\/(\d{1,2})\/(\d{1,2})\s(\d{1,2}):(\d{1,2})/;
  if(reg_time.test(str) == true){
    var reg_arr = reg_time.exec(str);
    var date = new Date(reg_arr[1],reg_arr[2]-1,reg_arr[3],reg_arr[4],reg_arr[5]);
    return date;
  }else{
    return undefined;
  }
};

//match format: 2014-4-7 23:12
exports.matchTime_3 = function(str){
  var reg_time = /(\d{4})-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})/;
  if(reg_time.test(str) == true){
    var reg_arr = reg_time.exec(str);
    var date = new Date(reg_arr[1],reg_arr[2]-1,reg_arr[3],reg_arr[4],reg_arr[5]);
    return date;
  }else{
    return undefined;
  }
};

exports.msgMatch = function(msg_string){
  var $ = cheerio.load(msg_string);
  return $("table").find("tr").eq(1).find("td").html();
};

