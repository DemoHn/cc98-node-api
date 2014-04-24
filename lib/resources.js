var config  = require("../config");
var errorSolver = require("../errorSolver");

var request = require("request");
var qs      = require("querystring");
var url     = require("url");
var fs      = require("fs");
var utils   = require("./utils.js");
var http    = require("http");
var cc98    = require("./basic");

//TODO if necessary, write some files about it.
cc98.prototype.downloadFile = function(url,dest,event,callback){
  http.get(url,function(r){
    var length = r.headers["content-length"];

    r.on('data',function(chuck){
      console.log(chuck.length);
      fs.writeFile(dest,chuck,{flag:"a"},function(err){
      });
    });
    r.on('end',function(){
      console.log("end");
    });
  });
};

module.exports = cc98;