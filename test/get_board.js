var _98 = require("../lib/basic");

var cc98 = new _98();

//without login 
cc98.getBoard(function(data){
    console.log("\n===TEST 01: getBoard without login===\n");
    console.log(data);

    // 好像是计院的答疑版？
    cc98.getChildBoard(408,function(data){
        console.log("\n===TEST 02: getChildBoard without login===\n");
        console.log(data);

        cc98.getPostInfo(152,4359496,1,1,function(data){
            console.log("\n===TEST 03: getChildBoard without login===\n");
            console.log(data);

                cc98.Top10(function(data){
                    console.log("\n===TEST 04: Top10 without login===\n");
                    console.log(data);
                });
        });
    });
});

