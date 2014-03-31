var _98 = require("../lib/basic");

var cc98 = new _98();

cc98.login(function(data){
  cc98.readMailbox(1,function(data){
   // console.log(data);
  });

  cc98.readUserIndex(function(data){
    console.log(data);
  });
});