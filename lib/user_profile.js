var config  = require("../config");
var utils   = require("./utils.js");
var errorSolver = require("../errorSolver");
var request = require("request");
var cheerio = require("cheerio");
var iconv   = require("iconv-lite");
var qs      = require("querystring");
var url     = require("url");

var cc98    = require("./basic");

cc98.prototype.readUserIndex = function(callback){
  var that = this;
  if(this.loginStatus == 1){
    var req_opt = {
      method:"GET",
      uri :"http://"+this.rootHost +"/usermanager.asp"
    };

    var user_index_model = {
      timestamp: new Date(1970,1,1),
      faceUrl : "", //头像链接
      rank : "", //等级
      money : "",//用户财富
      exp : "", //经验
      charisma:"",//魅力
      essentialPosts:"",//精华帖
      totalPosts:"",//帖子总数
      registerTime:"",//注册时间
      loginTimes:""//登录次数
    };

    this.request(req_opt,function(e,req,body){
      if(e){
        errorSolver.err(e);
        callback();
      }else{

        function _reg_time(str){

          var t = utils.match(/注册时间：\s(\d\d\d\d)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})/,str,-1);

          if(t){
            var date = new Date(t[1],t[2]-1,t[3],t[4],t[5],t[6]);
            return date;
          }else{
            return null;
          }
        }

        var $ = cheerio.load(body);

        var c = $("table").eq(7).find("td").eq(1).html();
        var u = $("table").eq(6).find("img").attr("src");

        var user_index_model = {
          timestamp: new Date(),
          faceUrl :"http://"+ that.rootHost +"/"+ u,
          rank : utils.match(/用户等级：\s(\S*)/,c,1),
          group: utils.match(/用户门派：\s(\S*)</,c,1),
          money : utils.match(/用户财富：\s(\d*)/,c,1),
          exp : utils.match(/用户经验：\s(\d*)/,c,1),
          charisma: utils.match(/用户魅力：\s(\d*)/,c,1),
          essentialPosts: utils.match(/精华帖数：\s(\d*)/,c,1),
          totalPosts:utils.match(/帖数总数：\s(\d*)/,c,1),
          registerTime:_reg_time(c),
          loginTimes:utils.match(/登录次数：\s(\d*)/,c,1)
        };
      }

      callback(user_index_model);
    });
  }else{
    errorSolver.err("需要登录！");
    callback(null);
  }
};

//设置用户的资料
/*profile configs:    
profile = {
    title:*  #头衔
    Sex:* #性别 (男生为1,女生为0)
    birthyear:* #出生年
    birthmonth:* #出生月
    birthday:* #出生日
    face:* #论坛头像图片链接选择。如果没有设置自定义头像的话就使用此头像
    myface:* #自定义头像地址
    width:* # 头像宽度
    height:*,#头像高度
    userphoto:* #自定义头像（图像地址）
    groupname:* #门派
    Signature:* #个性签名 [UBB format]
    homepage:* #主页地址
    Email:* #邮箱
    OICQ:* #QQ
    msn:* #MSN 地址
    usercookies:* #
    ShowMedal:* #展示勋章
    ShowLife:* #显示生命值
    AutoPlay:* #自动播放
    EnableOWA:* #启用office web apps 功能 
    setuserinfo:* # 
    usermsgring:* #接收消息的铃声
    sendring:* #发送消息的铃声
    Submit:更  新
};
*/
cc98.prototype.settingProfile = function(profile,callback){
    var that = this;

    var profile = {
        title:profile.title || "",
        Sex:profile.Sex || 0,
        birthyear:profile.birthyear || 1990,
        birthmonth : profile.birthmonth || 1,
        birthday: profile.birthday || 1,
        face :profile.face || "",
        myface: profile.myface || "",
        width: profile.width || 120,
        height: profile.height || 120,
        userphoto: profile.userphoto || "",
        groupname: profile.groupname || "",
        Signature : profile.Signature || "",
        homepage: profile.homepage || "",
        Email:profile.Email || "",
        OICQ : profile.OICQ || "",
        msn:profile.msn || "",
        usercookies : profile.usercookies || 1,
        ShowMedal:profile.ShowMedal || 1,
        ShowLife:profile.ShowLife || 1,
        AutoPlay: profile.AutoPlay || 1,
        EnableOWA:profile.EnableOWA || 1,
        setuserinfo:profile.setuserinfo || 1,
        usermsgring:profile.usermsgring || 1, //default
        sendring:profile.sendring || 1,
        Submit:"更  新"
    };

    if(this.loginStatus == 1){

        var req_opt = {
            method:"POST",
            uri:this.rootHost + "modifyinfo.asp?action=update&userid=",
            form:profile
        };

        this.request(req_opt,function(e,r,body){
            if(e){
                errorSolver.err(e);
                callback(null);
            }else{
                callback(body);
            }
        });
    }else{
        //not login 
        errorSolver.err("需要登录！");
        callback(null);
    }
};