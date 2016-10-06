/**
 * Created by Minexieyu on 2016/10/5.
 */
var express=require("express");//创建服务器的
var session=require("express-session");//session
var mysql=require("mysql");//操作数据库
var fs=require("fs");//操作文件或目录的
var bodyparser=require("body-parser");//处理请求的
var multer=require("require");//处理文件上传的

var app=express();//创建一个应用程序

//配置和使用body-parser中间件
app.use(bodyparser.urlencoded({extended:false}));

//配置和使用session中间件
app.use(session({
    secret:'keyboard cat',// 私密 session id的标识
    resave:true,//每次请求是否重新设置session cookie，意思是浏览页面，过晚了59秒，如果在再新一次页面，过期时间重新计算
    saveUninitialized:true,//session cookie 默认值为connect.sid
    cookie:{secure:false,maxAge:1000*60*20}//maxAge:意思是过期时间为20分钟 最大失效时间  secure:用于https
    //secure为true是时，cookie在http中无效 在https中才有效
}));

var fileUploadPath="/page/pic";//存入服务器的路径
var fileUploadPathData="/pic";//存入数据库中路径，主要要除掉static中的路径

//配置文件上传的中间件
var upload=multer({dest:"."+fileUploadPath});//上传文件的目录设定

//配置数据库连接池
var pool=mysql.createPool({
    host:"127.0.0.1",
    port:3306,
    database:"zys",
    user:"root",
    password:"aaaa"
});

//使用静态中间件
app.use(express.static("page"));//默认到page文件夹下查找静态资源，所有的请求路径从page文件夹开始算

app.listen(8888,function(err){
    if(err){
        console.info(err);
    }else{
        console.info("应用程序启动成功...");
    }
});