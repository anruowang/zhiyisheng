/**
 * Created by Minexieyu on 2016/10/5.
 */
var express=require("express");//创建服务器的
var session=require("express-session");//session
var mysql=require("mysql");//操作数据库
var fs=require("fs");//操作文件或目录的
var bodyparser=require("body-parser");//处理请求的
var multer=require("multer");//处理文件上传的

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

var fileUploadPath="/page/zypic";//存入服务器的路径
var fileUploadPathData="/zypic";//存入数据库中的图片路径，主要要除掉static中的路径

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

app.get("/",function(req,res){
    res.sendFile(__dirname+req.url+"/page/login.html");
});

//监听所有类型的请求，注意此时要将静态中间件放到这个的后面，否则当我们访问静态资源时，不会被这个监听拦截
app.all("/back/*",function(req,res,next){
    if(req.session.currentLoginUser==undefined){
        res.send("<script>location.href='/login.html';</script>");
    }else{//说明已经登录
        next();//将请求往下传递给对应的处理方法
    }
});

//处理登录的请求
app.post("/xyuserLogin",function(req,res){
    if(req.body.uname==""){
        res.send("1");//用户名为空
    }else if(req.body.pwd==""){
        res.send("2");//密码为空
    }else{
        pool.getConnection(function(err,conn){
            if(err){
                res.send("3");//获取数据库连接池失败
            } else{//查询登录邮箱和密码是否正确
                conn.query("select uid,uemail,upwd from userinfo where uemail=? and upwd=?",[req.body.uname,req.body.pwd],function(err,result){
                    conn.release();//释放连接给连接池
                    if(err){
                        res.send("4");//数据库查询失败
                    }else{
                        if(result.length>0){//说明用户登录成功，则需要将当前用户信息存到session中
                            req.session.currentLoginUser=result[0];//保存此时用户的数据，便于之后的登录验证
                            console.info(req.session.currentLoginUser);
                            res.send("6");
                        }else{//说明没查询到数据
                            res.send("5");
                        }
                    }
                });
            }
        });
    }
});
//处理用户是否已经登录的请求
app.get("/xyuserIsLogin",function(req,res){//如果服务器端session还有值，就表示登录还没过期
    if(req.session.currentLoginUser==undefined){//此时登录已过期 即处于用户未登录的状态
        res.send("0");
    }else{//用户已经登录
        res.send("z"+req.session.currentLoginUser.uid);//将登录的用户名传过去
    }
});

//处理首页获取用户所有信息的请求
app.get("/xygetAllUserInfo",function(req,res){
    pool.getConnection(function(err,conn){
        res.header("Content-Type","application/json");//说明以json形式传去数据
        if(err){
            res.send("{'code':'0'}");
        }else{
            conn.query("select u.uname,u.upic,u.ubackground,count(n.nid) as ncount,count(f.fid) as fcount from userinfo u,noteinfo n,friendinfo f where u.uid=n.uid and u.uid=f.uid and f.status=1 and u.uid=?",[req.session.currentLoginUser.uid],function(err,result){
                conn.release();
                if(err){
                    res.send("{'code':'0'}");
                    console.info(err);
                }else{
                    res.send(result);
                }
            });
        }
    });
});

//处理个人主页显示的请求
app.get("/xyshowPagePerson",function(req,res){
    pool.getConnection(function(err,conn){
        conn.query("select u.uid,u.uname,u. from userinfo u,discussinfo d,answerinfo a,talkinfo t",[],function(err,result){

        });
    });
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