var uc = require("./user_config");
var _98 = require("../lib/basic");

var cc98 = new _98(uc);

cc98.login(function(data){
  if(data.status == 1){
    console.log(cc98.data.boardTree);
  }
});