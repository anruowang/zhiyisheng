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
});
function hideList(){
    $("#setPicList").stop(true).slideUp("fast");
}