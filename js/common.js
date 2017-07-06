
var userId = "";
//聊天默认Uid
var chatDefaultUid = "123";
//聊天默认头像

var userInfo;
var identityINFO;
//客服默认头像

//聊天默认appkey
var appkey = 23563638;
//聊天客服默认appkey
var appkeycs = 23562553;

var sixinInfoNum = 0;

if(localStorage.userInfo) {
	userInfo = JSON.parse(localStorage.userInfo);
	userId = userInfo.accountId;
	identityINFO = userInfo.identity; //0代表读者,1代表作者
}

function Toast(msg, duration) {
	duration = isNaN(duration) ? 3000 : duration;
	var html = "<div class='toast'  id='bb' >" + msg + "</div>"
	$("body").append(html)
	setTimeout(function() {
		var d = 0.5;
		$("#bb").addClass('toastT');
		setTimeout(function() {
			$("#bb").remove()
		}, d * 1000);
	}, duration);
}

//获取字符串中的url极其下标索引
function getHttpUrlArray(s) {
	var s0 = s.match(/http.*/);
	var s1 = s.match(/[^'"=]http.*/);
	console.log(s1)
	var yuan = s;
	var url = [];
	var i = 0;
	var indexArray =[];
	var indexInL1 = { first: 0, last: 0, url: "" };
	if(s0 != null) {
		if(s0.index == 0) {
			var s0end = s.match(/[\u4e00-\u9fa5<\s,，。；;]/);
			if(s0end != null) {
				indexInL1.first = 0;
				indexInL1.last = s0end.index;
				indexInL1.url = s.substring(0, s0end.index)
			} else {
				indexInL1.first = 0;
				indexInL1.last = s.length;
				indexInL1.url = s.substring(0, s.length)
			}
			indexArray[i] = indexInL1;
			i++;
		}
	}
	if(s1 == null && s0 == null) {
		return null;
	} else if(s1 == null && s0 != null) {
		return indexArray;
	}
	while(s1 != null) {
		console.log(s1)
		var indexInL = { first: 0, last: 0, url: "" };
		//获取下标索引
		var index = s1.index;
		indexInL.first = index + 1;
		console.log("s1开始", index + 1)
		//查找之后的第一个汉字或结束标签或，。；：
		//获取其下标索引
		var s2 = s1[0].substring(1).match(/[\u4e00-\u9fa5<\s,，。；;]/);
		//若汉字存在
		if(s2 != null) {
			var noIndex = s2.index;
			indexInL.last = noIndex + index + 1;
			console.log("s2 结束", noIndex + index + 1)
			//取得url
			indexInL.url = s1[0].substring(1, noIndex + 1);
			s = s.substring(noIndex + index + 1);
			console.log("s的值 ", s)
			s1 = s.match(/[^'"=]http.*/);
		} else {
			//如果是第一个,直接加入
			if(i == 0) {
				indexInL.last = s.length;
			} else {
				indexInL.last = s.length;
			}
			s = s.substring(index + 1);
			indexInL.url = s;
			console.log("url ", s)
			s1 = null;
		}
		indexArray[i] = indexInL;
		i++;
	}
	return indexArray;
}

//获取ID
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

/**
 * 
 * @param {Object} str
 * 解析字符串@
 * return nickNameString
 */
function getNickName(str) {
	var strT = str + " ";
	var pattern = /@(.+?)\s/g;
	if(strT.match(pattern)) {
		var text = strT.match(pattern);
		var bobo = text.toString().replace(/(@)/g, ",");
		var dd = bobo.substring(1, bobo.length - 1) + "" + ",";
		return dd;
	} else {
		return "";
	}
}
/**
 * 判断为空，为定义。
 * 显示Toast
 */
function isNull(value, message) {
	if(value == 0) {
		return false;
	}
	if(value == "" || value == undefined) {
		Toast(message, 1000);
		return true;
	}
	return false;
}
/**
 *是否登陆，否跳转到登陆界面 
 */
function isLogin() {
	if(localStorage.userInfo) {
		return true;
	}
	return false;
}
/**
 * 输入框br操作
 * @param {Object} str
 */
function replaceTextarea1(str) {
	var reg = new RegExp("\r\n", "g");
	var reg1 = new RegExp(" ", "g");

	str = str.replace(reg, "＜br＞");
	str = str.replace(reg1, "＜p＞");

	return str;
}
/**
 *页面分页底 
 */
function pageTab() {
	$(".page-list .pagination li").mouseenter(function() {
		$(this).addClass('page_hover');
	}).mouseleave(function() {
		$(this).removeClass('page_hover');
	})

	//	$(".page-list .pagination li").click(function() {
	//		$(".page-list .pagination li").removeClass('page_hover')
	//	
	//		console.log($(this).parent().find('active'))
	//		var nowchoose=$(this).parent().find('active');
	//		$(".page-list .pagination li").removeClass('active');
	//		if($(this).attr("id")=='prevPage'){
	//			nowchoose.next().addClass('active')
	//		}
	//		else{
	//			if($(this).attr("id")=='nextPage'){
	//				nowchoose.prev().addClass('active')
	//			}
	//			else{
	//				$(this).addClass('active')
	//			}
	//		} 
	//		$(".page-list .pagination li").mouseenter(function() {
	//			$(this).addClass('page_hover');
	//		}).mouseleave(function() {
	//			$(this).removeClass('page_hover');
	//		})
	//		$(this).unbind('mouseenter').unbind('mouseleave');
	//	})

}

/**
 *针对于cookie的操作 
 */
//JS操作cookies方法! 

//写cookies 

function setCookie(name, value) {
	//	if(getCookie(name)){
	//		delCookie(name);
	//	}
	localStorage.setItem(name, value);
	return localStorage.setItem(name, value);
}

//读取cookies 
function getCookie(name) {
	localStorage.getItem(name);
	return localStorage.getItem(name);
}

//删除cookies 
function delCookie(name) {
	localStorage.removeItem(name);
}

/**
 * 删除赞
 * @param {Object} toUid
 * @param {Object} type
 */
function deleteInfoFromTable(toUid, type) {
	$.ajax({
			url: IP + '/sysUserMessage/deleteUserMessage.do',
			type: 'post',
			dataType: 'json',
			async: false,
			data: {
				'userId': toUid,
				'type': type
			}
		})
		.done(function(data) {
			console.log("删除赞返回数据", data)
		})
}

/**
 * 插入消息到未读消息列表中 
 * @param {Object} toUid
 * @param {Object} type
 * @param {Object} content
 */
function insertIntoInfoTable(toUid, type, content) {
	if(type == 2) {
		var toUid = returnIdByNickname(toUid);
		toUid.forEach(function(it) {
			var list = [{
				'userId': it,
				'type': type,
				'content': content,
				'replyerId': userId
			}]
			$.ajax({
					url: IP + '/sysUserMessage/insertUserMessage.do',
					type: 'post',
					dataType: 'json',
					async: false,
					data: {
						"sysUserMessageVos": JSON.stringify(list)
					}
				})
				.done(function(data) {
					console.log("插入未读消息列表返回数据", data)
				})
		})
	} else {
		var list = [{
			'userId': toUid,
			'type': type,
			'content': content,
			'replyerId': userId
		}]
		$.ajax({
				url: IP + '/sysUserMessage/insertUserMessage.do',
				type: 'post',
				dataType: 'json',
				data: {
					"sysUserMessageVos": JSON.stringify(list)
				}
			})
			.done(function(data) {
				console.log("插入未读消息列表返回数据", data)

			})
	}

}

/**
 * 根据昵称查询ID 
 * @param {Object} nickName
 */
function returnIdByNickname(nickName) {
	var returnValue;
	$.ajax({
			url: IP + '/userInfoDetail/queryIdByNickname.do',
			type: 'post',
			dataType: 'json',
			async: false,
			data: {
				nickName: nickName
			}
		})
		.done(function(data) {

			if(data.objectList != null) {
				console.log("根据昵称获取的ID为", data.objectList[0])
				returnValue = data.objectList;
			} else {
				returnValue = "";
			}
		})
	return returnValue;
}

/**
 * 更换表情
 * @param {Object} str
 */
function replace_em(str) {

	str = str.replace(/\</g, '&lt;');

	str = str.replace(/\>/g, '&gt;');

	str = str.replace(/\n/g, '<br/>');

	str = str.replace(/\[em_([0-9]*)\]/g, '<img src="qqFaceGif/$1.gif" border="0" />');

	return str;

}