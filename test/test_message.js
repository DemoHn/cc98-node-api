var _98 = require("../lib/basic");

var cc98 = new _98();

cc98.login(function(data){
  cc98.readMailbox(1,function(data){
   // console.log(data);
  });

  cc98.readUserIndex(function(data){
//    console.log(data);
  });

  var content = {
      boardid:103,
      subject : "another test",
      expression : 3,
      content:"please ignore it",
      signflag:"yes"
  };

  cc98.sendNewPost(content,function(data){
    console.log(data);
  });
});