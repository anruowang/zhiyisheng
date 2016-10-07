// JavaScript Document
$(function(){
	//设置每个input文本框(text)
	var inpTxt={
		"border":"1px solid #999",
		"text-indent":".5em",
		"height":"2em",
		"margin-right":"5px"
	}
	$("input[type=text]").css(inpTxt)
		.on("focus",function(){
			$(this).css("border","1px solid #06f");	
		})
		.on("blur",function(){
			$(this).css("border","1px solid #999");	
		});
	var nichen=$(".smallPic span").html();
	$("#nichen").html(nichen);
	
	//匹配文本框正则
	//电话号码
	var telreg=/^(13[0-9]|15[0|1|3|6|7|8|9]|18[8|9])\d{8}$/;
	piPei("tel",telreg);
	
	//邮箱
	var emailReg=/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
	piPei("Email",emailReg);
	
	
	//我的照片界面显示出来
	showPage("myPic","settingP");
	
	//我的日记页面显示出来
	showPage("myDate","settingD");
	
	//我的记录页面显示出来
	showPage("myTalk","settingT");
	
	//我的好友界面显示出来
	showPage("myFriend","settingF");
	
	//我的礼物页面显示出来
	showPage("myGift","settingG");
	
});

//匹配正则的函数
function piPei(objId,reg){
	$("#"+objId).on("blur",function(){
		if(reg.test($(this).val())){
			$(this).siblings().eq(2).attr("style","display:none;");
			$(this).siblings().eq(1).attr("style","display:inline;color:green;");
		}else{
			$(this).siblings().eq(2).attr("style","display:inline;color:red;");
			$(this).siblings().eq(1).attr("style","display:none");
		}
	});
}

//切换 我的账户 里面的信息
function setJiBen(thisObj,showObjId){
	var objOptions={
		"color":"#000",
		"cursor":"default"	
	}
	var otherOptions={
		"color":"#06f",
		"cursor":"pointer"	
	}
	$(thisObj).parent().children().css(otherOptions);
	$(thisObj).css(objOptions);
	$("#mineMsg form").attr("style","display:none");
	$("#"+showObjId).attr("style","display:block");	
}

//充值的设置
$("#cz").on("click",function(){
	$("#czMoney").slideDown("fast");
	$("#makeSure").click(function(){
		console.log($(".czMoney input[name=zmoney]:checked").length);
		if($(".czMoney input[name=zmoney]:checked").length==1){
			if(confirm("确认充值？")){
				var czBi=parseInt( $("input[name=zmoney]:checked").val() );
				var cZiBi=parseInt( $("#currentZiBi").html() )+czBi;
				$("#currentZiBi").html(cZiBi);
			}
		}else{
			$("#tishiDiv").attr("style","display:block");
		}
	});	
	$(".czMoney input[name=zmoney]").change(function(){
		$("#tishiDiv").attr("style","display:none");
	});
});



function showPage(clickId,pageId){
	$("#"+clickId).click(function(){
		$(this).parent().children().attr("style","color:#85a4ce")
			.children("i").attr("style","color:#85a4ce");
		$(this).css("color","#0000FF")
			.children("i").css("color","#0000FF");
		$("#contentLeft").siblings().attr("style","display:none");
		$("#"+pageId).attr("style","display:block");
	});
}