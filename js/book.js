var app = angular.module("bookApp", ['tm.pagination']);
var commentLength = -1;
var Request = new Object();
Request = GetRequest();
var book_Id = Request.book_id;
var comment_Id = Request.comment_Id;
var authorId;
var bookType;
var _juanindex;
var qrcode;
var share_flag = false; //分享是否隐藏
var _isfivemiss = true; //设置5秒后评论的变量
var _reportType;
new_element = document.createElement("script");
new_element.setAttribute("type", "text/javascript");
new_element.setAttribute("src", "../js/qrcode.js"); // 在这里引入了a.js
document.body.appendChild(new_element);
app.controller("bookInfoC", function($scope, $http, $window, $location, $anchorScroll) {

	//==================================分页===========================
	$scope.counts = 0;
	$scope.p_pernum = 10;
	//变量  
	$scope.p_current = 1;
	$scope.p_all_page = 0;
	$scope.pages = [1];

	$scope.replyS = null;
	//初始化第一页  

	//获取数据  

	if(!isLogin()) {
		$scope.isLoginReport = true;
	} else {
		$scope.isLoginReport = false;
	}

	//单选按钮选中  
	$scope.select = function(id) {}
		//首页  
	$scope.p_index = function() {
			$scope.load_page(1);
			// 
		}
		//尾页  
	$scope.p_last = function() {
			$scope.load_page($scope.p_all_page);
		}
		//加载某一页  
	function load_page(page, q, commentId) {
		$scope.commentReplyBycommentId(commentId, page, 10, q)
	};
	//初始化页码  
	var reloadPno = function() {
		$scope.pages = calculateIndexes($scope.p_current, $scope.p_all_page, 8);
	};
	//分页算法  
	var calculateIndexes = function(current, length, displayLength) {
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

	//==================================分页结束===========================

	var _chapterCopperMoney; //章节的铜图钉价格
	var _chapterSilverMoney; //章节的银图钉价格

	var _chapterSilverMoney1 = []; //章节的银图钉价格
	//是否为第一次请求分页
	$scope.isComId = false;

	//回复的分页

	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 10
	};
	$scope.replayshow = ""
	$scope.conf = [];
	$scope.replyConf = [];
	//获取书本详情
	$.ajax({
			type: "post",
			url: IP + '/common/bookDetailsQuery.do',
			async: true,
			data: {
				bookId: book_Id
			}
		})
		.done(function(data) {
			console.log(data)
			if(data.flag == 1) {
				$scope.bookInfo = data.objectList;
				$scope.bookInfo.checkNub*=17;
//				$scope.bookInfo.collectionNum*=13;	
				$scope.bookInfo.praiseNum*=17;
				document.getElementById('title').innerHTML=$scope.bookInfo.bookName+"- "+$scope.bookInfo.nickName+"- 42轻小说- 42文库";
				authorId = data.objectList.authorId;
				_chapterSilverMoney = data.objectList.chapterPrice;
				_chapterCopperMoney = _chapterSilverMoney * 10;
				//查询作者个人信息
				$scope.authorInfo(authorId);
				//查询关注
				$scope.queryIsFollowAuthor(authorId);
				//查询收藏
				$scope.queryIsCollection();
				bookType = data.objectList.bookType[0].bookType;
				//查询相关作品
				$scope.serachRelatedWork(bookType);
				//authorId;		
			}
		})
	
	//获取书本券，章
	var _pageNum=1;
	$http({
			method: 'post',
			url: IP + '/common/bookVolumeChapter.do',
			params: {
				bookId: book_Id,
//				numPerPage: 20,
//				pageNum: pageNum
			}
		})
		.success(function(data) {
			console.log(data)
			if(data.flag == 1) {
				$scope.vclist = data.objectList;
				if(data.objectList[0].list[0]){
					$scope.firstList = data.objectList[0].list[0];
				}
				for(var i = 0; i < data.objectList.length; i++) {
					//alert(data.objectList[i].list.length)
					for(var j = 0; j < data.objectList[i].list.length; j++) {
						_chapterSilverMoney1[data.objectList[i].list[j].id] = data.objectList[i].list[j].chapterPrice
							//alert(data.objectList[i].list[j].id])
					}
				}
			}
		})

	//相关作品
	$scope.serachRelatedWork = function(bookType) {
		$.ajax({
				type: "post",
				url: IP + '/distribute/bookClassificationQuery.do',
				async: true,
				data: {
					numPerPage: 2,
					pageNum: 1,
					booktype: bookType,
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					if(data.objectList) {
						$scope.$apply(function() {
							$scope.relatedBook = data.objectList;
							$scope._relativeBook = true;
						})
					} else {
						$scope._relativeBook = false;
					}

				}
			})

	}
	//银图钉个人消费排行榜
	$.ajax({
			type: "post",
			url: IP + '/bookConsumer/selectBookConsumerList.do',
			async: true,
			data: {
				bookId: book_Id,
				numPerPage: 9,
			}
		})
		.done(function(data) {
			console.log(data)
			if(data.flag == 1) {
				$scope.$apply(function() {
					if(data.objectList[0]){
						$scope.tycoonList = data.objectList;
					}
					else{
						$scope.tycoonListShow=false;
					}
				})
			}
		})

	//所有书籍评论
	$scope.bookAllComment = function() {
			console.log("当前的页面值", $scope.paginationConf.currentPage);
			$.ajax({
					type: "post",
					url: IP + '/bookComment/bookAllComment.do',
					async: true,
					data: {
						bookId: book_Id,
						pageNum: $scope.paginationConf.currentPage,
						numPerPage: $scope.paginationConf.itemsPerPage,
						praiserId: userId
					}
				})
				.done(function(data) {
					console.log("pinglunhuifu", data)
					if(data.flag == 1) {
						$scope.$apply(function() {
							$scope.coList = data.objectList;
							$scope.bookComment = data.total;
							if(data.total == 0) {
								$scope.bookCommentShow = false;
							}
							$scope.paginationConf.totalItems = data.total;
							console.log($scope.coList);

						})
					}
				})
		}
		/**
		 *	评论的回复，查看更多及分页 
		 */
	var temppaginationConf;
	$scope.paginationConf1 = {
		currentPage: 1,
		itemsPerPage: 10
	};
	//查询某条评论的回复 
	//commentId 评论的id  currentPage 当前页   pageSize每页的评论的数量  num为第几条评论的回复列表
	$scope.commentReplyBycommentId = function(commentId, currentPage, pageSize, num) {
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
						$scope.$apply(function() {
							$scope.replyS = data.objectList;
							$scope.counts = data.total;
							$scope.p_current = currentPage;
							$scope.p_pernum = pageSize;
							//此处进行分页
							$scope.p_all_page = $scope.counts % $scope.p_pernum - 1;
							$scope.pages = calculateIndexes($scope.p_current, $scope.p_all_page, 6)
							var htmlPage = [];
							htmlPage.push('<div class="page-list111">');
							htmlPage.push('<ul style="margin: 0px;">');
							htmlPage.push('<li ng-class="{true:\'disabled\'}[p_current==1]" ng-click="p_index()">');
							htmlPage.push('<a href="javascript:void(0);">首页</a>');
							htmlPage.push('</li>');
							for(var k = 0; k < $scope.pages.length; k++) {
								htmlPage.push('<li onclick="load_page(' + $scope.pages[k] + ',' + num + ',' + commentId + ')" ');
								htmlPage.push('<a href="javascript:void(0);">' + $scope.pages[k] + '</a>');
								htmlPage.push('</li>');
							}

							htmlPage.push('<li ng-class="{true:\'disabled\'}[p_current==p_all_page]">');
							htmlPage.push('<a href="javascript:void(0);">尾页</a>');
							htmlPage.push('</li>');
							htmlPage.push('<li style="vertical-align: 12px;"> 共：' + $scope.counts + '条</li>');
							htmlPage.push('</ul>');
							htmlPage.push('</div>');
							var strs = htmlPage.join("");
							var html = [];
							var replyss = "";

							for(var i = 0; i < $scope.replyS.length; i++) {
								html.push('<div class="reply_user_post clear">');
								//								html.push('<div class="reply_user_name fl"><img src="' + $scope.replyS[i].userImage + '" />');
								html.push('<div class="reply_user_name fl">' + '<img src="../img/down.png" />');
								html.push('<p>' + $scope.replyS[i].nickName + '</p>');
								html.push('</div>');
								html.push('<div class="reply_user_con fl">');
								html.push($scope.replyS[i].replyContent);
								html.push('<span>' + $scope.replyS[i].replyTime + '</span>');
								html.push('<div class="reply_box_wrap">');
								html.push('<div class="reply_box_btn" ng-click="replyReplyShow(' + num + ',' + i + ')">回复</div>');
								html.push('<div class="reply_box_reply" id="A' + num + 'B' + i + '">');
								html.push('<textarea ng-model="$parent.replyConf[$index]" maxlength="120" name="replay"></textarea>');
								html.push('<span class="reply_btn_t" ng-click="replayReplayComment(' + num + ',' + i + ',' + commentId + ',' + $scope.replyS[i].replyerId + ')">回复</span>');
								html.push('</div>');
								html.push('</div>');
								html.push('</div>');
								html.push('<div class="report_user fr" ng-click="fnReportShow(' + $scope.replyS[i].id + ')">举报>></div>');
								html.push('</div>');
							}

							var replysss = html.join("");
							replyss = replyss + replysss
							if($scope.counts > 10) {
								//进行分页处理
								replyss = replyss + strs;
							}
							$("#pagination" + num).html(replyss);
						})
					}
				})

		}
		//回复评论查看更多回复评论 num为选中的第几条评论
	$scope.replyListMore = function(commentId, j) {
			//$("#second"+j).show();
			//$("#more"+j).hide();
			//查询
			replyListMore1(commentId, j);
			//$scope.commentReplyBycommentId(commentId,1,10,j);

			$scope.initNub = -10;
		}
		//获取当前评论所在的页数
	$scope.queryPage = function() {
		$.ajax({
				type: "post",
				url: IP + '/bookComment/bookCommentToId.do',
				async: true,
				data: {
					bookId: book_Id,
					id: comment_Id,
					type: 0
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
					$scope.bookAllComment();
				}
			})
	}

	//如果commentId有数据，说明是跳转到某一条具体的评论
	//请求此条评论在第几页,type为0说明是书
	if(comment_Id == undefined) {
		//获取书籍评论列表
		console.log("undifine")
		$scope.bookAllComment();
	} else {
		console.log("page")
		$scope.queryPage();
	}

	//设置评分
	var _scoreIndex = 0;
	var score1 = 0;
	//是否已经打过分
	var isScore = false;
	$scope.setScore = function(score) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			if(getCookie('previousURL')) delCookie('previousURL');
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
		if(_scoreIndex != 0) {
			return;
		}

		//如果已经打过分
		if(isScore) {
			Toast("你已经评过分了哦~");
			return;
		}
		$scope.sureScoreShow = true;
		score1 = score;
	}

	//确认评分
	$scope.suerScoreClick = function() {
		console.log(score1)
		$.ajax({
				type: "post",
				url: IP + '/common/insertBookScore.do',
				async: true,
				data: {
					userId: userId,
					score: score1,
					bookId: book_Id
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					_scoreIndex++;
					addScore(score1);
					$scope.$apply(function() {
						$scope.sureScoreShow = false;
					})
					Toast("感谢打分", 1000)
				}
			})
	}
	$scope.operat = {
		praise: "点赞",
		collection: "收藏",
		gavemoney: "打赏",
		share: "分享"
	}
	$scope.isPraise = true;
	$scope.inPraise = false;
	$scope.isCollection = true;
	$scope.inCollection = false;
	$scope.isNormalAP = true;
	$scope.inNormalAP = false;
	$scope.isNormalAC = true;
	$scope.inNormalAC = false;
	$scope.praiseForBook = function() {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
		console.log($scope.operat.praise + "  " + $scope.bookInfo.praiseNum)
		if($scope.operat.praise == "已赞") {
			//如果是已赞状态，则取消赞
			//点赞为1
			$scope.cancelCollectionAndPraise(1);
		} else {
			$scope.operat.praise = "已赞";
			$scope.insertBookQuality(1);

			$scope.isPraise = false;
			$scope.inPraise = true;
			$scope.isNormalAP = false;
			$scope.inNormalAP = true;
		}
	}
	$scope.collectionForBook = function() {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
		if($scope.author == null || $scope.author == undefined) {
			Toast("请稍后再试~");
			return;
		}
		if($scope.author.accountId == userId) {
			Toast("不能收藏自己写的书");
			return;
		}
		if($scope.operat.collection == "已藏") {
			//如果是已收藏状态，则取消收藏
			//收藏为2
			$scope.cancelCollectionAndPraise(2);
		} else {
			$scope.operat.collection = "已藏";
			$scope.insertBookQuality(2);
			$scope.isCollection = false;
			$scope.inCollection = true;
			$scope.isNormalAC = false;
			$scope.inNormalAC = true;
		}
	}

	//是否已经收藏和点赞及评分
	$scope.queryIsCollection = function() {
		$.ajax({
				type: "post",
				url: IP + '/bookComment/selectBookQuality.do',
				async: true,
				data: {
					bookId: book_Id,
					userId: userId,
					type: 2
				}
			})
			.done(function(data) {
				console.log("收藏", data)
				if(data.flag == 1) {
					//是否已经收藏
					if(data.objectList.collectionFlag) {
						$scope.$apply(function() {
							$scope.operat.collection = "已藏";
						})
						$scope.isCollection = false;
						$scope.inCollection = true;
						$scope.isNormalAC = false;
						$scope.inNormalAC = true;
					} else {
						$scope.$apply(function() {
							$scope.operat.collection = "收藏";
						})
					}

					//是否已经赞过
					if(data.objectList.praiseFlag) {
						$scope.$apply(function() {
							$scope.operat.praise = "已赞";
							$scope.isPraise = false;
							$scope.inPraise = true;
							$scope.isNormalAP = false;
							$scope.inNormalAP = true;
						})
					} else {
						$scope.$apply(function() {
							$scope.operat.praise = "点赞";
						})
					}

					//是否评过分
					if(data.objectList.score > 0) {
						addScore(data.objectList.score);
						isScore = true;
					} else {
						isScore = false;
					}
					$scope.operat.gavemoney = "打赏";
					$scope.operat.share = "分享";
				} else {
					$scope.$apply(function() {
						$scope.operat = {
							praise: "点赞",
							collection: "收藏",
							gavemoney: "打赏",
							share: "分享"
						}
					})
				}

			})
	}

	//取消收藏和赞
	$scope.cancelCollectionAndPraise = function(type) {
		if(book_Id == null || book_Id == undefined) {
			Toast("未获得图书信息");
			return;
		}
		if(userId == null || userId == undefined) {
			Toast("请先登录哦~", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
		console.log(book_Id);
		console.log(userId);
		console.log(type);
		$.ajax({
				type: "post",
				url: IP + '/bookComment/cancelBookConllection.do',
				async: true,
				dataType: "json",
				data: {
					bookId: book_Id,
					userId: userId,
					type: type
				}
			})
			.done(function(data) {
				if(data.objectList == 1) {
					if(type == 2) {
						$scope.$apply(function() {
							$scope.operat.collection = "收藏";
							$scope.bookInfo.collectionNum--;
							$scope.isCollection = true;
							$scope.inCollection = false;
							$scope.isNormalAC = true;
							$scope.inNormalAC = false;
						})
						Toast("已取消收藏~", 1000);
					}
					if(type == 1) {
						$scope.$apply(function() {
							$scope.operat.praise = "点赞";
							$scope.bookInfo.praiseNum--;
							$scope.isPraise = true;
							$scope.inPraise = false;
							$scope.isNormalAP = true;
							$scope.inNormalAP = false;
						})
						Toast("已取消赞~", 1000);
					}
				} else {
					Toast("操作失败~_~");
				}
			})
	}

	//对书本的点赞和收藏
	$scope.insertBookQuality = function(type) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/bookComment/insertBookQuality.do',
				async: true,
				dataType: "json",
				data: {
					bookId: book_Id,
					type: type,
					userId: userId
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					if(type == 1) {
						$scope.$apply(function() {
							$scope.bookInfo.praiseNum++;
							Toast("感谢点赞", 1000)
						})
					}
					if(type == 2) {
						$scope.$apply(function() {
							$scope.bookInfo.collectionNum++;
							Toast("感谢收藏", 1000)
						})
					}
				}
			})
	}

	/**
	 * 关注
	 */
	//查询是否已关注作者
	$scope.queryIsFollowAuthor = function(_userId) {
		if(_userId == userId) {
			$scope.$apply(function() {
				$scope.isSelf = false;
			})
			return;
		} else {
			$scope.$apply(function() {
				$scope.isSelf = true;
			})
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
				if(data.flag == 1) {
					if(data.objectList) {
						$scope.$apply(function() {
							$scope.isFans = false;
						})
					}

				}
			})
	}

	//取消关注
	$scope.cancelFlows = function() {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
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

	//取消关注comment in
	$scope.commentCancelFlows = function(id) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
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

	//取消关注 ，粉丝榜
	$scope.commentCancelFlowsFansBang = function(id) {
		console.log(id + " " + userId)
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
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
							$scope.commentIsFansBang = !$scope.commentIsFansBang;
						})
						Toast("取消关注", 1000);
					}
				}
			})
	}

	//添加关注
	$scope.addFlows = function() {

		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
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

	//查询积分
	var count=0;
	$.ajax({
			type: "post",
			url: IP + '/common/selectScore.do',
			dataType: 'json',
			data: {
				bookId: book_Id
			}
		})
		.done(function(data) {
			console.log(data)
			if(data.flag == 1) {
				$scope.scoreInfo = data.objectList;
				count = data.objectList.count;
			}
			var data = {
				labels: ["1分", "2分", "3分", "4分", "5分"],
				datasets: [{
					fillColor: "#f7a621",
					strokeColor: "#f7a621",
					data: count
				}]
			}
			var options = {

				//Boolean - If we show the scale above the chart data			
				scaleOverlay: false,

				//Boolean - If we want to override with a hard coded scale
				scaleOverride: false,

				//** Required if scaleOverride is true **
				//Number - 表格上有几道横线，分成scaleSteps块
				scaleSteps: 1,
				//Number - 总的高度值,变
				scaleStepWidth: 600,
				//Number - 开始的数值
				scaleStartValue: 0,

				//String - Y轴线的颜色
				scaleLineColor: "#FFFFFF",

				//Number - X轴和Y轴线的宽度，推荐为1
				scaleLineWidth: 1,

				//Boolean - 是否在Y轴上显示数值
				scaleShowLabels: false,

				//Interpolated JS string - can access value
				scaleLabel: "<%=value%>",

				//String - 轴上应用的字体
				scaleFontFamily: "'Arial'",

				//Number - 轴上字体的大小
				scaleFontSize: 12,

				//String - 轴上字体样式
				scaleFontStyle: "normal",

				//String - 轴上字体颜色
				scaleFontColor: "#666",

				///Boolean - 是否在表上显示标尺线
				scaleShowGridLines: false,

				//String - 标尺线的颜色
				scaleGridLineColor: "rgba(0,0,0,.05)",

				//Number - 标尺线的宽度
				scaleGridLineWidth: 1,

				//Boolean - 点与点之间是否为曲线，true曲线，false直线
				bezierCurve: false,

				//Boolean - 是否显示点
				pointDot: true,

				//Number - 点的大小
				pointDotRadius: 3,

				//Number - 点边框的像素宽度
				pointDotStrokeWidth: 1,

				//Boolean - Whether to show a stroke for datasets
				datasetStroke: true,

				//Number - 线的宽度
				datasetStrokeWidth: 2,

				//Boolean - 是否用颜色填充数据集
				datasetFill: true,

				//Boolean - 动画
				animation: true,

				//Number - 动画的时间，多少数值之后运行完动画
				animationSteps: 60,

				//String - 动画效果
				animationEasing: "easeOutQuart",

				//Function - 当动画完成时的动作
				onAnimationComplete: null

			}
			var ctx = document.getElementById("scoreBookChart").getContext("2d");
			new Chart(ctx).Bar(data, options);

		})

	//查询作者的信息书籍
	$scope.selectAuthorBook = function() {
		$http({
				method: 'post',
				url: IP + '/bookComment/selectAuthorBook.do',
				params: {
					bookId: book_Id,
					authorId: userId
				}
			})
			.success(function(data, status, headers, config) {
				if(data.flag == 1) {}
			})
			.error(function(data, status, headers, config) {
				//alert("推荐位书籍错误")
			});
	}

	//作者个人信息
	$scope.authorInfo = function(id) {
		$.ajax({
				type: "post",
				url: IP + '/userInfoDetail/queryUserInfoDetail.do',
				async: true,
				data: {
					id: id
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.author = data.objectList[0];
					})
				}
			})
	}

	/**
	 * 图书的点击详情
	 */
	$scope.openBookDetail = function(book_id) {
		window.location.href = "book.html?book_id=" + book_id;
	}

	//选中不在提示购买章节事件
	//	$('#islongerPrompt').on('click',function(e){
	//		sessionStorage.setItem('islongerPrompt', 1);
	////  	 alert(sessionStorage.getItem("islongerPrompt"))
	//  });
	//阅读书籍
	$scope.readBook = function(_chapterId, _isFreeRead, index, chapterMoney, juanindex) {
		_juanindex = juanindex;

		if(_isFreeRead == 1) {
			if(getCookie('currentChapterId')) {
				delCookie('currentChapterId');
				delCookie('_readindex');
				delCookie('_read_juan_index');
			}
			$window.open("./read.html?chapterId=" + _chapterId + "&bookId=" + book_Id + "&index=" + index + "&juanIndex=" + juanindex);
			return;
		}
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/readBook/bookIsRead.do',
				async: true,
				data: {
					bookId: book_Id,
					chapterId: _chapterId,
					isFreeRead: _isFreeRead,
					userId: userId,
					money: chapterMoney
				}
			})
			.done(function(data) {
				console.log("shukebukebu", data)
				if(data.flag == 1) {
					if(getCookie('currentChapterId')) {
						delCookie('currentChapterId');
						delCookie('_readindex');
						delCookie('_read_juan_index');
					}
					$scope.$apply(function() {

						window.open("./read.html?chapterId=" + _chapterId + "&bookId=" + book_Id + "&index=" + index + "&juanIndex=" + juanindex);
					})
				} else {
					//点击是否确定购买
					$scope._chapterId_show = _chapterId;
					$scope._book_Id_show = book_Id;
					$scope.chapter_money_show = chapterMoney;
					$scope._index_show = index;

					if(localStorage.getItem('islongerPrompt') != 1) {
						$scope.$apply(function() {
							$scope.purchaseChapter = true;
						})
					} else {
						//进行自动扣费
						$.ajax({
								type: "post",
								url: IP + '/userMoney/queryMoney.do',
								async: true,
								data: {
									id: userId
								}
							})
							.done(function(data) {
								$scope.$apply(function() {
									$scope.userMoney = data.objectList[0];
									var chapterMoney = $scope.chapter_money_show;
									if(chapterMoney > ($scope.userMoney.silverThumbTack + $scope.userMoney.copperThumbTack * 10.0)) {
										$scope.balanceDialog = true;
										return false;
									}
									//如果钱够的话就去扣钱去读
									$.ajax({
											type: "post",
											url: IP + '/readBook/readBook.do',
											async: true,
											data: {
												userId: userId,
												money: chapterMoney,
												chapterId: _chapterId,
												bookId: book_Id
											}
										})
										.done(function(data) {
											if(data.flag == 1) {
												if(getCookie('currentChapterId')) {
													delCookie('currentChapterId');
													delCookie('_readindex');
													delCookie('_read_juan_index');
												}
												window.open("./read.html?chapterId=" + _chapterId + "&bookId=" + book_Id + "&index=" + index + "&juanIndex=" + juanindex)
											} else {
												Toast("消费异常,请联系客服", 1000);
											}

										})

								})
							})

					}
				}
			})
	}

	$scope.confirmPurchaseChapter = function() {
		$scope.purchaseChapter = false;
		$.ajax({
				type: "post",
				url: IP + '/userMoney/queryMoney.do',
				async: true,
				data: {
					id: userId
				}
			})
			.done(function(data) {
				$scope.$apply(function() {
					$scope.userMoney = data.objectList[0];
					var chapterMoney = $scope.chapter_money_show;
					if(chapterMoney > ($scope.userMoney.silverThumbTack + $scope.userMoney.copperThumbTack * 10.0)) {
						$scope.balanceDialog = true;
						if($scope.islongerPrompt) {
							alert(222);
							localStorage.setItem('islongerPrompt', 1);
						} else {
							localStorage.setItem('islongerPrompt', 0);
							alert()
						}
						return false;
					}
					//如果钱够的话就去扣钱去读
					var _chapterId = $scope._chapterId_show;
					var book_Id = $scope._book_Id_show;
					var index = $scope._index_show;
					var juanIndex = _juanindex;
					$.ajax({
							type: "post",
							url: IP + '/readBook/readBook.do',
							async: true,
							data: {
								userId: userId,
								money: chapterMoney,
								chapterId: _chapterId,
								bookId: book_Id
							}
						})
						.done(function(data) {
							if(data.flag == 1) {
								if($scope.islongerPrompt) {
									localStorage.setItem('islongerPrompt', 1);
								} else {
									localStorage.setItem('islongerPrompt', 0);
								}
								if(getCookie('currentChapterId')) {
									delCookie('currentChapterId');
									delCookie('_readindex');
									delCookie('_read_juan_index');
								}
								window.open("./read.html?chapterId=" + _chapterId + "&bookId=" + book_Id + "&juanIndex=" + juanIndex + "&index=" + index);
							} else {
								Toast("消费异常,请联系客服", 1000);
							}

						})

				})
			})

	}
	$scope.cancelPurchaseChapter = function() {
			$scope._chapterId_show = "";
			$scope._book_Id_show = "";
			$scope._index_show = "";
			$scope.chapter_money_show = "";
			$scope.purchaseChapter = false;
			return false;
		}
		//跳转到充值页面
	$scope.returnToRecharge = function() {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
		$scope.balanceDialog = !$scope.balanceDialog;
		$window.open("./personCenter/sildebar.html?needUrl=" + "mywallet");
	}
	
	//鼠标移除取消回复框
	$scope.cancelReplyKuang=function(co_index,_replyIndex){
		$("#A"+co_index+"B"+_replyIndex).toggle();
	}

	/**
	 * 评论中的人物头像
	 */
	$scope.followMeReply = function(id, index, list) {
		if($("#CoContent" + index).children().length != 0) {
			$("#CoContent" + index).remove();
		}
		var html = [];
		html.push("<div id='CoContent" + index + "' >");
		html.push("<div class='post_card_dis_follow recomment-dis_follow' >");
		html.push("<div class='clear'>");
		html.push("<img class='dis_follow_pic fl' src=" + list.userImage + " />");
		html.push("<div class='dis_follow_info fl'>");
		html.push("<p class='key_writer_name'>" + list.nickName + "</p>");
		html.push("<p><span class='my_follows'>关注:" + list.follows + "</span>");
		html.push("<span class='follow_funs'>粉丝:" + list.fans + "</span></p>");
		html.push("</div>");
		if(list.signature) {
			html.push("<div class='key_writer'>" + list.signature + "</div>");
		} else {
			html.push("<div class='key_writer'>" + "" + "</div>");
		}
		html.push("<div class='follow_btns isOnSelf' >");
		html.push("<span class='active position commentIsFans' onclick='addAttention(" + list.commentUserId + "," + index + "," + 1 + ")'" + ">+关注</span>");
		html.push("<span onclick='commentCancelFlows(" + list.commentUserId + "," + 1 + ")'" + "class='active position unCommentIsFans'>取消关注</span>");
		html.push("<span><p style='text-decoration: none;color: #F39800;' onclick='toSixin(" + list.commentUserId + ")' >私信</p></span>");
		html.push("</div></div>");
		var htmls = html.join("");
		$("#CoWindow" + index).append(htmls);
		$(".commentIsFans").hide();
		$(".unCommentIsFans").show();
		$(".isOnSelf").show();

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
						$scope.queryIsFollowFansBang(id, index)
						replyerDetail = data.objectList[0];
						if(list.commentUserId == userId) {
							$(".isOnSelf").hide();
						}
						console.log(replyerDetail.accountId + " " + userId)

					})
				}

			})

	}

	/**
	 * 银图钉粉丝榜人物头像
	 */
	$scope.followMeReplyFansBang = function(id, index, list) {
		if($("#tyContent" + index).children().length != 0) {
			$("#tyContent" + index).remove();
		}
		var html = [];
		html.push("<div id='tyContent" + index + "' >");
		html.push("<div class='post_card_dis_follow post_card_dis_follow_author' >");
		html.push("<div class='clear'>");
		html.push("<img class='dis_follow_pic fl' src=" + list.headUrl + " />");
		html.push("<div class='dis_follow_info fl'>");
		html.push("<p class='key_writer_name'>" + list.nickName + "</p>");
		html.push("<p><span class='my_follows'>关注:" + list.follows + "</span>");
		html.push("<span class='follow_funs'>粉丝:" + list.fans + "</span></p>");
		html.push("</div>");
		if(list.signature) {
			html.push("<div class='key_writer'>" + list.signature + "</div>");
		} else {
			html.push("<div class='key_writer'>" + "" + "</div>");
		}
		html.push("<div class='follow_btns isOnSelf' >");
		html.push("<span class='active position commentIsFans' onclick='addAttention(" + list.accountId + "," + index + "," + 1 + ")'" + ">+关注</span>");
		html.push("<span onclick='commentCancelFlows(" + list.accountId + "," + 1 + ")'" + "class='active position unCommentIsFans'>取消关注</span>");
		html.push("<span><p style='text-decoration: none;color: #F39800;' onclick='toSixin(" + list.id + ")' >私信</p></span>");
		html.push("</div></div>");
		var htmls = html.join("");
		$("#tyWindow" + index).append(htmls);
		$(".commentIsFans").hide();
		$(".unCommentIsFans").show();
		$(".isOnSelf").show();

		//		$scope.isOnSelfFansBang = true;
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
						$scope.queryIsFollowFansBang(id, index)
						$scope.replyerDetail = data.objectList[0];
						console.log($scope.replyerDetail.accountId + " " + userId)
						if($scope.replyerDetail.accountId == userId) {
							$(".isOnSelf").hide();
						}
					})
				}

			})
	}

	//查询是否已关注作者
	$scope.queryIsFollowFansBang = function(_userId, positionId) {
		console.log("是否已经关注", _userId)
		if(_userId == userId) {
			$(".isOnSelf").hide();
			return;
		} else {
			$(".isOnSelf").show();
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
					console.log(data.objectList)
					if(data.objectList == true) {
						console.log(data.objectList)
						$(".commentIsFans").hide();
						$(".unCommentIsFans").show();
					} else {
						console.log(data.objectList)
						$(".commentIsFans").show();
						$(".unCommentIsFans").hide();
					}
				}
			})
	}

	//加关注
	$scope.addAttention = function(id, positionId) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
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

	$scope.toSixin = function(id) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href=CurrentIp+'/LoginRegister/login.html'", 1000);
			return;
		}
		$window.open(CurrentIp + '/html/messageCenter/personal.html?id=' + id);
	}

	//加关注，粉丝榜
	$scope.addAttentionFansBang = function(id, positionId) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
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
				if(data.flag == 1) {
					if(data.objectList) {
						$scope.$apply(function() {
							$scope.commentIsFansBang = false;
						})
						$scope['followSubFansBang' + positionId] = false;
						Toast("感谢关注", 1000);
					}
				}
			})
	}

	//查询是否已关注作者
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

	//鼠标移除
	$scope.mouseLeave = function(id) {
		$("#CoContent" + id).remove();
	}

	//鼠标移除,粉丝榜
	$scope.mouseLeaveFansBang = function(id) {
		$("#tyContent" + id).remove();
	}

	//对书发表评论
	$scope.insertPost = function() {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
		//设置5秒评论
		if(!_isfivemiss) {
			Toast("请于5秒后,再发布评论哟", 1000);
			return;
		}
		var nickNameString = getNickName($scope.title);
		$.ajax({
				url: IP + '/bookComment/insertBookComment.do',
				type: 'post',
				dataType: 'json',
				data: {
					bookId: book_Id,
					commentContent: $scope.title,
					commentUserId: userId,
					nickNameString: nickNameString
				},
			})
			.done(function(data) {
				if(data.flag == 1) {
					_isfivemiss = false; //设置5秒评论
					console.log(_isfivemiss)
					$scope.$apply(function() {
						$scope.title = "";
					})
					Toast("评论成功", 1000);
					setTimeout("_isfivemiss=true", 5000); //设置5秒评论
					textAreaNum = 0;
					$scope.bookAllComment();
					$location.hash('bookCommentTop');
					$anchorScroll();
					if(nickNameString == "") {
						console.log("回复没有@")
						insertIntoInfoTable(commentUserId, 1, replyContent);
					} else {
						console.log("回复有@,回复人的昵称为 ", nickNameString)
						insertIntoInfoTable(commentUserId, 1, replyContent);
						insertIntoInfoTable(nickNameString, 2, replyContent);
					}
				}
			})
			.fail(function() {
				console.log("error");
			})
	}

	//读书的评论的举报
	var _reportId;
	$scope.fnReportShow = function(id) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
		$scope.reportShow = !$scope.reportShow;
		$scope.reportID = id;
		_reportId = id;
		_reportType = 3;
	}
	$scope.fnReport = function() {
			$scope.reportShow = !$scope.reportShow;
			//$scope.reportReplyShow = !$scope.reportReplyShow;
		}
		//书籍评论回复举报
	$scope.fnReportReplyShow = function(id) {
			if(!isLogin()) {
				Toast("请先登陆", 1000);
				setCookie("previousURL", location.href);
				setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
				return;
			}
			$scope.reportShow = !$scope.reportShow;
			$scope.reportID = id;
			_reportType = 5;
			_reportId = id;
		}
		//读书的评论的举报提交
	$scope.submitReport = function() {
		$.ajax({
				url: IP + '/common/insertReport.do',
				type: 'post',
				dataType: 'json',
				data: {
					userId: userId,
					content: $scope.handleContent,
					reportId: _reportId,
					reportType: _reportType
				},
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {　　
						$scope.fnReport();
					});
					$scope.handleContent = ""
					Toast("举报成功", 1000);
				}
			})
			.fail(function() {
				console.log("error");
			})
	}

	//test
	$scope.purVolume = function() {
		$scope.con_pur = !$scope.con_pur;
	}

	/**
	 * 书本评论的回复，点赞
	 */
	//对书的评论进行点赞
	var insertCommentArray = [];
	$scope.insertCommentPraise = function(bookCommentId, commentUserId, isPraise) {
		iconfontParseT();
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
		//		for(var i = 0; i < insertCommentArray.length; i++) {
		//			if(bookCommentId == insertCommentArray[i]) {
		//				Toast("已经点赞过啦", 1000);
		//				return;
		//			}
		//		}
		//		insertCommentArray.push(bookCommentId);
		/*取消点赞*/
		if(isPraise > 0) {
			$.ajax({
					type: "post",
					url: IP + '/bookComment/deleteBookCommentPraise.do',
					async: true,
					data: {
						praiserId: userId,
						commentId: bookCommentId
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						Toast("取消点赞", 1000);
						$scope.bookAllComment()
						deleteInfoFromTable(userId, 3);
					}
				})
		} else {
			$http({
					method: 'post',
					url: IP + '/bookComment/insertCommentPraise.do',
					params: {
						commentId: bookCommentId,
						praiserId: userId,
						userId: commentUserId
					}
				})
				.success(function(data, status, headers, config) {
					if(data.flag == 1) {
						Toast("谢谢点赞", 1000);
						$scope.bookAllComment();
						insertIntoInfoTable(commentUserId, 3, "");
					}
				})
				.error(function(data, status, headers, config) {
					//alert("推荐位书籍错误")
				});
		}

	}

	//对于书的评论进行回复
	$scope.replayShow = function(index) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}

		$("#A" + index).toggle();
	}
	$scope.replayComment = function(index, commentId, commentUserId) {
		//设置5秒评论
		if(!_isfivemiss) {
			Toast("请于5秒后,再回复哟", 1000);
			return;
		}
		var replyContent = $scope.conf[index];
		var str = replyContent;
		$("#show").html(replace_em(str));
		var nickNameString = getNickName(replyContent);
		$.ajax({
				url: IP + '/bookComment/insertCommentReply.do',
				type: 'post',
				dataType: 'json',
				data: {
					commentId: commentId,
					replyContent: replyContent,
					replyerId: userId,
					nickNameString: nickNameString
				},
			})
			.done(function(data) {

				var list = [{
					'userId': commentUserId,
					'type': 1,
					'content': replyContent,
					'replyerId': userId
				}]
				if(data.flag == 1) {
					console.log(JSON.stringify(list))
					_isfivemiss = false; //设置5秒评论
					console.log(_isfivemiss)
					$scope.$apply(function() {
						$scope.conf[index] = "";
					})
					Toast("谢谢回复", 1000);
					setTimeout("_isfivemiss=true", 5000); //设置5秒评论
					textAreaNum = 0;
					$scope.bookAllComment();
					if(nickNameString == "") {
						console.log("回复没有@")
						insertIntoInfoTable(commentUserId, 1, replyContent);
					} else {
						console.log("回复有@,回复人的昵称为 ", nickNameString)
						insertIntoInfoTable(commentUserId, 1, replyContent);
						insertIntoInfoTable(nickNameString, 2, replyContent);
					}
				}

			})
		$("#A" + index).toggle();
	}

	/**
	 *对于书的评论的回复进行回复 
	 */
	$scope.co_index = 1;
	$scope.replyReplyShow = function(co_index, _replyIndex) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
		$("#A" + co_index + "B" + _replyIndex).toggle();
	}
	$scope.replayReplayComment = function(co_index, index, commentId, beRepliedId) {
			//			if(!isLogin()) {
			//				Toast("请先登陆", 1000);
			//				setCookie("previousURL", location.href);
			//				setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			//				return;
			//			}

			//设置5秒评论
			if(!_isfivemiss) {
				Toast("请于5秒后,再回复哟", 1000);
				return;
			}
			var replyContent = $scope.replyConf[index];
			var str = replyContent;
			$("#show").html(replace_em(str));
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
					},
				})
				.done(function(data) {
					if(data.flag == 1) {
						console.log("评论成功", data)
						if(data.flag == 1) {
							_isfivemiss = false; //设置5秒评论
							console.log(_isfivemiss)
							$scope.$apply(function() {
								$scope.replyConf[index] = "";
							})
							Toast("谢谢回复", 1000);
							setTimeout("_isfivemiss=true", 5000); //设置5秒评论
							textAreaNum = 0;
							$scope.bookAllComment();
							if(nickNameString == "") {
								console.log("回复没有@")
								insertIntoInfoTable(beRepliedId, 1, replyContent);
							} else {
								console.log("回复有@,回复人的昵称为 ", nickNameString)
								insertIntoInfoTable(beRepliedId, 1, replyContent);
								insertIntoInfoTable(nickNameString, 2, replyContent);
							}
						}

					}

				})
			$("#A" + co_index + "B" + index).toggle();
		}
		/**
		 *金额json数据 
		 */
	var rewardJSON = {
			7: "奈奈的拳击比赛真好看",
			42: "宇宙、生命以及一切问题的终极答案",
			106: "贵站美术设计师的生日",
			248: "某站站长某天夜间失眠，起床抽烟的时刻",
			473: "某站站长随意打的数字，具体含义未知",
			613: "某台湾哲学美少女赐予的网站数字",
			1031: "某站站长不要脸地把自己生日日期加了上去",
			2017: "某站开站的年份"
		}
		/**
		 * 对书的打赏
		 */
		//铜的价格
	$scope.setRewardT = function(tong) {
			if($scope.money_T) {
				if($scope.money_T == tong) {
					tong = 0;
				}
			}
			$scope.money_T = tong;
		}
		//银的价格
	$scope.setRewardY = function(yin) {
//		$scope.rewardTitle = rewardJSON[yin];
		if($scope.money_Y) {
			if($scope.money_T == yin) {
				yin = 0;
			}
		}
		$scope.money_Y = yin;
	}

	//打赏打开dialog
	$scope.gavemoneyForBook = function() {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
//		if(authorId == userId) {
//			Toast("亲,不能给自己打赏哟", 1000);
//			return;
//		}
		$scope.reward_popub = !$scope.reward_popub;
		$scope.queryMoney();

	}
	$scope.queryMoney = function() {
			//查询账户金额
			$.ajax({
					type: "post",
					url: IP + '/userMoney/queryMoney.do',
					async: true,
					data: {
						id: userId
					}
				})
				.done(function(data) {
					$scope.$apply(function() {
						$scope.userMoney = data.objectList[0];
					})
				})
		}
		//打赏提交
	$scope.subReward = function() {
		if($scope.money_T > $scope.userMoney.copperThumbTack) {
			$scope.balanceDialog = true;
			return
		}
		if($scope.money_Y > $scope.userMoney.silverThumbTack) {
			$scope.balanceDialog = true;
			return
		}

		if($scope.money_T == undefined && $scope.money_Y == undefined) {
			$scope.balanceDialog = true;
			Toast("请先选择打赏金额", 1000);
			return;
		}
		if($scope.money_T != undefined) {
			$.ajax({
					type: "post",
					url: IP + '/readBook/rewardForBook.do',
					async: true,
					data: {
						bookId: book_Id,
						userId: userId,
						fee: $scope.money_T,
						type: 1
					}
				})
				.done(function(data) {

					if(book_Id == authorId) {
						Toast("亲,自己不能给自己的书打赏哟", 1000);
						return;
					}
					$scope.reward_popub = !$scope.reward_popub;
					$.ajax({
							type: "post",
							url: IP + '/userMoney/queryMoney.do',
							async: true,
							data: {
								id: userId
							}
						})
						.done(function(data) {
							$scope.$apply(function() {
								Toast("谢谢打赏", 1000);
								$scope.reward_popub = false;
								$scope.userMoney = data.objectList[0];
							})
						})

				})
		}
		if($scope.money_Y != undefined) {
			$.ajax({
					type: "post",
					url: IP + '/readBook/rewardForBook.do',
					async: true,
					data: {
						bookId: book_Id,
						userId: userId,
						fee: $scope.money_Y,
						type: 0
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						Toast("谢谢打赏", 1000);
						$scope.reward_popub = false;
					} else {
						Toast("打赏失败", 1000)
					}
				})

		}
		$scope.$apply(function() {
			$scope.reward_popub = false;
		})

	}

	//关闭打赏
	$scope.cancelP = function() {
			$scope.reward_popub = false;
			$scope.con_pur = false;
		}
		/**
		 *跳转到底部评论 
		 */
	$scope.goToComment = function() {
		$location.hash('bookComment');
		$anchorScroll();
	}
	$scope.shareForBook = function() {
			if(qrcode) {
				qrcode.clear();
			}
			qrcode = new QRCode(document.getElementById("qrcode"), {
				width: 100, //设置宽高
				height: 100
			});
			$scope.qrcodeShow=true;
			qrcode.makeCode("http://www.manguo42.com/html/book.html?book_id=" + book_Id);
			share_flag = true;
			return;
	}
	$scope.shareLeave=function(){
		qrcode.clear();
	}
	var reGetProducts = function() {
		if(comment_Id != undefined) {
			if($scope.isComId) {
				$scope.bookAllComment();
			}
		} else {
			$scope.bookAllComment();
		}
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

});

//点击效果事件
//点赞按钮加色
function iconfontParseT() {
	$("#iconfontParse .praise_post").click(function() {
		$(this).addClass('pra-color');
	})
}

$("#screwList li").click(function() {
	if($(this).hasClass('active')) {
		$("#screwList li").removeClass('active');
		return;
	}
	$("#screwList li").removeClass('active');
	$(this).addClass('active');
});
$("#pushpinList li").click(function() {
	if($(this).hasClass('active')) {
		$("#pushpinList li").removeClass('active');
		return;
	}
	$("#pushpinList li").removeClass('active');
	$(this).addClass('active');
})

//点击评分
var scoreList = $(".score_false");

function addScore(score) {
	console.log(scoreList)
	for(var i = 0; i < score; i++) {
		$(scoreList[i]).removeClass('score_false');
		$(scoreList[i]).addClass('score_true');
	}
	scoreList.unbind();
}
//评分hover事件监听
$(scoreList).mouseout(function() {
	$(this).prevAll().removeClass('score_true');
	$(this).prevAll().addClass('score_false');
});
$(scoreList).mouseenter(function() {
	$(this).prevAll().addClass('score_true');
	$(this).prevAll().removeClass('score_false');
});

/**
 * 输入数字限制  100字限制
 */
var textAreaNum = 0;

function textAreaChange(value) {
	textAreaNum++;
	$("#inputNumber").html($("#textArea").val().length);
}
var textReplayNum = 0;

function textReplayChange(value) {
	textReplayNum++;
	$("#replayInputNum").html($("#saytext").val().length);
}

//查看表情结果

function replace_em(str) {

	str = str.replace(/\</g, '&lt;');

	str = str.replace(/\>/g, '&gt;');

	str = str.replace(/\n/g, '<br/>');

	str = str.replace(/\[em_([0-9]*)\]/g, '<img src="qqFaceGif/$1.gif" border="0" />');

	return str;

}
app.controller("header", ["$scope", "$http", function($scope, $http, $window, $location) {
	//获取背景图片
	/**
	 * 书本下滑线样式初始化
	 */
	$.ajax({
			type: "post",
			url: IP + '/homePage/bookCarousel.do',
			async: true,
			data: {
				imageLocation: 4
			}
		})
		.done(function(data, status, headers, config) {
			if(data.flag == 1) {
				if(data.objectList[0]) {
					$scope.backgroudImg = {
						'background-image': 'url(' + data.objectList[0].imageUrl + ')'
					}
				}
			}
		})
	$scope.loginShow = true;
	$scope.person_info = false;
	if(localStorage.userInfo) {
		$scope.loginShow = false;
		$scope.person_info = true;
		$.ajax({
				type: "post",
				url: IP + '/userMoney/queryMoney.do',
				async: true,
				data: {
					id: userId
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.personCenter = data.objectList[0];
					})
				}
			})
	}
	//-----------------------导航条－－－－－－－－－－－－－－－－－－
	//系统消息
	$scope.searchMessage = function() {
			$.ajax({
					type: "post",
					url: IP + "/sysUserMessage/queryMessageCount.do",
					async: true,
					data: {
						userId: userId,
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						$scope.$apply(function() {
							if(data.total == 0) {
								$scope.message_zero = false;
							} else {
								$scope.message_zero = true;
							}
							$scope.message_total = data.total;
							$scope.message = data.objectList;
						})
					} else {
						console.log('消息系统异常', data.flag)
					}
				})
		}
		//动态
	$scope.searchDynamic = function() {
			$scope.dynamicListShow = true;
			$.ajax({
					type: "post",
					url: IP + "/history/queryDynamicRecordList.do",
					async: true,
					data: {
						userId: userId,
						type: 1,
						pageNum: 1,
						numPerPage: 4
					}
				})
				.done(function(data) {
					console.log(data)
					if(data.flag == 1) {
						$scope.$apply(function() {
							$scope.dyMessage = data.objectList;
							$scope.moreDongtai2 = false;
							$scope.moreDongtai3 = false;
							$scope.moreDongtai1 = false;
							if($scope.dyMessage.length == 0) {
								$scope.moreDongtai2 = true;
							} else if($scope.dyMessage.length <= 5) {
								$scope.moreDongtai3 = true;
							} else {
								$scope.moreDongtai1 = true;
							}
						})
					} else {
						console.log('消息系统异常', data.flag)
					}
				})
		}
		//收藏
	$scope.searchCollection = function() {
			$scope.collectListShow = true
			$.ajax({
					type: "post",
					url: IP + "/userBookShelf/queryCollection.do",
					async: true,
					data: {
						id: userId,
						pageNum: 1,
						numPerPage: 5
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						$scope.$apply(function() {
							$scope.collectMesList = data.objectList;
						})
					} else {
						console.log('消息系统异常', data.flag)
					}
				})
		}
		//历史
	$scope.searchHistory = function() {
		$scope.historyListShow = true
		$.ajax({
				type: "post",
				url: IP + "/history/queryPersonHistory.do",
				async: true,
				data: {
					userId: userId,
					type: 2,
					pageNum: 1,
					numPerPage: 5
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.historyList = data.objectList;
					})
				} else {
					console.log('消息系统异常', data.flag)
				}
			})
	}
	$scope.searchMessage(); //系统消息
	//		$scope.searchDynamic();	//动态
	//－－－－－－－－－－－－－－end of 导航条－－－－－－－－－－－－－

	//页面跳转选择
	$scope.returnToWin = function(url) {
			if(isLogin()) {
				window.location.href = "./" + url + ".html";
				return;
			}
			Toast("请先登陆", 1000)
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
		}
		//退出账户
	$scope.signOut = function() {
			localStorage.removeItem('userInfo')
			setCookie("previousURL", location.href);
			window.location.href = "./LoginRegister/login.html";
		}
		/**
		 *搜索 
		 */
		//搜索内容

	$.ajax({
			type: "post",
			url: IP + '/distribute/bookDistribute.do'
		})
		.done(function(data) {
			if(data.flag == 1) {
				$scope.$apply(function() {
					$scope.classifyList = data.objectList;
				})
			}
		})

	$('#search').bind('keypress', function(event) {
		if(event.keyCode == "13") {
			//需要处理的事情
			var _classType = $scope.selectedCode;
			var search = {
				searchValue: $scope.searchContent
			}
			var searchJson = JSON.stringify(search)
			var hrefsrc = window.location;
			var substr = "classify";
			sessionStorage.Search = searchJson;
			if((hrefsrc + "").indexOf(substr) >= 0) {
				window.location.reload();
			} else {
				window.location.href = "../index.html#/classify";
			}
		}
	});
	//选择类型
	//确认搜索
	$scope.searchClass = function() {
		var search = {
			searchValue: $scope.searchContent
		}
		var searchJson = JSON.stringify(search)
		var hrefsrc = window.location;
		var substr = "classify";
		sessionStorage.Search = searchJson;
		if((hrefsrc + "").indexOf(substr) >= 0) {
			window.location.reload();
		} else {
			window.location.href = "../index.html#/classify";
		}
	}
}]);
app.directive('pageRepeat', function() {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {

				pageTab();
			}
		}
	}
});
app.directive("backToTop", function() {
	return {
		restrict: "E",
		link: function(scope, element, attr) {
			var e = $(element);
			$(window).scroll(function() { //滚动时触发  
				if($(document).scrollTop() > 300) //获取滚动条到顶部的垂直高度,到相对顶部300px高度显示  
					e.fadeIn(300)
				else
					e.fadeOut(200);
			});
			/*点击回到顶部*/
			e.click(function() {
				$('html, body').animate({ //添加animate动画效果  
					scrollTop: 0
				}, 500);
			});
		}
	};
});
//尾部图片数据
app.controller("footerControll", function($scope, $http) {
	$scope.footerShow = function() {
		$.ajax({
				type: "post",
				url: IP + '/homePage/bookCarousel.do',
				async: true,
				data: {
					imageLocation: 1
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.footerList = data.objectList;
					})
				}
			})
		$.ajax({
				type: "post",
				url: IP + '/homePage/bookCarousel.do',
				async: true,
				data: {
					imageLocation: 2
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.QRcode = data.objectList[0].imageUrl;
					})
				}
			})
	}
})

/**
 * 关注，取消关注，私信更改方法
 */
//加关注
function addAttention(id, positionId, i) {
	if(!isLogin()) {
		Toast("请先登陆", 1000);
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
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
			if(data.flag == 1) {
				if(data.objectList) {
					if(i == 1) {
						$(".commentIsFans").hide();
						$(".unCommentIsFans").show();
					} else {
						$(".isFans").hide();
					}
					Toast("感谢关注", 1000);
				}
			}
		})
}
//私信
function toSixin(id) {
	if(!isLogin()) {
		Toast("请先登陆", 1000);
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
		return;
	}
	window.open(CurrentIp + '/html/messageCenter/personal.html?id=' + id);
}
//取消关注
function commentCancelFlows(id, i) {
	console.log(id + " " + userId)
	if(!isLogin()) {
		Toast("请先登陆", 1000);
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
		return;
	}
	$.ajax({
			type: "post",
			url: IP + '/userFollow/cancelFlows.do',
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
					if(i == 1) {
						$(".unCommentIsFans").hide();
						$(".commentIsFans").show();
					} else {
						$(".isFans").show()
					}
					Toast("取消关注", 1000);
				}
			}
		})
}