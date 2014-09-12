var _98 = require("../lib/basic");
var fs = require("fs");
var uc = require("./user_config");
var async = require("async");

var cc98 = new _98(uc);
var str = "";

var board = {};
cc98.login(function(data){
  if(data.status == 1){
    cc98.getBoard(function(data){
      var data_arr = data["board"];

      for(var j in data_arr){
        board[ data_arr[j]["boardid"] ] = {};

        // set first-level-board's name
        board[ data_arr[j]["boardid"] ]['name'] = data_arr[j]["name"];
        board[ data_arr[j]["boardid"] ]['intro'] = data_arr[j]["intro"];
      }

      //second level boards
      async.each(data_arr,function(elem,callback){
        var id = elem.boardid;

        cc98.getChildBoard(id,function(datas){
          var data = datas["board"];

          for(var k in data){
            board[""+id][""+ data[k]["boardid"] ] = {};

            board[""+id][""+ data[k]["boardid"] ]["name"] = data[k]["name"];
            board[""+id][""+ data[k]["boardid"] ]["intro"] = data[k]["intro"];
          }

          callback();
        });
      },function(err){
        ThirdLevel(board);
      });

    });
  }
});

function ThirdLevel(data_json){
  var task_arr = [];

  for(var i in data_json){
    for(var j in data_json[i]){
      if(j != "name" && j != "intro"){
        var obj = {
            i : i,
            j : j
        };
        task_arr.push(obj);
      }
    }
  }

  async.each(task_arr,function(elem,callback){
    var j = elem.j;
    var i = elem.i;
    cc98.getChildBoard(j,function(datas){
      var data = datas["board"];
      // there are child boards
      if(data.length > 0){
        for(var l in data){
          board[""+i][""+j][ data[l]["boardid"] ] = {};
          board[""+i][""+j][ data[l]["boardid"] ]['name'] = data[l]['name'];
          board[""+i][""+j][ data[l]["boardid"] ]['intro'] = data[l]['intro'];
        }
      }

      callback();
    });
  },function(err){
    var content = JSON.stringify(board,null,4);
    // write the json into a file
    fs.writeFile(__dirname+"/../data/board.list.json",content,{encoding:"utf-8"},function(err){
      if(err){
        console.log(err);
      }
    });
  });
}
