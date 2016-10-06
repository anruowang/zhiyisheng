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

//登录
function userLogin(){
    
}