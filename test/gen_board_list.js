var board_tree = require("../data/board.tree.json");
var fs = require("fs");
var board_list = {};

//area name
for(var j in board_tree){

  if(j != "name" && j != "intro"){
    board_list[j] = {};
    board_list[j]["name"] = board_tree[j]["name"];

    for(var k in board_tree[j]){

      if(k != "name" && k != "intro"){
        board_list[k] = {};
        board_list[k]["name"] = board_tree[j][k]["name"];
        board_list[k]["intro"] = board_tree[j][k]["intro"];

        for(var l in board_tree[j][k]){

          //get length of the json obj
          var len = 0;
          for(var m in board_tree[j][k]){
            len += 1;
          }
          if(len > 2 && l != "name" && l != "intro"){
            board_list[l] = {};
            board_list[l]["name"] = board_tree[j][k][l]["name"];
            board_list[l]["intro"] = board_tree[j][k][l]["intro"];
          }
        }
      }
    }
  }
}

var content = JSON.stringify(board_list,null,4);

if(content != null){
  fs.writeFile("../data/board.list.json",content,{encoding:"utf-8"},function(err){
    if(err){
      console.log(err);
    }
  });
}
