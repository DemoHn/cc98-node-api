# user_profile.js

## 函数说明 

### cc98.readMyIndex(callback);

说明： 读取用户的信息(自己)

返回值说明 ：

返回 `callback(data)` ,其中 `data` 为：

```
{
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
}
```

### cc98.settingProfile(profile,callback);

说明：用户信息设置。（需要登录！）

参数说明： 
 `profile`: 欲修改的参数

```
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
}
```

返回值说明 ：

返回 `callback(data)` 
