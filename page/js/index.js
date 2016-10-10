//发表记录限制字数
var myp = document.getElementById("publish_p");
var myt = document.getElementById("saytext");
var mys = document.getElementById("sub_btn");
myt.onfocus = function () {
    var str = myt.value;
    var em=/\[em_([0-9]*)\]/g;
    str=str.replace(em,'a');
    if (str.length <= 140) {
        myp.innerHTML = "你还可以输入：" + "<i style='color:red'>"+(140 - str.length)+"</i>" + " 个字哦，亲";
        mys.style.cssText = "display:line-block;"
    } else {
        myp.innerHTML = "亲，你已经超过" + "<span style='color:red'>" + (str.length - 140) + "</span>" + " 个字啦";
        mys.style.cssText = "display:none;"
    }
}
myt.onblur = function () {
    myp.innerHTML = "我有话要说";
}
myt.onkeyup = function () {
    var str = myt.value;
    if (str.length <= 140) {
        myp.innerHTML = "你还可以输入：" + "<i style='color:red'>"+(140 - str.length)+"</i>" + " 个字哦，亲";
        mys.style.cssText = "display:block;"
    } else {
        myp.innerHTML = "亲，你已经超过" + "<span style='color:red'>" + (str.length - 140) + "</span>" + " 个字啦";
        mys.style.cssText = "display:none;"
    }
}

//内容中间之发表记录添加表情
$('.emotion').qqFace({
    id: 'facebox',
    assign: 'saytext',
    path: '../arclist/' //表情存放的路径
});
$(".sub_btn").click(function () {
    var str = $("#saytext").val();
    $("#showDynamic").css("display","block");
    $("#showDynamic").html(replace_em(str));
});
//记录编辑结果
function replace_em(str) {
    str = str.replace(/\</g, '&lt;');
    str = str.replace(/\>/g, '&gt;');
    str = str.replace(/\n/g, '<br/>');
    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="../arclist/$1.gif" border="0" />');
    return str;
}
//点击图片上传
$(".pic_").click(function () {
    var inputObj = document.createElement('input')
    inputObj.setAttribute('id', '_ef');
    inputObj.setAttribute('type', 'file');
    inputObj.setAttribute("style", 'visibility:hidden');
    document.body.appendChild(inputObj);
    inputObj.click();
    inputObj.value;
})


//weather动态背景图片
var weatherInfo=document.getElementById("weatherInfo");
var ileft=-740;
var time=null;
function toMove(){
    time=window.setInterval(function(){
        ileft+=2;
        if(ileft==1000){
            ileft=1000;
        }
        weatherInfo.style.backgroundPosition=ileft+"px 0px";
    },80);
}
toMove();
//weather根据时间判断更换背景
 var myDate = new Date();
 var myTime = myDate.getHours();
 if (6 <= myTime && myTime < 19) {
     $("#weatherInfo").css("background-image", "url(../images/weather_1.jpg)");
 } else {
     $("#weatherInfo").css("background-image", "url(../images/weather_2.jpg)");
 }

$(function(){
    userIsLogin();
    showFirstPage();
});

var zh="";//存登录了的用户的账号
//判断用户是否已经登录
function userIsLogin(){
    $.get("/xyuserIsLogin",null,function(data){
        zh= $.trim(data);
        if(zh!="0"){
            $("#myName").html(zh);
        }else{//如果没有用户登录，则返回登录页面，同时存入的用户账号清空
            window.location.href="../login.html";
            zy="";
        }
    });
}

//显示第一页的数据
function showFirstPage(){
    $.get("/xygetAllUserInfo",null,function(data){
        if(data.code!=0){
            zh=data.uname || zh;
            var bgpic=data.ubackground || "/images/myInfoBg_1.png";
            var pic=data.upic || "/images/myInfoPic.png";
            $("#myInfoName").append($("<a href='PagePerson.html'>"+zh+"</a>"));
            $("#myInfoBg").attr("src",".."+bgpic);
            $("#myInfoImg").append($("<img class='myInfoImg' src='.."+pic+"' />"));
            $("#stn_span1").append($("<span class='stn_span'>"+data.fcount+"</span>"));
            $("#stn_span2").append($("<span class='stn_span'>"+data.tcount+"</span>"));
            $("#stn_span3").append($("<span class='stn_span'>"+data.ncount+"</span>"));
        }
    });
}
