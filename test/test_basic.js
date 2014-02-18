var _98 = require("../lib/basic");

var cc98 = new _98();

cc98.login(function(data){
  cc98.getBoard(function(board){
    // console.log(board);
  });

  cc98.getChildBoard(461,function(data){
    // console.log(data);
  });

  cc98.Top10(function(data){
    //  console.log(data);
  });

  cc98.getPostInfo(105,4305651,2,2,function(data){
    console.log(data);
  });
});
