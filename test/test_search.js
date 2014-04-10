var _98 = require("../lib/basic");

var cc98 = new _98();

cc98.login(function(data){
  if(data.status === 1){
/*    cc98.searchPosts("fefefefea",1,{},function(data){
      console.log("No1:");
      console.log(data);
      //404
    });*/

    cc98.readMessage(23228370,function(data){
	console.log(data);
    });
  }
});