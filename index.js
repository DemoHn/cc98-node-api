var _98 = require("./cc98");

var cc98 = new _98();

// cc98.login(function(data){
//   cc98.getBoard(function(data){
//     console.log(data);
//   });

// });


/*cc98.getPostInfo(105,4305651,1,2,function(data){
  console.log(data[1].list[1]);
});*/

cc98.getChildBoard(462,function(data){
  console.log(data);
});
cc98.getAllPostList(68,1,3,function(data){
 // console.log(data[1].list[4]);
});
