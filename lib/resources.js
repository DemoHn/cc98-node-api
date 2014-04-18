var config  = require("../config");
var errorSolver = require("../errorSolver");

var request = require("request");
var cheerio = require("cheerio");
var crypto  = require("crypto");
var iconv   = require("iconv-lite");
var qs      = require("querystring");
var url     = require("url");

var utils   = require("./utils.js");

var cc98    = require("./basic");

//TODO if necessary, write some files about it.
//cc98.prototype.