var _98 = require("../lib/basic");
var uc = require("./user_config");

var cc98 = new _98(uc);

cc98.login(function(){
    cc98.getPostInfo(537,4420101,1,1,function(data){
        console.log(data[1].list);
    });

    /*cc98.uploadFile("a.gif",198,function(msg,url){
        console.log(url);
    });*/
})
