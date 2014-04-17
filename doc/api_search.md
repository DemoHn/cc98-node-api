# search.js

## 函数说明 

### cc98.searchPosts(keyword,page,condition,callback)

说明：根据一定的条件进行搜索，返回符合条件的帖子标题。

参数说明:

`keyword` ：搜索关键词
`page` : 搜索结果的第几页（这确实看起来很stupid，但是事实上由于98的搜索结果切换页码的时候是所有都传上去的，所以效率不会受到太大影响）
`condition` : 搜索条件。
搜索条件非常复杂，请按照以下格式来写,如果没有任何条件的话，请写 `{}` ： 

```
condition = {
    SearchDate : "", //搜索时间 ，默认为"ALL"
    boaridarea:"",
    boaridid:"",
    sType:"",
    serType:""
}

```

返回参数说明

callback : 形如 `callback(data)` 的格式，其中 `data` 为：

```
{
    timestamp : Date,
    error : String,
    result : 
    [
        {
            face: String,   //表情
            name:String,    //帖子标题
            boardid:String,  //帖子所在的版面id 
            postid:String,   //帖子的id
            author:String,   //此帖子的发帖者
            postDate:Date   //发帖时间
        },

        ...
    ]
}
```