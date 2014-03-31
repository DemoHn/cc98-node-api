var _98 = require("../lib/basic");

var cc98 = new _98();

cc98.login(function(data){
  cc98.getBoard(function(board){
//     console.log(board);
  });

  cc98.getChildBoard(408,function(data){
  //  console.log(data["board"][1]["boardManager"]);
  });

  cc98.Top10(function(data){
      console.log(data);
  });

  cc98.getPostInfo(326,4331193,1,1,function(data){
//    console.log(data[1]["list"][0]);
  });

//  cc98.check(function(data){});
});
