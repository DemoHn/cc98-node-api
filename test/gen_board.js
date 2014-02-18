var _98 = require("../lib/basic");
var fs = require("fs");
var async = require("async");

var cc98 = new _98();
var str = "";

cc98.login(function(data){
  if(data.status === 1){

    async.waterfall([

      // get first level of board
      function(callback){
        cc98.getBoard(function(data){
          callback(null,data);
        });
      },

      function(data,callback){

      }


    ],function(){});
  }
});