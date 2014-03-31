var config  = require("../config");
var errorSolver = require("../errorSolver");

var request = require("request");
var cheerio = require("cheerio");
var crypto  = require("crypto");
var iconv   = require("iconv-lite");
var qs      = require("querystring");
var url     = require("url");
var async   = require("async");

var utils   = require("./utils.js");

var cc98    = require("./basic");

//user.js 命名规范：
// 凡是进行读取操作的，都以read打头，如 readMailbox;
// 凡是进行提交数据操作的，都以send打头,如sendMessage;
//
// 98 读站短列表
cc98.prototype.readMailbox = function(page,callback){
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

          if(index >= 2 && index <= len -2){
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

cc98.prototype.readUserIndex = function(callback){
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
        var $ = cheerio.load(body);

        var c = $("table").eq(7).find("td").eq(1).html();
        var user_index_model = {
          timestamp: new Date(),
          faceUrl : "", //头像链接
          rank : utils.match(/用户等级：\s(\S*)/,c,1),
          group: utils.match(/用户门派：\s(\S*)</,c,1),
          money : utils.match(/用户财富：\s(\d*)/,c,1),
          exp : utils.match(/用户经验：\s(\d*)/,c,1),
          charisma: utils.match(/用户魅力：\s(\d*)/,c,1),
          essentialPosts: utils.match(/精华帖数：\s(\d*)/,c,1),
          totalPosts:utils.match(/帖数总数：\s(\d*)/,c,1),
          registerTime:utils.match(/注册时间：\s(\d*)/,c,1),//TODO modify register time
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

module.exports = cc98;