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
			if(data=="101"){
				$("#getemails").val("邮件发送成功").attr("disabled",false);
			}else if(data=="100"){
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
	var eml= $.trim($("#eml").val());//邮箱
	var emla= $.trim($("#elma").val());//验证码
	var name= $.trim($("#name").val());//姓名
	var pwd= $.trim($("#pwd").val());//密码
	var sex= $.trim($("input[name=sex]:checked").val());//性别
	var ymd= $.trim($("select[name=year] option:selected").val())//年月日
		+'\/'+$.trim($("select[name=month] option:selected").val())+'\/'
		+$.trim($("select[name=day] option:selected").val());
	var nowdo=$.trim($("input[name=work]:checked").val());//我现在
	var house=$.trim($("select[id=selProvince] option:selected").val())
		+' '+$.trim($("select[id=selCity] option:selected").val());//居住地
	var term= $.trim($("input[name=agree]:checked").val());//同意条款

	$.post("/adduser",{eml:eml,emla:emla,name:name,
		pwd:pwd,sex:sex,ymd:ymd,nowdo:nowdo,house:house,term:term},function(data){
		data= $.trim(data);
		switch (data){
			case "104":$("#zyzc").text("注册成功,请登录").css("color","green");break;
			case "105":$("#zyzc").text("邮箱有误").css("color","red");break;
			case "106":$("#zyzc").text("验证码有误").css("color","red");break;
			case "107":$("#zyzc").text("密码有误").css("color","red");break;
			case "108":$("#zyzc").text("姓名有误").css("color","red");break;
			default:$("#zyzc").text("注册失败。。。").css("color","red");break;
		}
	},"text");
}