var config  = require("../config");
var errorSolver = require("../errorSolver");

var request = require("request");
var cheerio = require("cheerio");
var crypto  = require("crypto");
var iconv   = require("iconv-lite");
var qs      = require("querystring");
var url     = require("url");

var utils   = require("./utils.js");

var cc98    = require("./basic");

//user.js 命名规范：
// 凡是进行读取操作的，都以read打头，如 readMailbox;
// 凡是进行提交数据操作的，都以send打头,如sendMessage;
//
// 98 读站短列表
cc98.prototype.readMailBox = function(page,callback){
  page = page || 1;
  if(this.loginStatus == 1){
    var req_opt = {
      method:"GET",
      uri :"http://"+this.rootHost +"/usersms.asp?action=inbox&page="+page
    };

    var mailbox_model = {
      timestamp: new Date(1970,1,1),
      mailbox:[]
    };

    var mailbox_info = {
      status : 0, // 0为未读，1为已读
      sender : "", //　发件人
      mailID : "", //站短的ID
      topic : "",
      date : new Date(), //发送日期
      size : 0 //邮件大小
    };

    this.request(req_opt,function(e,req,body){
      if(e){
        errorSolver.err(e);
        callback();
      }else{

        function _judge_is_read(string){
          string = string || "";
          if(/m_olds/.test(string) === true){
            return 1; //已读
          }else if(/m_news/.test(string) === true){
            return 0; //未读
          }else{
            return -1; //出错了
          }
        }


        var $ = cheerio.load(body);

        //站短主表格
        var table = $("table.tableborder1").eq(2).find("tr");
        var len = table.length;
        table.each(function(index,elem){

          if(index >= 2 && index <= len-2){
            mailbox_info =
              {
                status:_judge_is_read($(elem).find("td").eq(0).find("img").attr("src")),
                sender:$(elem).find("td").eq(1).find("a").text(),
                mailID:utils.match(/id=([0-9]*)/,$(elem).find("td").eq(2).find("a").attr("onclick"),1),
                topic:$(elem).find("td").eq(2).find("a").text(),
                date:$(elem).find("td").eq(3).text(),
                size:$(elem).find("td").eq(4).text()
              };
            mailbox_model.mailbox.push(mailbox_info);
          }
        });

        mailbox_model.timestamp = new Date();
        callback(mailbox_model);
      }
    });
  }else{
    errorSolver.err("需要登录！");
    callback(null);
  }
};

//读站短
cc98.prototype.readMessage = function(mail_id,callback){
  mail_id = mail_id || 100;
  if(this.loginStatus == 1){
    var req_opt = {
      method:"GET",
      uri :"http://"+this.rootHost +"/messanger.asp?action=read&id="+mail_id
    };

    var mail_model = {
      timestamp: new Date(1970,1,1),
      sender:"",
      title : "",
      content : "",
      sendDate : new Date() //发送日期
    };

    this.request(req_opt,function(e,req,body){
      if(e){
        errorSolver.err(e);
        callback();
      }else{

        var $ = cheerio.load(body);
        var table = $("table.tableborder1").eq(0);

        var _title = utils.match(/：(.*)$/,table.find("td").eq(2).find("b").eq(0).html(),1);

        function _reg_time(str){
          if(str){
            var t = utils.match(/(\d\d\d\d)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})/,str,-1);

            var date = new Date(t[1],t[2]-1,t[3],t[4],t[5],t[6]);
            return date;
          }else{
            return null;
          }
        }

        mail_model = {
          timestamp:new Date(),
          sender:table.find("td").eq(1).find("b").eq(1).html(),
          title:_title,
          content:table.find("td").eq(2).find("span").eq(0).html(),
          sendDate:_reg_time(table.find("td").eq(1).find("b").eq(0).html())
        };
        callback(mail_model);
      }
    });
  }else{
    errorSolver.err("需要登录！");
    callback(null);
  }
};


//send post instances
//发站短
/*
content:{
  touser : [收件人，用名字],
  title : **,
  message:**
}
*/
cc98.prototype.sendMessage = function(content,callback){
  var that = this;
  if(this.loginStatus == 1){

    //get password from cookie
    function _get_pwd(cookie){
      var cookie = cookie + ""; //stringify
      if(cookie){
        var reg_pwd = /password=([0-9a-eA-e]+)/;
        if(reg_pwd.test(cookie) == true){
          return reg_pwd.exec(cookie)[1];
        }else{
          return null;
        }
      }
    };

    var boardid = content.boardid || 100;
    var form = {
        font:"", // I don't how to use it....
        touser: content.touser,
        title:content.title,
        message:content.message
    };

    var req_opt = {
      method:"POST",
      uri :"http://"+this.rootHost +"/messanger.asp?action=send",
      form : form,
      headers :{
        Referer:"http://"+this.rootHost +"/messanger.asp?action=new",
        "User-Agent":this.UserAgent
      }
    };

    var req = this.request(req_opt,function(e,r,body){
    //  console.log(r.headers);
      if(e){
        errorSolver.err(e);
        callback(null);
      }else{
        callback(body);
      }
    });
  }else{
    errorSolver.err("需要登录！");
    callback(null);
  }
};

//发表新帖
/*
 * content = {
 *   boarid: "",
 *   subject:"",
 *   expression:"",
 *   content:"",
 *   signflag:yes || no
 * }
 * */
//TODO to valid sendNewPost module
cc98.prototype.sendNewPost = function(content,callback){
  var that = this;
  if(this.loginStatus == 1){

    //get password from cookie
    function _get_pwd(cookie){
      var cookie = cookie + ""; //stringify
      if(cookie){
        var reg_pwd = /password=([0-9a-eA-e]+)/;
        if(reg_pwd.test(cookie) == true){
          return reg_pwd.exec(cookie)[1];
        }else{
          return null;
        }
      }
    };
    var boardid = content.boardid || 100;
    var form = {
        upfilename : "",
        username : this.user,
        passwd : _get_pwd(this.cookie),
        subject : content.subject || "Untitled subject",
        Expression : "face" +content.expression +".gif" || "face7.gif",
        Content : content.content || "",
        signflag : content.signflag || "yes"
    };

    var req_opt = {
      method:"POST",
      uri :"http://"+this.rootHost +"/SaveAnnounce.asp?boardID="+boardid,
      form : form,
      headers :{
        Referer:"http://"+this.rootHost +"/SaveAnnounce.asp?boardID="+boardid,
        "User-Agent":this.UserAgent
      }
    };

    var req = this.request(req_opt,function(e,r,body){
    //  console.log(r.headers);
      if(e){
        errorSolver.err(e);
        callback(null);
      }else{
        //when succeed,it will return nothing
        if(body == ""){
          callback(1);
        }else{
        //xo  console.log(body);
          callback(0);
        }
      }
    });
  }else{
    errorSolver.err("需要登录！");
    callback(null);
  }
};

// fast reply
/* content :{
    postID : * [??],
    boardid: *,
    expression : 7 [??],
    content: ****,
    signflag: "yes" || "no"
}*/
cc98.prototype.sendFastReply = function(content,callback){
  var that = this;
  if(this.loginStatus == 1){

    //get password from cookie
    function _get_pwd(cookie){
      var cookie = cookie + ""; //stringify
      if(cookie){
        var reg_pwd = /password=([0-9a-eA-e]+)/;
        if(reg_pwd.test(cookie) == true){
          return reg_pwd.exec(cookie)[1];
        }else{
          return null;
        }
      }
    };

    var boardid = content.boardid || 100;
    var form = {
        followup : content.postID,
        RootID : content.postID,
        UserName : this.user,
        passwd : _get_pwd(this.cookie),
        Expression : "face" +content.expression +".gif" || "face7.gif",
        Content : content.content || "",
        signflag : content.signflag || "yes"
    };

    var req_opt = {
      method:"POST",
      uri :"http://"+this.rootHost +"/SaveReAnnounce.asp?method=fastreply&boardID="+boardid,
      form : form,
      headers :{
        Referer:"http://"+this.rootHost +"/SaveReAnnounce.asp?method=fastreply&boardID="+boardid,
        "User-Agent":this.UserAgent
      }
    };

    var req = this.request(req_opt,function(e,r,body){
    //  console.log(r.headers);
      if(e){
        errorSolver.err(e);
        callback(null);
      }else{
        callback(body);
      }
    });
  }else{
    errorSolver.err("需要登录！");
    callback(null);
  }
};

module.exports = cc98;
