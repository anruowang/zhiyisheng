/**
 * Created by Minexieyu on 2016/9/30.
 */
$(function(){
    var timer;
    $("#setPic").hover(function(){
        clearInterval(timer);
        $("#setPicList").stop(true).slideDown("fast");
    },function(){
        clearInterval(timer);
        timer=setInterval(hideList,100);
        //定时器待定
    });
    $("#setPicList").hover(function(){
        clearInterval(timer);
    },function(){
        hideList();
    });
    showPagePerson();
});
function hideList(){
    $("#setPicList").stop(true).slideUp("fast");
}

function showPagePerson(){
    $.get("/xyshowPagePerson",null,function(data){
        if(data.code==0){
            alert("非常抱歉，获取数据失败，请刷新页面...");
            return;
        }
        var nc=data.uname || data.uid;
        var upic=data.upic || "/images/zanwu.jpg";
        var ubackground={
            background:function(){
                return (data.ubackground || "url('/images/lalala.jpg')")+" no-repeat";
            },
            backgroundSize:"cover"
        }


        $("#nc").html(nc);
        $("#birthday").html(data.birthday);
        $("#address").html(data.uaddress);
        $("#ubackground").css(ubackground);
        $("#PersonPic").attr("src",".."+upic);
    },'json');
}
