var config  = require("../config");
var utils   = require("./utils.js");
var errorSolver = require("../errorSolver");
var request = require("request");
var cheerio = require("cheerio");
var iconv   = require("iconv-lite");
var qs      = require("querystring");
var url     = require("url");

var cc98    = require("./basic");

cc98.prototype.readMyProfile = function(callback){
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

        var f_url = "";

        if(/file\.cc98\.org/.test(u) == true){
          // 自定义上传的图片
          f_url = u;
        }else{
          f_url = "http://" + this.rootHost + "/" + u;
        }

        user_index_model = {
          timestamp: new Date(),
          faceUrl :f_url,
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

cc98.prototype.readUserProfile = function(mode,param,callback){

  var url_c = "";
  if("mode" == "id"){
    url_c = "id";
  }else if("mode" == "name"){
    url_c = "name";
  }else{
    url_c = "name";
  }

  var that = this;
  if(this.loginStatus == 1){
    var req_opt = {
      method:"GET",
      uri :"http://"+this.rootHost +"/dispuser.asp?" + url_c + "=" + param
    };

    var user_index_model = {};
    this.request(req_opt,function(e,req,body){
      if(e){
        errorSolver.err(e);
        callback();
      }else{

        var $ = cheerio.load(body);
        console.log($("table").eq(5).find("td").eq(6).html());

        var c = $("table").eq(5).find("td").eq(3).html();
          var u = $("table").eq(5).find("td").eq(2).find("img").eq(0).attr("src");
        var p = $("table").eq(5).find("td").eq(6).html();
        var f_url = "";

        if(/file\.cc98\.org/.test(u) == true){
          // 自定义上传的图片
          f_url = u;
        }else{
          f_url = "http://" + this.rootHost + "/" + u;
        }

        user_index_model = {
          timestamp: new Date(),
          faceUrl :f_url,
          title: utils.match(/用户头衔：\s*(\S*)</,c,1),
          rank : utils.match(/用户等级：\s*(\S*)</,c,1),
          group: utils.match(/用户门派：\s*(\S*)</,c,1),
          essentialPosts: utils.match(/精华帖数：\s(\d*)/,c,1),
          registerDate:utils.matchTime(utils.match(/注册时间：\s(.*)/,c,1)),
          deletedPosts:utils.match(/被删主题：\s(\d*)/,c,1),
          totalPosts: utils.match(/帖数总数：\s(\d*)/,c,1),
          loginTimes:utils.match(/登录次数：\s(\d*)/,c,1),
          lastLogin:utils.matchTime(utils.match(/最后登录：\s(.*)/,c,1)),

          /*personal informations*/
          sex:utils.match(/性 别： (.*?)</,p,1)
          //TODO finish personal informations module
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
  [userID]: 如果能提供自己的userID的话最好，不能的话就算了
};
*/
cc98.prototype.settingProfile = function(profile,callback){
    var that = this;

    var profiles = {
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
        EnablePopup:profile.EnablePopup || 1,
        Submit:"更  新"
    };

    if(this.loginStatus == 1){
      //get user id
      var that = this;

      if(this.userID != undefined){
        _set_profile(this.userID);
      }else{

        //先get再说
        _get_userID(function(uid){
          _set_profile(uid);
        });
      }

      function _get_userID(callback){
        var req_opt = {
          method:"GET",
          uri:"http://" + that.rootHost + "/modifyinfo.asp"
        };
        that.request(req_opt,function(e,r,body){
          if(e){
            errorSolver.err(e);
          }else{
            var $ = cheerio.load(body);
            var wid = $("form").attr("action");
            if(/[0-9]+$/.test(wid) == true){
              callback(/[0-9]+$/.exec(wid)[0]);
            }else{
              callback(0);
            }
          }
        });
      };

      function _set_profile(userid){
        var req_opt = {
          method:"POST",
          uri:"http://" + that.rootHost + "/modifyinfo.asp?action=update&userid="+userid,
          form:profiles
        };

        that.request(req_opt,function(e,r,body){
          if(e){
            errorSolver.err(e);
            callback(null);
          }else{
            callback(body);
          }
        });
      };

    }else{
        //not login
        errorSolver.err("需要登录！");
        callback(null);
    }
};
