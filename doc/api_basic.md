# CC98 API

这是一篇有关这个抓取cc98的脚本的API说明.

## 配置
1. 请运行`npm install cc98-node-api` 来安装.

## 开始

```
var _98 = require("./cc98");

var account = {
    user:, /*your user name*/
    password:, /*your password*/
    hash: /*如果能提供它的md5码的话，就写上去.这不是必要的.*/
}   
var cc98 = new _98(account);

cc98.login(function(data){
    console.log(data);
});

```
## 函数说明

### cc98.login(callback)

说明:用自己的帐号登录cc98.虽然做为一名游客,API仍就能够正常工作.
请注意自己的配置设置.

此函数会调用形如 `callback(data)` 的函数,其中data是一个json变量:

```
data = {
     status : 0 | 1 //0或1,0表示示登录,1表示已登录.
     spec   : "success" | "password error" | ERROR_CODES
}

```

```
注[1]:cc98中,对于不同类型的错误会返回不同的代码,信息如下:

 var LOGIN_SUCCESS = 9898,
      USER_NOT_EXIST = 1001,
      USER_LOCKED = 1002,
      PASSWORD_ERROR = 1003,
      USERNAME_NULL = 101,
      PASSWORD_NULL = 102,
      XMLHTTP_ERROR = 103;
```

### cc98.getBoard(callback)

说明:返回首页上各版的信息.

返回数据:形如 `callback(data)` 的格式, `data` 为以下格式的json数据:

```
{
        timestamp:new Date(),  //收到数据的时间
        board:
        [
                {
                        name:String,            //版名
                        boardid:String,         //版的boardid(用于写URL)
                        boardNumber:String,     //下属的子论坛数量
                        boardManager:String,    //版务
                        todayPosts:String,      //今日发帖量
                        totalPosts:String       //总发贴量
                },
                
                ...
        ]
}

```

### cc98.getChildBoard(boardid,callback)

说明:返回版面列表上各子版的信息.

返回数据:形如 `callback(data)` 的格式, `data` 为以下格式的json数据:

```
{
        timestamp:new Date(),  //收到数据的时间
        board:
        [
                {
                        name:String,            //版名
                        intro:String,
                        boardid:String,         //版的boardid(用于写URL)
                        hasChildBoard:Boolean,  //看看有没有子版
                        boardManager:Array,    //版务
                        todayPosts:Number,      //今日发帖量
                        totalTopics:Number      //总共话题数
                        totalPosts:Number       //总发贴量
                },
                
                ...
        ]
}
```

### cc98.getAllPostList(boardid,min_page,max_page,callback)

说明: 抓取到某个版块中所有的帖子标题信息.
参数:
`boardid` : 版块的ID.这个可以见于每个版块所对应的URL中,或者getBoard()所返回的函数.<br>
`min_page`: 抓取的最小页数.最小为1.<br>
`max_page`: 抓取的最大页数.很不幸,即使不知道这个版块有多少页,这个参数也得填.不过当你真的想把所有页都搞下来的话,写`Infinity`吧.<br>
`callback`: 是一个函数.形如`callback(data)`的格式.<br>

其中,data是一段json数据,格式如下:

```
[
        {totalPages:***,todayPosts:***,boardid:***},
        
        {
                timestamp:new Date(),
                pageNumber:***,
                
                list:
                [
                        {
                                topicName:****,
                                topicStatus:****,
                                postId:*****,
                                author:*****,
                                replyNum:****,
                                visitNum:****,
                                lastReply:new Date()
                        },

                        ...
                        
                ]
        },

        ...
]
```

### cc98.getPostInfo(boardid,postid,min_page,max_page,callback)

说明 : 把一个帖子里的所有内容给抓下来.

`boardid` : 版块的ID.这个可以见于每个版块所对应的URL中,或者getBoard()所返回的函数.这是98一个很神经的地方.这个参数必须要要.<br>
`postid`  : 这个帖子的ID.在URL中可见(形如 `ID=***` 的格式),也可以在getAllPostList()中获得.
`min_page`: 抓取的最小页数.最小为1.<br>
`max_page`: 抓取的最大页数.很不幸,即使不知道这个版块有多少页,这个参数也得填.不过当你真的想把所有页都搞下来的话,写`Infinity`吧.<br>
`callback`: 是一个函数.形如`callback(data)`的格式.<br>

其中,data是一段json数据,格式如下:

```
[
        {totalPosts:***},
        
        {
                timestamp:new Date(),
                pageNumber:***,
                
                list:
                [
                        {
                                postTime:new Date(),
                                author:****,
                                face:****,
                                subTitle:****,
                                info:****
                        },

                        ...
                        
                ]
        },

        ...
]
```

__附注:__ 这里稍微说明一下list中各参数的含义:

`postTime` : 发这个帖子的时间.<br>
`author`   : 发这个帖子的user ID.<br>
`face`     : 在98中每发一个帖子都会默认选定一个'发帖心情',默认为7.这个数字是从它的图片名字中提出来的.<br>

`subTitle` : 紧接着face后面的小标题.一般除了首楼上会发这个玩意儿之外别的楼都不会发.<br>
`info`     : 帖子的内容.注意是UBB格式.<br>


### cc98.Top10(callback)

说明:返回98的十大帖子.

返回数据:形如 `callback(data)` 的格式, `data` 为以下格式的json数据:

```
{
        timestamp:new Date(),  //收到数据的时间
        posts:
        [
                {
                            rank:Number,  //排名
                            name:String,  //帖子标题
                            author:String, //作者
                            boardid:"", //帖子所属板块ID
                            postid:"", //帖子ID
                            postTime:Date, //发贴时间
                            focus:"", //关注人数
                            replyPosts:"", //回帖数
                            hit:""  //点击
                },
                
                ...
        ]
}

```
