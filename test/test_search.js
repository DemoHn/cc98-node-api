var _98 = require("../lib/basic");
var uc = require("./user_config");
var cc98 = new _98(uc);

cc98.login(function(data){
  if(data.status === 1){
    cc98.searchPosts("fefefefea",1,{},function(data){
      console.log("No1:");
      console.log(data);
      //404
    });
  }
});