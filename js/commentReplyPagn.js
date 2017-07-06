//==================================分页===========================
var counts = 0;
var p_pernum = 10;
//变量  
var p_current = 1;
var p_all_page = 0;
var pages = [1];

var replyS = null;
//初始化第一页  

//获取数据  

//单选按钮选中  
function select(id) {
	//	        alert(id);  
}
//首页  
function p_index(num, commentId) {
	load_page(1, num, commentId);
	// 
}
//尾页  
function p_last(num, commentId) {
	load_page(p_all_page, num, commentId);
}
//加载某一页  
function load_page(page, q, commentId) {
	commentReplyBycommentId(commentId, page, p_pernum, q)
};
//初始化页码  
function reloadPno() {
	pages = calculateIndexes(p_current, p_all_page, 8);
};

function replyReplyShow(co_index, _replyIndex) {
	if(!isLogin()) {
		Toast("请先登陆", 1000);
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
		return;
	}
	$("#A" + co_index + "B" + _replyIndex).toggle();
}

function replayShow(co_index, _replyIndex) {
	if(!isLogin()) {
		Toast("请先登陆", 1000);
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
		return;
	}
	$("#A" + co_index + "B" + _replyIndex).toggle();
}

function replayReplayComment(co_index, index, commentId, beRepliedId) {
	var replyContent = $("#AB" + co_index + "" + index).val();
	var nickNameString = getNickName(replyContent);
	$.ajax({
			url: IP + '/bookComment/insertCommentReply.do',
			type: 'post',
			dataType: 'json',
			data: {
				commentId: commentId,
				replyContent: replyContent,
				replyerId: userId,
				nickNameString: nickNameString,
				beRepliedId: beRepliedId
			}
		})
		.done(function(data) {
			if(data.flag == 1) {
				console.log("评论成功", data)
				if(data.flag == 1) {
					Toast("谢谢回复", 1000);
					location.reload();
				}
			}
		})
}

//分页算法  
function calculateIndexes(current, length, displayLength) {
	var indexes = [];
	var start = Math.round(current - displayLength / 2);
	var end = Math.round(current + displayLength / 2);
	if(start <= 1) {
		start = 1;
		end = start + displayLength - 1;
		if(end >= length - 1) {
			end = length - 1;
		}
	}
	if(end >= length - 1) {
		end = length;
		start = end - displayLength + 1;
		if(start <= 1) {
			start = 1;
		}
	}
	for(var i = start; i <= end; i++) {
		indexes.push(i);
	}
	return indexes;
};

function commentReplyBycommentId(commentId, currentPage, pageSize, num) {
	$.ajax({
			type: "post",
			url: IP + '/bookComment/commentReply.do',
			async: true,
			data: {
				commentId: commentId,
				pageNum: currentPage,
				numPerPage: pageSize
			}
		})
		.done(function(data) {
			if(data.flag == 1) {
				replyS = data.objectList;
				counts = data.total;
				p_current = currentPage;
				p_pernum = pageSize;
				//此处进行分页
				p_all_page = Math.ceil(counts / p_pernum);
				pages = calculateIndexes(p_current, p_all_page, 6);
				var htmlPage = [];
				htmlPage.push('<div class="page-list tab-tab-list">');
				htmlPage.push('<ul class="pagination" style="margin: 0px;">');
				htmlPage.push('<li  onclick="p_index(' + num + ',' + commentId + ')">');
				htmlPage.push('<a href="javascript:void(0);">首页</a>');
				htmlPage.push('</li>');
				for(var k = 0; k < pages.length; k++) {
					htmlPage.push('<li class="active" onclick="load_page(' + pages[k] + ',' + num + ',' + commentId + ')" ');
					htmlPage.push('<a href="javascript:void(0);">' + pages[k] + '</a>');
					htmlPage.push('</li>');
				}

				htmlPage.push('<li onclick="p_last(' + num + ',' + commentId + ')">');
				htmlPage.push('<a href="javascript:void(0);">尾页</a>');
				htmlPage.push('</li>');
				htmlPage.push('<li style="vertical-align: 12px;"> 共：' + counts + '条</li>');
				htmlPage.push('</ul>');
				htmlPage.push('</div>');
				var strs = htmlPage.join("");
				var html = [];
				var replyss = "";

				for(var i = 0; i < replyS.length; i++) {
					html.push('<div class="reply_user_post clear">');
					html.push('<div class="reply_user_name fl"><img src="' + replyS[i].userImage + '" />');
					html.push('<p>' + replyS[i].nickName + '</p>');
					html.push('</div>');
					html.push('<div class="reply_user_con fl">');
					html.push(replyS[i].replyContent);
					html.push('<span>' + replyS[i].replyTime + '</span>');
					html.push('<div class="reply_box_wrap">');
					html.push('<div class="reply_box_btn" onclick="replyReplyShow(' + num + ',' + i + ')">回复</div>');
					html.push('<div class="reply_box_reply" id="A' + num + 'B' + i + '" onmouseleave="replayShow(' + num + ',' + i + ')">');
					html.push('<textarea id="AB' + num + '' + i + '" maxlength="120" name="replay"></textarea>');
					html.push('<span class="reply_btn_t"  onclick="replayReplayComment(' + num + ',' + i + ',' + commentId + ',' + replyS[i].replyerId + ')">回复</span>');
					html.push('</div>');
					html.push('</div>');
					html.push('</div>');
					html.push('<div class="report_user fr" ng-click="fnReportShow(' + replyS[i].id + ')">举报>></div>');
					html.push('</div>');
				}

				var replysss = html.join("");
				replyss = replyss + replysss
				if(counts > 10) {
					//进行分页处理
					replyss = replyss + strs;
				}
				$("#pagination" + num).html(replyss);

			}
		})

}

function replyListMore1(commentId, j) {
	commentReplyBycommentId(commentId, 1, 10, j);

}

//==================================分页结束===========================