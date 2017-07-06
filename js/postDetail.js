app.controller("postDetailController", function($routeParams, $scope, $location, $window, $http, $anchorScroll) {
	//是否为个人中心跳转
	$scope.isComId = false;

	var conList = $("#con_nav .nav_name");
	conList.removeClass('active');
	$(conList[3]).addClass('active');
	var postId = $routeParams.id;
	var comment_Id = location.href.split('=')[1];
	var themeType, title;
	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 20
	};

	//取消关注
	$scope.cancelFlows = function(authorId) {
		console.log(authorId)
		$.ajax({
				type: "post",
				url: IP + '/userFollow/cancelFlows.do',
				type: 'post',
				dataType: 'json',
				data: {
					followId: userId,
					userId: authorId
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					if(data.objectList) {
						$scope.$apply(function() {
							$scope.isFans = !$scope.isFans;
						})
						Toast("取消关注", 1000);
					}
				}
			})
	}

	//添加关注
	$scope.addFlows = function(authorId) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/userFollow/addFlows.do',
				type: 'post',
				dataType: 'json',
				data: {
					followId: userId,
					userId: authorId
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					if(data.objectList) {
						$scope.$apply(function() {
							$scope.isFans = false;
						})
						Toast("感谢关注", 1000);
					}
				}
			})
	}

	//加关注
	$scope.addAttention = function(id, positionId) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/userFollow/addFlows.do',
				type: 'post',
				dataType: 'json',
				data: {
					followId: userId,
					userId: id
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					if(data.objectList) {
						$scope.$apply(function() {
							$scope.commentIsFans = false;
						})
						$scope['followSub' + positionId] = false;
						Toast("感谢关注", 1000);
					}
				}
			})
	}

	//取消关注comment in
	$scope.commentCancelFlows = function(id) {
		console.log(id + " " + userId)
		$.ajax({
				type: "post",
				url: IP + '/userFollow/cancelFlows.do',
				type: 'post',
				dataType: 'json',
				data: {
					followId: userId,
					userId: id
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					if(data.objectList) {
						$scope.$apply(function() {
							$scope.commentIsFans = !$scope.commentIsFans;
						})
						Toast("取消关注", 1000);
					}
				}
			})
	}

	$scope.followMeReply = function(id, showId) {
		$scope.isOnSelf = true;
		$.ajax({
				type: "post",
				url: IP + "/userInfoDetail/queryUserInfoDetail.do",
				async: true,
				data: {
					id: id
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					if(!data.objectList[0]) {
						console.log("为空")
					}
					$scope.$apply(function() {
						$scope.queryIsFollow(id, showId)
						$scope.replyerDetail = data.objectList[0];
						console.log($scope.replyerDetail.accountId + " " + userId)
						if($scope.replyerDetail.accountId == userId) {
							$scope.isOnSelf = false;
						}
						$scope['followSub' + showId] = true;
					})
				}

			})
	}

	$scope.init = function() {
		$("#postClass dd").click(function() {
			$("#postClass dd").removeClass('active');
			$(this).addClass('active');
		})
		$("#disTitle a").click(function() {
			$("#disTitle a").removeClass('active');
			$(this).addClass('active');
		})
		$('.emotion').qqFace({
			id: 'facebox',
			assign: 'textArea',
			path: 'qqFaceGif/' //表情存放的路径
		});
	}

	//初始化页面
	$scope.init();
	//请求海报数据	
	$scope.currentpage = 1;
	//最热门
	$scope.posterDetail = function() {
		$scope.clickShoucang = true;
		$.ajax({
				type: "post",
				url: IP + '/adminPoster/posterDetail.do',
				async: true,
				data: {
					numPerPage: $scope.paginationConf.itemsPerPage,
					pageNum: $scope.paginationConf.currentPage,
					id: postId
				}
			})
			.done(function(data) {
				console.log("data", data)
				if(data.flag == 1) {
					//返回到顶部
					$('html,body').animate({ scrollTop: '0px' }, 800);
					$scope.$apply(function() {
						$scope.postDetail = data.objectList;
						$scope.postTotal = data.objectList.total;
						$scope.themeAutherId = data.objectList.themeAutherId
						//						$scope.themeRepId=data.objectList.subPosterList;
						$scope.paginationConf.totalItems = data.objectList.total;
					})
				}
//				for(var i = 0; i < $scope.postDetail.subPosterList.length; i++) {
//					var con = $scope.postDetail.subPosterList[i].replyContent;
//					//					var con = "hahahahttps://www.baidu.com/哈哈哈https://www.cnblogs.com/哈哈哈http://www.w3cschool.cn/哈哈哈http哈哈哈";
//					var urlList = getHttpUrlArray(con);
//					if(urlList == null) {
//						$("#repContId" + i).append(con);
//					} else {
//						var html = "";
//						for(var j = 0; j < urlList.length; j++) {
//							html += con.substring(0, urlList[j].first) + "<a href='" + con.substring(urlList[j].first, urlList[j].last) + "' target='_blank' class='bookLink'>" + con.substring(urlList[j].first, urlList[j].last) + "</a>";
//							con = con.substring(urlList[j].last);
//						}
//
//						$("#repContId" + i).append(html);
//					}
//
//				}
			})
	}
	$scope.clickShoucang = true;
	//获取当前评论所在的页数
	$scope.queryPage = function() {
		$.ajax({
				type: "post",
				url: IP + '/bookComment/bookCommentToId.do',
				async: true,
				data: {
					bookId: 43,
					id: comment_Id,
					type: 1
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					$scope.pageLocation = data.objectList;
					if($scope.pageLocation % $scope.paginationConf.itemsPerPage == 0) {
						$scope.$apply(function() {
							$scope.paginationConf.currentPage = $scope.pageLocation / $scope.paginationConf.itemsPerPage;
						})
						console.log("能够被8整除，值为：", $scope.paginationConf.currentPage);
					} else {
						$scope.$apply(function() {
							$scope.paginationConf.currentPage = parseInt($scope.pageLocation / $scope.paginationConf.itemsPerPage) + 1;
						})
						console.log("不能够被8整除，值为：", $scope.paginationConf.currentPage);
					}
					$scope.isComId = true;
					$scope.posterDetail();
				}
			})
	}
	//如果commentId有数据，说明是跳转到某一条具体的评论
	//请求此条评论在第几页,type为0说明是书
	if(comment_Id == undefined) {
		//获取书籍评论列表
//		alert(comment_Id)
//		$scope.posterDetail();
	} else {
		console.log("page")
		$scope.queryPage();
	}

	/**
	 * 只看楼主
	 */
	$scope.onlySeeHoster = function() {
		$scope.clickShoucang = !$scope.clickShoucang;
		if(!$scope.clickShoucang) {
			$.ajax({
					type: "post",
					url: IP + '/adminPoster/posterLz.do',
					async: true,
					data: {
						id: postId,
						themeAutherId: $scope.themeAutherId,
						numPerPage: $scope.paginationConf.itemsPerPage,
						pageNum: $scope.paginationConf.currentPage
					}
				})
				.done(function(data) {
					console.log("lz", data)
					if(data.flag == 1) {
						$scope.$apply(function() {
							$scope.paginationConf.totalItems = data.objectList.total;
							$scope.postDetail = data.objectList;
							$scope.postTotal = data.objectList.total;
						})
					}
				})
		} else {
			$scope.posterDetail();
		}

	}
	/**
	 * 举报
	 */

	var _reportId, _type;
	$scope.fnReport = function() {
		$scope.reportShow = !$scope.reportShow;
	}
	$scope.fnReportShow = function(id, type) {
		$scope.reportShow = !$scope.reportShow;
		$scope.reportID = id;
		_reportId = id;
		_type = type;
	}
	//帖子的举报内容提交
	$scope.submitReport = function() {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			return;
		}
		$.ajax({
				url: IP + '/common/insertReport.do',
				type: 'post',
				dataType: 'json',
				data: {
					userId: userId,
					content: $scope.handleContent,
					reportId: _reportId,
					reportType: _type

				},
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {　　
						$scope.fnReport();
					});
					$scope.handleContent = ""
				}
			})
	}

	/**
	 * 对评论的回复
	 */
	$scope.replayshow = ""
	$scope.conf = [];
	$scope.replayShow = function(index) {
		$("#A" + index).toggle();
	}
	$scope.replayComment = function(index, commentId) {
		var replyContent = $scope.conf[index];
		var nickNameString = getNickName(replyContent);

		$.ajax({
				url: IP + '/adminPoster/insertThemeComment.do',
				type: 'post',
				dataType: 'json',
				data: {
					beReplyerID: commentId,
					themeId: postId,
					replyContent: replyContent,
					replyerID: userId,
					nickNameString: nickNameString

				},
			})
			.done(function(data) {
				if(data.flag == 1) {
					console.log(JSON.stringify(data))

					Toast("谢谢回复", 1000);
					$scope.$apply(function() {
						$scope.posterDetail();
						$scope.conf[index] = "";
					})
					if(nickNameString == "") {
						console.log("回复没有@")
						insertIntoInfoTable(commentId, 1, replyContent);
					} else {
						console.log("回复有@,回复人的昵称为 ", nickNameString)
						insertIntoInfoTable(commentId, 1, replyContent);
						insertIntoInfoTable(nickNameString, 2, replyContent);
					}
				}

				$("#A" + index).toggle();
			})
	}

	/*上传贴子评论  */

	//上传贴子评论
	$scope.insertThemeComment = function() {
		var nickNameString = getNickName($("#textArea").html());
		var str = $("#textArea").html();
		var html = "";
		var con = str;
		console.log(str)
		var urlList = getHttpUrlArray(con);
		console.log(urlList)
		if(urlList == null) {
			html=str;
		} else {
			for(var j = 0; j < urlList.length; j++) {
				html += con.substring(0, urlList[j].first) + "<a href='" + con.substring(urlList[j].first, urlList[j].last) + "' target='_blank' class='bookLink'>" + con.substring(urlList[j].first, urlList[j].last) + "</a>";
				con = con.substring(urlList[j].last);
				
			}
			html+=con;
		}
		var replyContent = html;
//		console.log(html)
//		return ;
		$.ajax({
				type: "post",
				url: IP + '/adminPoster/insertThemeComment.do',
				async: true,
				data: {
					themeId: postId,
					replyContent: replyContent,
					replyerID: userId,
					nickNameString: nickNameString,
					beReplyerID: $scope.postDetail.themeAutherId
				}
			})
			.done(function(data) {

				if(data.flag == 1) {
					if(nickNameString == "") {
						insertIntoInfoTable($scope.postDetail.themeAutherId, 1, replyContent);
					} else {
						insertIntoInfoTable($scope.postDetail.themeAutherId, 1, replyContent);
						insertIntoInfoTable(nickNameString, 2, replyContent);
					}
					$window.location.reload();
				}
			})
	}

	/**
	 * 帖子评论的点赞
	 *@data id
	 */
	$scope.subposterPraiseNum = function(id, repId) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/adminPoster/subposterPraiseNum.do',
				data: {
					postId:postId,
					subposterId: id
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					Toast("感谢点赞", 1000);
					$scope.posterDetail();
					insertIntoInfoTable(repId, 3, "");
				}
			})
	}

	/**
	 * 帖子的点赞
	 * @data id
	 */
	$scope.posterPraiseNum = function(id) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/adminPoster/posterPraiseNum.do',
				async: true,
				data: {
					posterId: id
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					Toast("感谢点赞", 1000);
					$scope.posterDetail();
					insertIntoInfoTable($scope.themeAutherId, 3, "");
				}
			})
	}

	/**
	 * 加关注
	 */
	//mouseover发帖人头像打开弹窗
	$scope.followMeP = false;
	//作者
	$scope.followMe = function(id) {
		$.ajax({
				type: "post",
				url: IP + "/userInfoDetail/queryUserInfoDetail.do",
				async: true,
				data: {
					id: id
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					if(!data.objectList[0]) {
						console.log("为空")
					}
					$scope.$apply(function() {
						$scope.queryIsFollowAuthor(id, authorfollow)
						$scope.authorDetail = data.objectList[0];
						$scope.followMeP = true;
					})
				}

			})
	}

	//鼠标移除,关闭弹窗
	$scope.mouseLeave = function(id) {
		$scope['followSub' + id] = false;
	}

	//查询是否已关注作者
	$scope.queryIsFollowAuthor = function(_userId) {
		console.log(_userId + " " + userId)
		if(_userId == userId) {
			$scope.isSelf = false;
			return;
		} else {
			$scope.isSelf = true;
		}
		$.ajax({
				type: "post",
				url: IP + '/userFollow/queryIsFollow.do',
				type: 'post',
				dataType: 'json',
				data: {
					followId: userId,
					userId: _userId
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					if(data.objectList == true) {
						$scope.$apply(function() {
							$scope.isFans = false;
						})
					}

				}
			})
	}

	//查询是否已关注
	$scope.queryIsFollow = function(_userId, positionId) {
		console.log("是否已经关注", _userId)
		if(_userId == userId) {
			$scope.isOnSelf = false;
			return;
		} else {
			$scope.isOnSelf = true;
		}
		$.ajax({
				type: "post",
				url: IP + '/userFollow/queryIsFollow.do',
				type: 'post',
				dataType: 'json',
				data: {
					followId: userId,
					userId: _userId
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					if(data.objectList == true) {
						$scope.$apply(function() {
							$scope.commentIsFans = false;
						})
						$("#" + positionId + ".position").html("已关注");
					} else {
						$scope.$apply(function() {
							$scope.commentIsFans = true;
						})
						$("#" + positionId + ".position").html("关注");
					}
				}
			})
	}
	/**
	 * 锚点,回复
	 */
	$scope.scollToReply = function() {
		$location.hash('book_comment');
		$anchorScroll();
	}

	$scope.changeImageSize = function(index) {
		var height = $("#img" + index).height();
		if(height == 200) {
			$("#img" + index).height('auto');
		} else {
			$("#img" + index).height(200);
		}
	}
	//ng-img 分页
	var reGetProducts = function() {
		
		if($scope.clickShoucang == false) {
			$scope.onlySeeHoster();
		} else {
			if(comment_Id != undefined) {
				if($scope.isComId) {
					$scope.posterDetail();
				}
			} else {
				$scope.posterDetail();
			}
		}
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

})

/**
 * 输入数字限制  100字限制
 */
var textAreaNum = 0;

function textAreaChange(value) {
	var numb = $("#textArea").text().length;
	if(textAreaNum == 0 && numb == 16) {
		numb = 1;
	}
	textAreaNum++;
	$("#inputNumber").text(numb)
}

app.filter('trustHtml', function($sce) {
	return function(input) {
		return $sce.trustAsHtml(input);
	}
});