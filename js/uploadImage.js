
$(function(){
	$("#uploadBigForm").submit(function(){
		alert(111)
	    //用H5的FormData对象对表单数据进行构造
	    var formData = new FormData($("#uploadBigForm")[0]);//这里要获取零角标我也暂时不知道为什么
	    $.ajax({
	    	url: IP + '/pic/uploadBase64.do',
	        type: "POST",
	        data: formData,
	        dataType: "json",
	        async: true,
	        //要想用jquery的ajax来提交FormData数据,
	        //则必须要把这两项设为false
	         processData: false, 
	        contentType: false,
	        //这里是防表单重复提交,可以忽略
	        beforeSend: function(xhr){
	            $("#uploadBigForm :submit").attr("disabled","disabled");
	        },
	        complete: function(xhr,status){
	            $("#uploadBigForm :submit").removeAttr("disabled");
	        },
	        error: function(xhr,status,error){
	            alert("请求出错!");
	        },
	        success: function(result){
	            alert(result.msg);
	        }
	    });
	    return false;
	});
})