//---------------------------发表记录限制字数------------------------------------------
var myp = document.getElementById("publish_p");
var myt = document.getElementById("saytext");
var mys = document.getElementById("sub_btn");
myt.onfocus = function () {
    var str = myt.value;
    var em = /\[em_([0-9]*)\]/g;
    str = str.replace(em, 'a');
    if (str.length <= 140) {
        myp.innerHTML = "你还可以输入：" + "<i style='color:red'>" + (140 - str.length) + "</i>" + " 个字哦，亲";
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
        myp.innerHTML = "你还可以输入：" + "<i style='color:red'>" + (140 - str.length) + "</i>" + " 个字哦，亲";
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
//点击图片上传然后限制
var files = document.getElementById('pic').files;
var fs = files.length;
var s = 0;
if (fs > 10) {
    alert("上传的文件数量超过10个了！请重新选择！");
} else {
    for (var i = 0; i < fs; i++) {
        if (files[i].size > 1024 * 1024) {
            alert('"' + files[i].name + "这个文件大于1M！请重新选择！");
        }
    }
}

//-----------------------------内容刷新下拉----------------------------------------
var obj = document.getElementById("dynamic_body");
window.onscroll = function () {
    var scrollH = obj.scrollHeight; //整个内容的高度，包括内容区域的高度，加上被“卷”起来的部分
    var scrollT = obj.scrollTop; //被卷起来的高度->滚动到哪里
    var clientH = obj.clientHeight; //内容区域的高度
    if (scrollH == scrollT + clientH) {
        var sh = document.getElementById("showhidden");
        sh.style.display = "block";
        window.setTimeout("frush()", 1000);
    }
}
//加载新的下拉列表
function frush() {
    var newdiv = document.createElement("div");
    var newul = document.createElement("ul");
    //循环添加内容
    for (var i = 0; i < 10; i++) {
        var newli = document.createElement("li");
        newli.innerHTML = "小法小法小法小法";
        newul.appendChild(newli);
    }
    newdiv.appendChild(newul);
    var sh = document.getElementById("showhidden");
    obj.insertBefore(newdiv, sh); //在sh这个div之前插入
}

//--------------------------------好友说说部分--------------------------------------------
$('.emotion_1').qqFace({
    id: 'facebox',
    assign: 'comment',
    path: '../arclist/' //表情存放的路径
});
$(".com_btn").click(function () {
    var str = $("#comment").val();
    $("#reply_1").html(replace_em(str));
});
//记录编辑结果
function replace_em(str) {
    str = str.replace(/\</g, '&lt;');
    str = str.replace(/\>/g, '&gt;');
    str = str.replace(/\n/g, '<br/>');
    str = str.replace(/\[em_([0-9]*)\]/g, '<img src="../arclist/$1.gif" border="0" />');
    return str;
}
//失焦聚焦事件
$("#comment").focus(function () {
    $("#comment").css("height", "60px");
    $(".dynamic_3").css("height", "110px");
    $(".comment_p").css("display", "block");
});
$(".li_1").blur(function () {
    $("#comment").css("height", "30px");
    $(".dynamic_3").css("height", "50px");
    $(".comment_p").css("display", "none");
});
//点赞/取消赞
$("#zan").on("click", function () {
    $(this).css("color", "red").html(" 取消赞");
});

//隐藏动态
$("#hid_dynamic").on("click", function () {
    $(this).css({
        "width": "100%",
        "margin-left": "-1px"
    }).html(" 取消隐藏");
    $(".dynamic_2").css("display", "none");
    $(".li_1").css("display", "none");
    $("#zan_a").css("display", "none");
})

//$("#hid_dynamic").toggle(
//  function () {
//    $(this).css({"width":"100%","margin-left":"-1px"}).html(" 取消隐藏");
//    $(".dynamic_2").css("display","none");
//    $(".li_1").css("display","none");
//    $("#zan_a").css("display","none");
//  },
//  function () {
//    $(".dynamic_2").css("display", "block");
//    $(".li_1").css("display", "block");
//    $("#zan_a").css("display", "block");
//    $(this).html(" 隐藏");
//  }
//);

//---------------------------------weather动态背景图片------------------------------------
var weatherInfo = document.getElementById("weatherInfo");
var ileft = -740;
var time = null;

function toMove() {
    time = window.setInterval(function () {
        ileft += 2;
        if (ileft == 1000) {
            ileft = 1000;
        }
        weatherInfo.style.backgroundPosition = ileft + "px 0px";
    }, 80);
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
    getTalkData();
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

function getTalkData(){
    //获取用户和好友的说说数据
    $.get("/xygetAllTalkData",null,function(data){
        console.info(data.code);
        if(data.code==0){
            alert("非常抱歉，获取数据失败，请刷新重试...");
            return;
        }
        $.each(data,function(index,item){
            console.info(item);
            var pic=item.upic || "/images/myInfoPic.png";
            var personName=item.fremarks || item.uname;
            var str='<li class="tab-pane active dynamic"><div class="talk_user"> <div class="talk_1"> <img src="..'+pic+'" width="50" height="50" class="talk_img" /> <strong>'+personName+'</strong> <p>'+item.ttime+'</p> </div> <div class="talk_2"> <span class="trangle"></span> <div id="showDynamic">'+item.tdata+'</div> </div> </div></li>"';
            $("#talkbox").append($(str));
        });
    });
}
