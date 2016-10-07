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

function showFirstPage(){
    $.get("/xygetAllUserInfo",null,function(data){
        zh=data[0].uname || zh;
        var bgpic=data[0].ubackground || "/images/myInfoBg_1.png";
        var pic=data[0].upic || "/images/myInfoPic.png";
        $("#myInfoName").append($("<a href='PagePerson.html'>"+zh+"</a>"));
        $("#myInfoBg").attr("src",".."+bgpic);
        $("#myInfoImg").append($("<img class='myInfoImg' src='.."+pic+"' />"));
        $("#stn_span1").append($("<span class='stn_span'>"+data[0].fcount+"</span>"));
        $("#stn_span3").append($("<span class='stn_span'>"+data[0].ncount+"</span>"));
    });
}
