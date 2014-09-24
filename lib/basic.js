var config = require("../config");
var errorSolver = require("../errorSolver");

var request = require("request");
var cheerio = require("cheerio");
var crypto = require("crypto");
var iconv = require("iconv-lite");
var qs = require("querystring");
var url = require("url");
var utils = require("./utils.js");
var async = require("async");

var cc98 = function(user_config) {
  var that = this;
  var req = request.defaults({
    jar: true
  });
  var _cookie = req.jar();

  this.request = req;

  this.rootHost = "www.cc98.org";

  this.cookie = _cookie;
  this.loginStatus = 0; //0表示未登录,1表示已登录

  if (user_config != undefined) {
    this.user = user_config.user || "";
    this.password = user_config.password || "";
    this.hash = user_config.hash || "";
  }

  this.configure(config);

  _checkCookie();

  function _checkCookie() {
    //    console.log(this.cookie);
  }
};

cc98.prototype.configure = function(config) {
  this.rootHost = config.defaults.root;
  this.UserAgent = config.defaults["User-Agent"];
  this.CookieFile = config.CookieFile;
};

cc98.prototype.login = function(callback) {
  //这份返回值列表可以从hhtp://www.cc98.org/js/common.js中找到
  var that = this;
  var LOGIN_SUCCESS = 9898,
    USER_NOT_EXIST = 1001,
    USER_LOCKED = 1002,
    PASSWORD_ERROR = 1003,
    USERNAME_NULL = 101,
    PASSWORD_NULL = 102,
    XMLHTTP_ERROR = 103;

  // 设置返回值格式：
  //status 0 or 1
  //spec  详细说明
  var return_data = {
    status: 0,
    spec: ""
  };

  var hash = crypto.createHash("md5");
  var hash_result = "";
  if (this.password !== "" && this.password != undefined) {
    hash.update(this.password);
    hash_result = hash.digest("hex");
  }

  var h_result = "";
  if (this.hash != undefined && this.hash != "") {
    h_result = this.hash;
  } else {
    h_result = hash_result;
  }

  var req_opt = {
    method: "POST",
    uri: "http://" + this.rootHost + "/sign.asp",
    form: {
      "a": "i",
      "p": h_result,
      "u": this.user,
      "userhidden": 2
    }
  };

  if (this.loginStatus == 0) {
    this.request(req_opt, function(e, r, body) {

      if (e) {
        errorSolver.err(e);
      }

      return_data.timestamp = new Date();
      if (body == LOGIN_SUCCESS) {
        that.loginStatus = 1;
        return_data.status = 1;
        return_data.spec = "success!";
      } else if (body == PASSWORD_ERROR) {
        that.loginStatus = 0;
        return_data.status = -1;
        return_data.spec = "password error!";

      } //TODO to fullfill all the situations
      else {
        that.loginStatus = 0;
        return_data.spec = body;
        return_data.status = body;
      }
      if (r != undefined) {
        if (r.headers['set-cookie'] != null) {
          that.cookie = r.headers['set-cookie'];
        }
      }
      callback(return_data);
    });
  } else {
    callback({
      status: 2,
      spec: "已登录！"
    });
  }
};

cc98.prototype.getBoard = function(callback) {
  var that = this;
  var req_opt = {
    method: "GET",
    uri: "http://" + this.rootHost + "/",
    jar: this.cookie
  };

  var board_model = {
    timestamp: new Date(1970, 1, 1),
    board: [] // board_infos
  };

  var board_info = {
    name: "",
    boardid: "",
    boardNumber: "",
    boardManager: "", //版务
    todayPosts: "", //今日发帖量
    totalPosts: "" //总发帖量
  };

  this.request(req_opt, function(e, r, body) {

    if (e) {
      errorSolver.err(e);
      callback();
    } else {
      var $ = cheerio.load(body);
      var alt = that.loginStatus ? 1 : 2; // TODO solve the problem of parse error if not login
      var board_main = $("table.tableBorder1").eq(alt).find("tr table");
      board_main.each(function(index, elem) {

        var href = $(elem).find("a").attr("href");
        board_info = {
          boardid: url.parse(href).query.match(/(?!boardid=)[0-9]+/)[0],
          name: $(elem).find("a > span").text(),
          boardNumber: $(elem).find("span").eq(1).text(),
          boardManager: $(elem).find("a").eq(1).text(),
          todayPosts: $(elem).find("span").eq(3).text(),
          totalPosts: /[0-9]+/.exec($(elem).find("td").eq(3).text())[0],
          hasChildBoard:true
        };
        board_model.board.push(board_info);
      });
      board_model.timestamp = new Date();
      callback(board_model);
    }
  });
};

//得到子板块列表
cc98.prototype.getChildBoard = function(
  boardid,
  callback) {
  var req_opt = {
    method: "GET",
    uri: "http://" + this.rootHost + "/list.asp?boardid=" + boardid,
    jar: this.cookie
  };

  var board_model = {
    timestamp: new Date(1970, 1, 1),
    board: [] // board_infos
  };

  var board_info = {
    name: "",
    intro: "", //子版简介
    boardid: "",
    hasChildBoard: false,
    boardManager: [], //版务,可能有多位
    todayPosts: "", //今日发帖量
    totalPosts: "" //总发帖量
  };

  this.request(req_opt, function(e, r, body) {

    if (e) {
      errorSolver.err(e);
      callback();
    } else {
      var $ = cheerio.load(body);

      var board_main = $("table.tableBorder1").eq(0).find("tr table");
      board_main.each(function(index, elem) {

        //以数组形式获得版主名字
        function _getManager() {
          var m_array = [];

          var info = $(elem).find("td").eq(2).find("td").eq(4).find("a");

          info.each(function(index, elem) {
            m_array.push(utils.convert($(elem).text()));
          });
          return m_array;
        }

        function _hasChildBoard() {
          var info = $(elem).find("td").eq(2).find("a").parent().find("span").eq(1).html();
          return info == null ? false : true;
        }

        if (index % 3 === 0) {

          board_info = {
            boardid: $(elem).find("td").eq(2).find("a").attr('href').match(/[0-9]+/) + "",
            name: utils.convert($(elem).find("td").eq(2).find("a span").html()),
            intro: utils.convert(utils.trim($(elem).find("td").eq(2).find("td").eq(3).text())),
            hasChildBoard: _hasChildBoard(),
            boardManager: _getManager(),
            todayPosts: Number($(elem).find("td").eq(2).find("img[src='pic/Forum_today.gif']").parent().text()),
            totalTopics: Number($(elem).find("td").eq(2).find("img[src='pic/forum_topic.gif']").parent().text()),
            totalPosts: Number($(elem).find("td").eq(2).find("img[src='pic/Forum_post.gif']").parent().text())
          };

          board_model.board.push(board_info);
        }
      });
      board_model.timestamp = new Date();
      callback(board_model);
    }
  });
};

// 得到一个板块内所有的帖子列表
cc98.prototype.getAllPostList = function(
  boardid,
  min_page,
  max_page,
  callback) {

  var that = this;
  var json_url = {
    protocol: "http",
    host: that.rootHost,
    pathname: "list.asp",
    query: {
      boardid: boardid,
      page: 1 //默认为1,在后来的操作中会修改
    }
  };


  // 每一页的数据模型
  var page_list_model = {
    timestamp: new Date(1970, 1, 1),
    pageNumber: 1,
    list: []
  };

  var page_list_spec = {
    topicName: "",
    topicStatus: "",
    postId: "",
    boardId:"", // 帖子所在的板块列表．有的帖子所在的板块并不是抓取的所在板块（如全站置顶帖）
    author: "",
    replyNum: "",
    visitNum: "",
    lastReply: ""
  };
  // 从第一页抓取到的数据
  var first_page_info = {
    totalPages: 0,
    todayPosts: 0,
    totalPosts: 0,
    boardid: boardid
  };

  var _FirstPageInfo = function(callback) {
    var req_opt = {
      method: "GET",
      uri: url.format(json_url)
    };
    that.request(req_opt, function(e, r, body) {
      if (e) {
        errorSolver.err(e);
        callback();
      } else {
        var $ = cheerio.load(body);
        /*页面总信息的读取*/
        first_page_info.totalPages = $("form[name=batch]").next().find("td b").eq(1).html();
        first_page_info.todayPosts = $("font[color=#FF0000]").html(); //第一个红字
        first_page_info.totalPosts = utils.trim($("form[name=batch]").next().find("td b").eq(3).html());
        callback(first_page_info);
      }
    });
  };

  var _getPage = function(page_number, callback) {
    json_url.query.page = page_number;

    var req_opt = {
      method: "GET",
      uri: url.format(json_url)
    };
    // 每一页的数据模型
    var page_list_model = {
      timestamp: new Date(1970, 1, 1),
      pageNumber: 1,
      list: []
    };
    that.request(req_opt, function(e, r, body) {
      if (e) {
        page_list_model.timestamp = new Date();
        page_list_model.pageNumber = page_number;
        callback(page_list_model);
      }
      var $ = cheerio.load(body);

      var post_main = $("form[name=batch] tr");
      var reg_reply = /([0-9]+)\s?\/\s?([0-9]+)/;

      post_main.each(function(index, elem) {
        var reply_text = $(elem).find("td").eq(3).text();
        var reply_time = $(elem).find("td").eq(4).text();
        var href = $(elem).find("td").eq(1).find("a").attr("href");

        /*第一个和第二个都是标题*/
        if (index >= 3) {
          /* <tr> 里有5个<td>标签,其中第1个表示帖子状态,第二个表示题目,第三个是作者,第四个是回复,第五个是最后更新*/
          var reply_number = "";
          var visit_number = "";
          var reply_timestamp = "";
          var reg_time = /\d\d\d\d\/\d{1,2}\/\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}/;
          var reply_str = $("form[name=batch]").find("script").eq(index - 3).text();
          if (reg_reply.test(reply_text) === true) {
            reply_number = reg_reply.exec(reply_text)[1];
            visit_number = reg_reply.exec(reply_text)[2];
          }

          if (reg_time.test(reply_time) === true) {
            reply_timestamp = reply_time.match(reg_time)[0];
          }
          page_list_spec = {
            topicName: $(elem).find("td").eq(1).find('a span').text(),
            topicStatus: $(elem).find("td").eq(0).find('span').attr("title"),
            boardId: url.parse(href).query.match(/(boardID=)[0-9]+(&)/i)[0],
            postId: url.parse(href).query.match(/(?![0-9]+&ID=)[0-9]+/i)[0],
            author: $(elem).find("td").eq(2).find('a').text(),
            replyNum: reply_number,
            visitNum: visit_number,
            lastReply: utils.matchTime(reply_timestamp),
            replier: utils.match(/"usr":"(.+?)"/, reply_str, 1)
          };
          page_list_model.list.push(page_list_spec);
        }
      });

      page_list_model.timestamp = new Date();
      page_list_model.pageNumber = page_number;
      callback(page_list_model);
    });
  };

  _FirstPageInfo(function(data) {
    var tmp_list = [];

    max_page = max_page > data.totalPages ? data.totalPages : max_page;
    for (var j = min_page; j <= max_page; j++) {
      tmp_list.push(j);
    }

    var final_pages = [];
    final_pages.push(data);
    async.each(tmp_list, function(li, callback) {
      _getPage(li, function(data) {
        final_pages.push(data);
        callback();
      });
    }, function(err) {
      if (err) {
        errorSolver.err(err);
      }
      callback(final_pages);
    });
  });
};

cc98.prototype.getPostInfo = function(
  boardid, /*帖子所在的boardid*/
  postid, /*帖子的id*/
  min_page,
  max_page,
  callback) {

  //发帖心情
  //cc98在每发一个帖子之前都会要求发一个心情(也就是帖子前面的那个小图标)
  //不过现在看来大家都喜欢用7号图标,也就是什么都没有~~
  var that = this;
  var _page_number;
  var json_url = {
    protocol: "http",
    host: that.rootHost,
    pathname: "dispbbs.asp",
    query: {
      boardid: boardid,
      id: postid,
      replyID: postid,
      star: 1
    }
  };
  // 每一页的数据模型
  var page_list_model = {
    timestamp: new Date(1970, 1, 1),
    pageNumber: 1,
    list: []
  };

  var page_list_spec = {
    author: "",
    postTime: "",
    face: "",
    subTitle: "",
    info: "",
    qmd: ""
  };

  var user_spec = {

  };
  // 从第一页抓取到的数据
  var first_page_info = {
    totalPosts: 0
  };
  /*得到了页面的总数.注意,在这个函数运行后才能写下来最多页面是多少*/
  var _getMaxPageNumber = function(callback) {
    var req_opt = {
      method: "GET",
      uri: url.format(json_url)
    };
    that.request(req_opt, function(e, r, body) {
      if (e) {
        callback();
      } else {
        var $ = cheerio.load(body);
        first_page_info.totalPosts = $("span#topicPagesNavigation b").html();

        var postsNumber = $("span#topicPagesNavigation b").html();

        if (first_page_info.totalPosts == null) {
          errorSolver.warning("当前页面总数没有成功读取.");
          callback();
        } else {
          callback(postsNumber);
        }
      }
    });
  };

  var _getPage = function(page_number, callback) {

    var page_list_model = {
      timestamp: new Date(1970, 1, 1),
      pageNumber: 1,
      list: []
    };

    json_url.query.star = page_number;
    var req_opt = {
      method: "GET",
      uri: url.format(json_url)
    };
    that.request(req_opt, function(e, r, body) {
      if (e) {
        page_list_model.timestamp = new Date();
        page_list_model.pageNumber = page_number;
        callback(page_list_model);
      }
      var $ = cheerio.load(body);

      var post_main = $("body table");
      // 搜索具体的信息
      var post_time_array = [];

      $("body").find("a").each(function(index, elem) {
        /*通过查看ip的链接来进行发帖时间的跟踪操作*/
        var href_ip = $(elem).attr("href");
        /*这里要注意的是,抓包下来的时间格式和我们在网上见到的不是一回事*/
        var timestamp_reg = /\d\d\d\d\/\d{1,2}\/\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}/;
        /*用了些黑科技,因为已知在"查看链接"的那个标签的旁边就是我们想要的时间数据*/
        if (/look_ip.asp/.test(href_ip) === true) {
          if ($(elem).parent().html().match(timestamp_reg) != undefined) {
            post_time_array.push($(elem).parent().html().match(timestamp_reg)[0]);
          }
        }
      });

      /*qmd并没有包括在页面里边，而是单独拎出来的，因此要通过ubbcode的id对某楼层是否有qmd进行判断。
       see issue#1
      */
      function calc_qmd() {
        var qmds = $("table.tableborder1 article span");
        var prev = 1;
        var cursor = 0;
        var status_arr = []; //0表示该楼没有qmd,1表示有qmd

        /*只能判断1-9楼，10楼不能判断*/
        qmds.each(function(index, elem) {
          var ID = +$(elem)[0]["attribs"]["id"].match(/[0-9]+/).toString();

          if (index > 0) {
            if (ID - prev == 2) {
              status_arr[cursor] = 1;
              cursor += 1;
              prev = ID;
            } else if (ID - prev == 1) {
              status_arr[cursor] = 0;
              cursor += 1;
              prev = ID;
            }
          }
        });

        var QMD = $("div.userQmd span");
        var last_QMD = QMD.eq(QMD.length - 1);
        var last_ID = +last_QMD[0]["attribs"]["id"].match(/[0-9]+/).toString();

        if(last_ID == prev +1){
          status_arr[cursor] = 1;
        }else{
          status_arr[cursor] = 0;
        }
        /*返回每一楼是否有qmd*/
        return status_arr;
      }

      function display_qmd(index,status_arr,elem){
        var ii =0;
        for(var j =0;j<index;j++){
          if(status_arr[j] == 1){
            ii += 1;
          }
        }
        var result_txt = $(elem).parents().find("div.userQmd span").eq(ii - 1).text();
        if(status_arr[index - 1] == 0){
          return null;
        }else{
          return result_txt;
        }
      }

      function _handle_URL(url){
        if(/http(s*):\/\//.test(url) == true){
          return url;
        }else{
          return "http://"+that.rootHost+"/"+url;
        }
      };

      var post_info_main = $("table.tableborder1");
      var qmd_arr = calc_qmd();
      post_info_main.each(function(index, elem) {

        var reg_face_pic = /[0-9]+/;
        var str_face_pic = $(elem).find("article img").attr("src");
        if (reg_face_pic.test(str_face_pic) != false) {
          str_face_pic = str_face_pic.match(reg_face_pic)[0];
        }

        /*第0个是无价值的信息*/
        if (index >= 1 && index <= post_time_array.length) {
          page_list_spec = {
            postTime: utils.matchTime(post_time_array[index - 1]),
            author: $(elem).find("a b").text(),
            authorFaceURL: _handle_URL($(elem).find("a img").eq(0).attr('src')),
            face: str_face_pic,
            subTitle: utils.trim($(elem).find("article b").text()),
            info: $(elem).find("article span").text(),
            qmd: display_qmd(index,qmd_arr,elem),
            replyID: utils.match(/replyID=(\d*)/i, $(elem).find("input").val(), 1)
          };
          page_list_model.list.push(page_list_spec);
        }

      });

      page_list_model.timestamp = new Date();
      page_list_model.pageNumber = page_number;
      callback(page_list_model);
    });
  };

  _getMaxPageNumber(function(postsNumber) {
    var tmp_list = [];
    postsNumber = Math.floor(postsNumber / 10) + 1;
    max_page = max_page > postsNumber ? postsNumber : max_page;

    for (var j = min_page; j <= max_page; j++) {
      tmp_list.push(j);
    }

    var final_pages = [];
    final_pages.push(first_page_info);
    async.each(tmp_list, function(li, callback) {
      _getPage(li, function(data) {
        final_pages.push(data);
        callback();
      });
    }, function(err) {
      if (err) {
        errorSolver.err(err);
      }
      callback(final_pages);
    });
  });
};


//98十大
cc98.prototype.Top10 = function(
  callback) {
  var req_opt = {
    method: "GET",
    uri: "http://" + this.rootHost + "/hottopic.asp",
    jar: this.cookie
  };

  var posts_model = {
    timestamp: new Date(1970, 1, 1),
    posts: [] // 十大的帖子
  };

  var posts_info = {
    rank: 1, //排名
    name: "",
    author: "",
    boardid: "", //帖子所属板块ID
    postid: "", //帖子ID
    postTime: new Date(1970, 1, 1), //发贴时间
    focus: "", //关注人数
    replyPosts: "", //回帖数
    hit: "" //点击
  };

  this.request(req_opt, function(e, r, body) {

    if (e) {
      errorSolver.err(e);
      callback();
    } else {
      var $ = cheerio.load(body);

      var _main = $("table.tableBorder1").eq(0).children();
      _main.each(function(index, elem) {

        function _parselink(uri) {
          if (uri) {
            var qs = url.parse(uri, true, true);
            return {
              boardid: qs.query.boardid,
              postid: qs.query.id
            };
          } else {
            return {
              boardid: null,
              postid: null
            };
          }
        }

        if (index >= 1 && index <= 10) {

          posts_info = {
            rank: index,
            name: $(elem).find("table a font").html(),
            author: $(elem).find("table a").eq(2).html(),
            boardid: _parselink($(elem).find("table a").attr("href")).boardid,
            postid: _parselink($(elem).find("table a").attr("href")).postid,
            postTime: new Date($(elem).find("table span").attr("title")),
            focus: $(elem).children().eq(2).html(),
            replyPosts: $(elem).children().eq(3).html(),
            hit: $(elem).children().eq(4).html()
          };
          posts_model.posts.push(posts_info);
        }
      });
      posts_model.timestamp = new Date();
      callback(posts_model);
    }
  });
};


//require data
var board_tree = require("../data/board.tree.json");
var board_list = require("../data/board.list.json");

cc98.prototype.data = {
  boardTree: board_tree,
  boardList: board_list
};

// global variable
cc98.data = {
  boardTree: board_tree,
  boardList: board_list
};

module.exports = cc98;

require("./search.js");
require("./user.js");
require("./user_profile.js");
require("./upload.js");
