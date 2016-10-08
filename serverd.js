/**
 * Created by Administrator on 16-9-30.
 */
var nodemailer=require("nodemailer");
var express=require("express");
var session=require("express-session");
var bodyparser=require("body-parser");
var app=express();
var mysql=require("mysql");
var fs=require("fs");//操作文件的
var multer=require('multer');//文件上传模块

var app=express();//创建一个应用程序

app.use(bodyparser.urlencoded({extend:false}));//配置和使用body-parser中间件

//配置和使用session中间件
app.use(session({
    secret:'keyboard cat',// 私密 session id的标识
    resave:true,//每次请求是否重新设置session cookie，意思是浏览页面，过晚了59秒，如果在再新一次页面，过期时间重新计算
    saveUninitialized:true,//session cookie 默认值为connect.sid
    cookie:{secure:false,maxAge:1000*60*20}//maxAge:意思是过期时间为20分钟 最大失效时间  secure:用于https
    //secure为true是时，cookie在http中无效 在https中才有效
}));

//配置数据库连接池
var pool=mysql.createPool({
    host:"127.0.0.1",
    post:3306,
    database:"zys",
    user:"root",
    password:"1"
});

var upload=multer({dest:'page/zypic'});//指定文件上传目录
app.post("/zyuploadFile",upload.array("file"),function(req,res){
    console.info(req.files);
    if(req.files==undefined){//说明用户没有选择图片
        res.send();
    }else {
        for (var i = 0; i < req.files.length; i++) {
            var path = __dirname + "/page/zypic/" + req.files[i].originalname;
            fs.renameSync(req.files[i].path, path);//重命名
        }
    }
        //console.info(req.body.sugType);
        //console.info(req.body.sugCon);
        //console.info(req.files[i].path);
        //res.send("图片上传成功。。。");
    pool.getConnection(function(err,conn) {
        res.header("Content-Type", "application/json");
        if (err) {
            res.send("109");//数据库连接失败
        } else {
            conn.query("insert into suggestions values(0,?,?,?,?)",
                [req.session.currentLoginUser.uid, req.body.sugCon,path, req.body.sugType], function (err, result) {
                    conn.release();
                    if (err) {
                        console.info(err);
                        res.send("110");//插入失败
                    } else {
                        res.send("111");//插入成功
                    }
                });
        }
    });

});

var transporter=nodemailer.createTransport({//邮件传输
    host:"smtp.qq.com", //qq smtp服务器地址
    secureConnection:false, //是否使用安全连接，对https协议的
    port:465, //qq邮件服务所占用的端口
    auth:{
        user:"1137211995@qq.com",//开启SMTP的邮箱，有用发送邮件
        pass:"xifynvwbujdkigia"//授权码
    }
});

app.post("/getlma",function(req,res){ //调用指定的邮箱给用户发送邮件
    var code="";
    while(code.length<5){
        code+=Math.floor(Math.random()*10);
    }
    var mailOption={
        from:"1137211995@qq.com",
        to:req.body.eml,//收件人
        subject:"吱一声注册校验码",//纯文本
        html:"<h1>终于等到你，欢迎注册吱一声，您本次的注册验证码为："+code+"</h1>"
    };

    transporter.sendMail(mailOption,function(error,info){
        if(error){
            res.send("100");//邮件发送失败
        }else{
            req.session.yanzhengma=code;
            res.send("101");//邮件发送成功
            console.info("Message send: "+code);
        }
    })
})

app.post("/adduser",function(req,res){//用户注册
    var reg1=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/g;//邮箱验证
    var reg2=/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;//密码
    var reg3=/[\u4e00-\u9fa5]{2,6}$/;//名字
    if(!reg1.test(req.body.eml)){
        res.send("105");//说明邮箱错误
    }else if(req.body.emla != req.session.yanzhengma){
        res.send("106");//验证码错误
    }else if(!reg2.test(req.body.pwd)){
        res.send("107");//说明密码错误
    }else if(!reg3.test(req.body.name)){
        res.send("108");//说明姓名有误
    } else {
        pool.getConnection(function (err, connection) {
            if (err) {
                res.send("102");//说明数据库连接失败
            } else {
                //console.info(req.body.term);
                if (req.body.emla == req.session.yanzhengma) {
                    connection.query("insert into userInfo(uname,usex,upwd,uemail,uaddress,uoffice,umoney,birthday) values(?,?,?,?,?,?,?,?)",
                        [req.body.name, req.body.sex, req.body.pwd, req.body.eml, req.body.house,
                            req.body.nowdo, 20, req.body.ymd], function (err, result) {
                            connection.release();//释放连接给连接池
                            if (err) {
                                res.send("103" + err);//说明添加数据失败
                            } else {
                                res.send("104");//注册成功
                            }
                        });
                }
            }
        });
    }
})


///////////////////////////////////////////////////////////////
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
                console.info(err);
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
                    if(result.length>0){
                        res.send(result[0]);
                    }else{
                        res.send("{'code':'0'}");
                    }
                }
            });
        }
    });
});

//处理个人主页显示的请求
app.get("/xyshowPagePerson",function(req,res){
    pool.getConnection(function(err,conn){
        res.header("Content-Type","application/json");
        conn.query("select uid,uname,birthday,uaddress,upic,ubackground from userinfo where uid=?",[req.session.currentLoginUser.uid],function(err,result){
            conn.release();
            if(err){
                res.send("{'code':'0'}");
                console.info(err);
            }else{
                res.send(result[0]);
            }
        });
    });
});

//处理获取个人基本资料的请求
app.get("/getPersonMsg",function(req,res){
    pool.getConnection(function(err,conn){
        if(err){
            console.info("{'code':'0'}");
        }else{
            conn.query("select uid,upic,uname,usex,birthday,ublood,umerry,uoffice from userinfo where uid=?",[req.session.currentLoginUser.uid],function(err,result){
                conn.release();
                if(err){
                    res.send("{'code':'0'}");
                }else{
                    res.send(result[0]);
                }
            });
        }
    });
});

//处理修改个人资料的请求
app.post("/changejiben",function(req,res){
    pool.getConnection(function(err,conn){
        if(err){
            res.send("{'code':'0'}");
        }else{
            conn.query("update userinfo set uname=?,usex=?,birthday=?,ublood=?,uoffice=?,umerry=? where uid=?",[req.body.uname,req.body.usex,req.body.birthday,req.body.ublood,req.body.uoffice,req.body.umerry,req.body.uid],function(err,result){
                conn.release();
                if(err){
                    res.send("{'code':'0'}");
                }else{
                    res.send("{'code':'1'}");
                }
            });
        }
    });
});

//使用静态中间件
app.use(express.static("page"));//默认到page文件夹下查找静态资源，所有的请求路径从page文件夹开始算
//////////////////////////////////////////////////////////////////////
//app.use(express.static(__dirname));
app.listen(8080,function(err){
    if(err){
        console.info(err);
    }else{
        console.info("服务器开启成功。。。");
    }
})