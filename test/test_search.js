var _98 = require("../lib/search");

var cc98 = new _98();

cc98.login(function(data){
  if(data.status === 1){
    cc98.searchPosts("fefefefea",1,{},function(data){
      console.log(data);
    });
  }
});