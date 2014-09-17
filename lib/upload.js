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

cc98.prototype.uploadFile = function(file_dir, boardid, callback) {

    var boardId = 198;
    if (callback != undefined) {
        boardId = boardid;
    } else {
        boardId = callback;
        callback = boardid;
    }

    var opt = {
        method: "POST",
        uri: "http://www.cc98.org/saveannouce_upfile.asp?boardid=" + boardId,
        headers: {
            "User-Agent": this.UserAgent,
            Origin: "http://www.cc98.org",
            Referer: "http://www.cc98.org/saveannouce_upfile.asp?boardid" + boardId
        }
    }

    var r = this.request(opt, function(e, r, body) {
        var return_msg = {
            code: 0, //消息代码
            msg: "", //消息信息
        }
        /*upload success*/
        if (/上传成功/.test(body) == true) {
            return_msg = {
                code:0,
                msg:"success"
            }

            var upload_url = utils.match(/\[upload.*\](.*)\[\/upload\]/,body,1);
            callback(return_msg,upload_url);
        }else if(/相应权限/.test(body) == true){
            return_msg = {
                code:-1,
                msg:"need login"
            }

            callback(return_msg,null);
        }else if(/限制/.test(body) == true){
            return_msg = {
                code:-2,
                msg:"exceed file size limitation"
            }

            callback(return_msg,null);
        }else{
            return_msg = {
                code:-100,
                msg:"unknown error"
            }

            callback(return_msg,null);
        }
    });

    var form = r.form();
    form.append('act', 'upload');
    form.append('file1', fs.createReadStream(file_dir));
    form.append('Submit', '上传');
}

module.exports = cc98;
