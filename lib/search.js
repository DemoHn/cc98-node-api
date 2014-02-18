var config  = require("../config");
var errorSolver = require("../errorSolver");
var request = require("request");
var cheerio = require("cheerio");
var iconv   = require("iconv-lite");
var qs      = require("querystring");
var url     = require("url");
var async   = require("async");
var util    = require("util");

var cc98    = require("./basic");

cc98.prototype.searchPosts = function(
  keyword,
  page,
  condition,
  callback){


  var json_url = {
    protocol: "http",
    host:this.rootHost,
    pathname:"queryresult.asp",
    query:{
      "SearchDate" : condition["SearchDate"] || "ALL",
      "boardarea" : condition["boardarea"] || 0,
      "boardid" : condition["boardid"] || "",
      "sType" : condition["sType"] || 2,
      "serType" : condition["serType"] || 1,

      "page" : page || 1,
      "keyword" : keyword || ""
    }
  };

  var req_opt = {
      method:"GET",
      uri : url.format(json_url)
  };

  var search_model = {
      timestamp:new Date(1970,1,1),
      result:[],
      error:""
  };

  var result_model = {
      face:"",
      name:"",
      boardid:"",
      postid:"",
      author:"",
      postDate:new Date()
  };

  this.request(req_opt,function(e,r,body){

    if(e){
      errorSolver.err(e);
    }else{
      var $ = cheerio.load(body);

      var result_main = $("table.tableborder1").children();

      function _parselink(uri){
        if(uri){
          var qs = url.parse(uri,true,true);
          return {
            boardid : qs.query.boardID,
            postid: qs.query.ID
          };
        }else{
          return {boardid:null,postid:null};
        }
      }

      result_main.each(function(index,elem){

        var reg_face_pic = /[0-9]+/;
        var str_face_pic = $(elem).find("td img").attr("src");
        if(reg_face_pic.test(str_face_pic) != false){
          str_face_pic = str_face_pic.match(reg_face_pic)[0];
        }

        if(index >= 1){
          result_model = {
            face:str_face_pic,
            name:$(elem).find("td").eq(0).find("a").eq(1).html(),
            boardid:_parselink($(elem).find("td").eq(0).find("a").eq(1).attr("href")).boardid,
            postid:_parselink($(elem).find("td").eq(0).find("a").eq(1).attr("href")).postid,
            author:$(elem).find("td").eq(2).find("a").text(),
            postDate:$(elem).find("td").eq(3).text()
          };

          search_model.result.push(result_model);
        }
      });

      //add timestamp
      search_model.timestamp = new Date();
      if(/没有找到您要查询的内容/.test($("table.tableborder1").find("tr").text()) === true){
        search_model.result = [];
        search_model.error = "404";
      }
    }

    callback(search_model);
  });
};

module.exports = cc98;