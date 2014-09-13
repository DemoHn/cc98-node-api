var _98 = require("../lib/basic");
var uc = require("./user_config");
var cc98 = new _98(uc);

cc98.login(function(data){
    if(data.status == 1){

      cc98.watchedBoard(function(data){
        console.log(data);
      });
        cc98.customizeBoard(283,function(body,status){
            console.log(body);
            console.log(status);
        })
    }
});