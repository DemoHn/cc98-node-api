var config = require("../config");
var errorSolver = require("../errorSolver");

var request = require("request");
var cheerio = require("cheerio");
var crypto = require("crypto");
var iconv = require("iconv-lite");
var qs = require("querystring");
var url = require("url");
var utils = require("./utils.js");
var async = require("async");
var fs = require("fs");

var cc98 = require("./basic");

cc98.prototype.uploadFile = function(file_dir,callback){

    var opt = {
        method:"POST",
        uri:"http://www.cc98.org/saveannouce_upfile.asp?boardid=198",
        headers:{
            "User-Agent":this.UserAgent,
            Origin:"http://www.cc98.org",
            Referer:"http://www.cc98.org/saveannouce_upfile.asp?boardid=198"
        }
    }

    var r = this.request(opt,function(e,r,body){
        console.log(body);
    });

    var form = r.form();
    form.append('act','upload');
    form.append('file1',fs.createReadStream(file_dir));
    form.append('Submit','上传');
}

module.exports = cc98;