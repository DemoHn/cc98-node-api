var _98 = require("../lib/basic");
var uc = require("./user_config");
var cc98 = new _98(uc);

//without login
cc98.getBoard(function(data){
  console.log("\n===TEST 01: getBoard without login===\n");
  console.log(data.board[0]);

  // 好像是计院的答疑版？
  cc98.getChildBoard(408,function(data){
    console.log("\n===TEST 02: getChildBoard without login===\n");
    console.log(data.board[0]);

    cc98.getPostInfo(100,4360410,1,1,function(data){
      console.log("\n===TEST 03: getChildBoard without login===\n");
      console.log(data[1]["list"][0]);

      cc98.Top10(function(data){
        console.log("\n===TEST 04: Top10 without login===\n");
        console.log(data.posts[0]);

        //with login
        cc98.login(function(){
          console.log("\nIf there is any problem, please check if account settings is available.\n");
          cc98.getBoard(function(data){
            console.log("\n===TEST 05: getBoard logged===\n");
            console.log(data.board[0]);

            // 好像是计院的答疑版？
            cc98.getChildBoard(408,function(data){
              console.log("\n===TEST 06: getChildBoard logged===\n");
              console.log(data.board[0]);

              cc98.getPostInfo(100,4360410,1,1,function(data){
                console.log("\n===TEST 07: getChildBoard logged===\n");
                console.log(data[1]["list"][2]);

                cc98.Top10(function(data){
                  console.log("\n===TEST 08: Top10 logged===\n");
                  console.log(data.posts[0]);
                });
              });
            });
          });
        });
      });
    });
  });
});
