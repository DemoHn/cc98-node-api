var _98 = require("../lib/basic");
var uc = require("./user_config");

var cc98 = new _98(uc);

cc98.login(function(data){
  var content = {
    touser:"demohn",
    title:"hi",
    message:"hi"
  };

  cc98.sendMessage(content,function(data){
    console.log(data);
  });
});