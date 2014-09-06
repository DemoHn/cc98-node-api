var _98 = require("../lib/basic");
var uc = require("./user_config");

var cc98 = new _98(uc);

cc98.login(function(){
    cc98.getPostInfo(537,4412816,1,1,function(data){
      //  console.log(data[1].list);
    });

    cc98.uploadFile("duniang.jpg");
})
