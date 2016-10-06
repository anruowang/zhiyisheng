/**
 * Created by Administrator on 16-9-30.
 */
var nodemailer=require("nodemailer");
var express=require("express");
var session=require("express-session");
var bodyparser=require("body-parser");
var app=express();
var mysql=require("mysql");

app.use(bodyparser.urlencoded({extend:false}));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {secure:false,maxAge:1000*60*20}
}));

//配置数据库连接池
var pool=mysql.createPool({
    host:"localhost",
    post:3306,
    database:"zys",
    user:"root",
    password:"1"
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
            res.send("1");//邮件发送失败
            return console.info(error);
        }else{
            req.session.yanzhengma=code;
            res.send("2");//邮件发送成功
            console.info("Message send: "+code);
        }
    })
})


app.post("/adduser",function(req,res){
            pool.getConnection(function(err,connection){
                if(err){
                    res.send("4");//说明数据库连接失败
                }else {
                    console.info(req.body.emla);
                    if (req.body.emla == req.session.yanzhengma) {
                        connection.query("insert into userInfo(uname,usex,upwd,uemail,uaddress,uoffice,umoney) values(?,?,?,?,?,?,?)",
                            [req.body.name, req.body.sex, req.body.pwd, req.body.eml, req.body.house,
                                req.body.nowdo, 20], function (err, result) {
                                connection.release();//释放连接给连接池
                                if (err) {
                                    res.send("5" + err);//说明添加数据失败
                                } else {
                                    res.send("6");//注册成功
                                }
                            });
                    }
                }
            });
})

app.use(express.static(__dirname));
app.listen(8888,function(err){
    if(err){
        console.info(err);
    }else{
        console.info("服务器开启成功。。。");
    }
})