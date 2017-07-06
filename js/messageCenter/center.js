var app = angular.module("centerApp", ['tm.pagination']);
var Request = new Object();
Request = GetRequest();
app.controller("centerC", function($scope, $window) {
	if(!isLogin()) {
		Toast("请先登陆", 1000);
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='../LoginRegister/login.html'", 1000);
		return;
	}

	$scope.changFrameTop1 = function(frame_src) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='../LoginRegister/login.html'", 1000);
			return;
		}
		$window.open("../personCenter/sildebar.html?needUrl=" + frame_src, "_self");
	}

	if(localStorage.userInfo) {
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
						if(sessionStorage.getItem("sixinInfoNum")) {
							sixinInfoNum = parseInt(sessionStorage.getItem("sixinInfoNum"));
						}
						$scope.message_total = data.total + sixinInfoNum;
						$scope.message = data.objectList;
						$scope.message[4] = sixinInfoNum;
						if(data.total == 0 && sixinInfoNum == 0) {
							$scope.message_zero = false;
						} else {
							$scope.message_zero = true;
						}
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

				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.dyMessage = data.objectList;
						$scope.moreDongtai2 = false;
						$scope.moreDongtai3 = false;
						$scope.moreDongtai1 = false;
						if($scope.dyMessage == null || $scope.dyMessage.length == 0) {
							$scope.moreDongtai2 = true;
						} else if($scope.dyMessage.length <= 5) {
							$scope.moreDongtai3 = true;
						} else {
							$scope.moreDongtai1 = true;
						}
						console.log($scope.moreDongtai3)
					})
				} else {
					console.log('消息系统异常', data.flag)
				}
			})
	}

	$scope.signOut = function() {
		localStorage.removeItem('userInfo')
		setTimeout("window.location.href='../LoginRegister/login.html'", 10);
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

	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 20
	};

	//页面跳转选择
	$scope.returnToWin = function(url) {
		if(isLogin()) {
			window.open("../" + url + ".html", "_self")
				//window.location.href = "./html/" + url + ".html";
			return;
		}
		//				Toast("请先登陆", 1000);
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
	}

	/**
	 * 将未读消息置为0
	 */
	$.ajax({
		type: "post",
		url: IP + "/sysUserMessage/deleteUserMessage.do",
		async: true,
		dataType: 'json',
		data: {
			userId: userId,
			type: 2
		}
	}).done(function(data) {
		if(data.flag == 1) {
			//alert("消息置为0成功")
		}
	})

	/**
	 * 导航部分跳转
	 * @param {Object} index
	 */
	$scope.jumpIndex = function(index) {
		switch(index) {
			case 1:
				$window.open("../../index.html#/homePage");
				break;
			case 2:
				$window.open("../../index.html#/classify");
				break;
			case 3:
				$window.open("../../index.html#/stapleHall");
				break;
			case 4:
				$window.open("../../index.html#/association");
				break;
		}
	}
	window.onresize = function() {
		$(".content_list_side").css('left', $(".main_content").offset().left);
	}
	$(".content_list_side").css('left', $(".main_content").offset().left);
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
					if(data.flag == 1) {
						$scope.$apply(function() {
							if(data.objectList[0]) {
								$scope.dyMessage = data.objectList;
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

	/**
	 * 搜索书籍
	 * @param {Object} e
	 */
	$scope.searchBook = function(e) {
		var keycode = window.event ? e.keyCode : e.which;
		if(keycode == 13) {
			console.log($scope.searchMain)
			$scope.searchClass();
		}
	};
	//分类搜素
	$scope.searchClass = function() {
		var search = {
			searchValue: $scope.searchMain
		}
		var searchJson = JSON.stringify(search)
		var hrefsrc = window.location;
		var substr = "classify";
		sessionStorage.Search = searchJson;
		sessionStorage.setItem("first", 1);
		window.location.href = "../../index.html#/classify";
	}

	var id = userId;
	$scope.headUrl = userInfo.headUrl;

	$scope.changFrameTop = function(frame_src) {
		$window.location.href = CurrentIp + "/html/personCenter/sildebar.html?needUrl=" + "mybookshelf";
	}

	//跳转到具体的评论
	$scope.jumpBookComment = function(comment) {
		if(comment.sub == 1) {
			$window.open(CurrentIp + "/html/book.html?book_id=" + comment.bookId + "&comment_Id=" + comment.id, "_blank");
		} else {
			$window.open(CurrentIp + "/index.html#/postDetail/" + comment.bookId, "_blank");
		}
	}

	$scope.getAtList = function() {
		$.ajax({
				type: "post",
				url: IP + "/messageCenter/atMe.do",
				async: true,
				dataType: 'json',
				data: {
					toAtUserId: id,
					numPerPage: $scope.paginationConf.itemsPerPage,
					pageNum: $scope.paginationConf.currentPage
				}
			}).done(function(data) {
				console.log(data)
				if(data.total == 0) {
					$scope.$apply(function() {
						$scope.isShow = true;
					})
				}
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.paginationConf.totalItems = data.total;
						$scope.atList = data.objectList;
					})
				} else {
					console.log("失败")
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
	}
	$scope.getAtList();
	// 重新获取数据条目
	var reGetProducts = function() {
		$scope.getAtList();
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

	$scope.atLocation = function(at) {
		if(at.type == 0) {
			at.locationAt = "书《" + at.bookName + "》";
		} else if(at.type == 1) {
			at.locationAt = "书评：" + at.bookCommentName + " ";
		} else if(at.type == 2) {
			at.locationAt = "同好会帖子：" + at.posterName + " ";
		} else if(at.type == 3) {
			at.locationAt = "同好会回帖：" + at.posterCommentName + " ";
		}
		return true;

	}
});
app.filter('trustHtml', function($sce) {
	return function(input) {
		return $sce.trustAsHtml(input);
	}
});