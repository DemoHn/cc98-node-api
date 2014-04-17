var _98 = require("../lib/basic");
var fs = require("fs");


var cc98 = new _98();
var str = "";

cc98.login(function(data){
  if(data.status == 1){
    cc98.getBoard(function(data){
      var data_arr = data["board"];

      data_arr.forEach(function(elem,index){
        console.log(data_arr[index]["name"]);
        cc98.getChildBoard(data_arr[index]["boardid"],function(data){
          var a = data["board"];

          a.forEach(function(elem,index){
            console.log("  "+a[index]["name"]);
          });
        });
      });
    });
  }
});