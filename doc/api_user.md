# user.js

## 函数说明 

### cc98.readMailBox(page,callback);

说明： 读取自己用户站短列表（需要登录！）

参数说明： 
 `page`: 读取收件箱的第几页

 返回值说明 ：

 返回 `callback(data)` ,其中 `data` 为：
```
{
    timestamp: Date,
    mailbox :
    [
        {
            status: 0 || 1,  //消息的读取状态。 0 为未读，1为已读
            sender: String, //消息的发件人 
            mailID: String, //邮件ID
            topic: String,  //消息发送的主题
            date: Date, //发送时间
            size: String //消息的大小
        },
        
        ...
    ]
}
```

### cc98.readMessage(mail_id,callback);

说明：读取某一条站短。（需要登录！）

参数说明： 
 `mail_id`: 站短的ID

返回值说明 ：

 返回 `callback(data)` ,其中 `data` 为：
```
{
    timestamp: Date,    //抓取当前数据所在的时间戳
    sender: String,     //发送者
    title: String,      //站短标题
    content: String,    //发送内容
    sendDate: Date      //发送日期
}

```

### cc98.sendMessage(content,callback)

说明：向指定的联系人发送一条站短。(不想说了，必然要登录！)

参数说明：
`content`是一个json数据，具体如下：
```
content = {
    touser: String,     //收件人的名字
    title: String,      //站短标题
    message: String     //站短内容
}
```

返回值：

`callback(data)`,其中 `data` 为：

1 : 发送成功
0 : 发送失败
null : 在发送的过程中间发生了什么错误


### cc98.sendNewPost(content,callback)

说明：发表新的帖子。

参数说明：
`content`是一个json数据，具体如下：
```
content = {
    boardid: String,     //发表帖子所在的板块名称
    subject: String,      //主题
    expression: String     //心情，用数字表示
    content: String,        //内容(UBB格式)
    signflag : "yes" || "no" //显示qmd(默认是yes)
}
```

返回值：

`callback(data)`,其中 `data` 为：

1 : 发送成功
0 : 发送失败
null : 在发送的过程中间发生了什么错误


### cc98.sendFastReply(content,callback)

说明：回复某个帖子(快速回复)。

参数说明：
`content`是一个json数据，具体如下：
```
content = {
    postID: String,     //帖子所在板块的名称
    boardid: String,    //所在板块的名称
    expression: String     //心情，用数字表示
    content: String,        //内容(UBB格式)
    signflag : "yes" || "no" //显示qmd(默认是yes)
}
```

返回值：

`callback(data)`,其中 `data` 为：

1 : 发送成功
0 : 发送失败
null : 在发送的过程中间发生了什么错误


### cc98.customizeBoard(boardid,callback)

说明： 个人定制版块