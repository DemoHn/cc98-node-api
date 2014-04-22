var config  = require("../config");
var errorSolver = require("../errorSolver");

var request = require("request");
var cheerio = require("cheerio");
var crypto  = require("crypto");
var iconv   = require("iconv-lite");
var qs      = require("querystring");
var url     = require("url");
var fs      = require("fs");
var utils   = require("./utils.js");

var cc98    = require("./basic");

//TODO if necessary, write some files about it.
cc98.prototype.downloadFile = function(url){
  this.request.get(url).pipe(fs.createWriteStream("hehe.jpg"));
};

module.exports = cc98;