var _98 = require("../lib/basic");
var uc = require("./user_config");

var cc98 = new _98(uc);

cc98.login(function(data){

  if(data.status == 1){
    cc98.readMailBox(1,function(data){
      console.log("\nTEST 01: readMailBox:\n");
      console.log(data["mailbox"]);

      cc98.readMessage(23205572,function(data){
        console.log("\nTEST 02: readMessage:\n");
        console.log(data);
      });
    });
  }
});