//验证邮箱
function checkemail(obj,zynumber){
	var reg=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/g;//邮箱验证
	if(reg.test($(obj).val())){
		$("#zynumber").html("邮箱验证通过").css({"display":"inline-block","color":"green"});
		//$(obj).css("border-color","green");
		return true;
	}else{
		$("#zynumber").html("请填写有效电子邮箱，推荐使用QQ邮箱").css({"display":"inline-block","color":"red"});
		//$(obj).css("border-color","red");
		return false;
	}
}
function getemail(){
	$("#getemails").attr("disabled",true);
	if(checkemail($("#eml"))){
		var eml= $.trim($("#eml").val());
		$.post("/getlma",{eml:eml},function(data){
			data= $.trim(data);
			if(data=="2"){
				$("#getemails").val("邮件发送成功").attr("disabled",false);
			}else{
				$("#getemails").val("发送失败，点击重新发送").attr("disabled",false);
			}
		},"text");
	}else{
		return;
	}
}

//验证密码
function checkpwd(obj,zypwd){
	var reg=/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
	if(reg.test(obj.value)){
		$("#"+zypwd).html("密码验证通过").css({"display":"inline-block","color":"green"});
	}else{		
		$("#"+zypwd).html("由6-20个字母，数字或特殊符号组成").css({"display":"inline-block","color":"red"});
	}
}

//验证真实姓名
function checkname(obj,zyname){
	var reg=/[\u4e00-\u9fa5]{2,6}$/;
	if(reg.test(obj.value)){
		$("#"+zyname).html("姓名验证通过").css({"display":"inline-block","color":"green"});
	}else{		
		$("#"+zyname).html("请填写你的真实中文姓名").css({"display":"inline-block","color":"red"});
	}
}

//验证联系方式
function checktel(obj,zytel){
	var reg=/^[1][358][0-9]{9}$/;
	if(reg.test(obj.value)){
		$("#"+zytel).html("联系方式验证通过").css({"display":"inline-block","color":"green"});
	}else{		
		$("#"+zytel).html("请输入11位数字，海外用户请使用邮箱注册").css({"display":"inline-block","color":"red"});
	}
}

function checkInfo(){
	var sname= $.trim($("#name").val());
	var pwd= $.trim($("#pwd").val());
	var sex= $.trim($("#input:radio").val());

	var eml= $.trim($("#eml").val());
	var elma=$.trim($("#elma").val());

	$.post("/adduser",{name:name,pwd:pwd,sex:sex,eml:eml,elma:elma},function(data){
		data= $.trim(data);
		if(data=="5") {
			alert("注册成功。。。");
		}else{
			alert("注册不成功");
		}

	},"text");
}