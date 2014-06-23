var _98 = require("../lib/basic");
var uc = require("./user_config");

var cc98 = new _98(uc);

var profile = {
  title:"233",
  Sex:"1",
  birthyear:"1995",
  birthmonth:"10",
  birthday:"12",
  face:"",
  myface:"http://file.cc98.org/uploadface/440318.jpg",
  width:86,
  height:120,
  userphoto:"hhhhh",
  groupname:"doubi.js",
  Signature:"233333",
  homepage:"http://www.demohn.com",
  Email:"demohn@foxmail.com",
  OICQ:"601790183",
  msn:"",
  usercookies:4,
  ShowMedal:"1",
  ShowLife:"1",
  AutoPlay:"1",
  EnableOWA:"1",
  setuserinfo:"1",
  usermsgring:"1",
  sendring:0,
  EnablePopup:1
};

cc98.login(function(data){
  cc98.readMyProfile(function(data){
    console.log("\nTEST 01: readMyIndex:\n");
//    console.log(data);

    cc98.readUserProfile("name","demohn",function(data){
      console.log(data);
    });
  });
});