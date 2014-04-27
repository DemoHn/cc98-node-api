var _98 = require("../lib/basic");
var uc = require("./user_config");

var cc98 = new _98(uc);

cc98.login(function(data){
  var content = {
    postID: 4360604,
    boardid:248,
    expression:8,
    content:"信电新晚23333(据说是奖品太诱人了...)",
    signflag:"no"
  };

/*  cc98.sendFastReply(content,function(data){
    console.log(data);
  });*/

  var contents = {
    postID: 4365227,
    boardid:39,
    expression:7,
    subject:"!!!",
    content:"好可怕的样子！(chrome党路过)",
    signflag:"no",
    sendSMS:1
  };


  cc98.sendTopicReply(contents,function(data){
    console.log(data);
  });
});