var app = angular.module("systemApp", ['tm.pagination']);
app.controller("systemC", function($scope, $timeout, $window) {
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

	var id = userId;

	$scope.detailShow = true;

	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 20
	};
	$scope.headUrl = userInfo.headUrl;
	window.onresize = function() {
		$(".content_list_side").css('left', $(".main_content").offset().left);
	}
	$(".content_list_side").css('left', $(".main_content").offset().left);
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
			type: 4
		}
	}).done(function(data) {
		if(data.flag == 1) {
			//alert("消息置为0成功")
		}
	})

	/**
	 * 顶部消息导航
	 */
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

	$scope.changFrameTop = function(frame_src) {
		$window.location.href = CurrentIp + "/html/personCenter/sildebar.html?needUrl=" + "mybookshelf";
	}

	/**
	 * 判断是否有链接
	 * @param {Object} sysinfo
	 */
	$scope.detailShow = function(sysinfo) {
		if(sysinfo.url == null || sysinfo.url == undefined || sysinfo.url == "") {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * 用户点击查看详情
	 * @param {Object} sysinfo
	 */
	var sysInfoSave;
	//书名
	$scope.bookName;
	//多少股权
	$scope.stockNum;
	//多少钱
	$scope.money
		//什么时间结束
	$scope.endTime;
	//书的ID用来跳转到书的详情
	var bid;
	//记录id
	var tid;
	//通知ID
	var noTid;
	$scope.detail = function(sysinfo) {
		if(sysinfo.state == 1) {
			Toast("你没有同意转让~")
			return;
		}
		if(sysinfo.state == 2) {
			Toast("你已经同意啦~")
			return;
		}
		//检测是书的ID还是活动地址
		bid = sysinfo.url.split("_")[2];
		noTid = sysinfo.id;
		//存在是书的股权转让
		if(bid != null && bid != undefined && bid != "") {
			//查询书的详细信息
			$.ajax({
					url: IP + '/sysNotice/queryTradeHistory.do',
					type: 'POST',
					dataType: 'json',
					async: true,
					data: {
						tradeCode: sysinfo.url
					}
				})
				.done(function(data) {
					console.log(data);
					//绑定数据到前端
					$scope.$apply(function() {
						$scope.bookName = data.objectList[0].bookName;
						$scope.stockNum = data.objectList[0].shellNum;
						$scope.money = data.objectList[0].sellUnit * data.objectList[0].shellNum;
						$scope.endTime = sysinfo.endTime.substring(0, 10);
						tid = data.objectList[0].id;
						//显示提示框
						$scope.detailInfo = true;
					})
				})
		}
		//不存在，活动地址。
	}

	/**
	 * 跳转到图书详情界面
	 */
	$scope.jumpBook = function() {
		$window.open("../book.html?book_id=" + bid);
	}

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

	// 重新获取数据条目
	var reGetProducts = function() {
		$.ajax({
				url: IP + '/sysNotice/selectSysNotice.do',
				type: 'POST',
				dataType: 'json',
				async: true,
				data: {
					toUserId: id,
					numPerPage: $scope.paginationConf.itemsPerPage,
					pageNum: $scope.paginationConf.currentPage
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					if(data.total == 0) {
						$scope.$apply(function() {
							$scope.isShow = true;
						})
					}
					$scope.$apply(function() {
						$scope.paginationConf.totalItems = data.total;
						$scope.sysInfoList = data.objectList;
						$scope.sysInfoList.forEach(function(item) {
							if(item.url.split("_")[2]) {
								if(item.state == 1) {
									item.deal = true;
									item.dealInfo = "未同意";
								} else if(item.state == 2) {
									item.deal = true;
									item.dealInfo = "已同意";
								} else {
									item.deal = false;
									item.dealInfo = "查看详情";
								}
							}
						})
					})
				} else {
					console.log("查询系统通知失败")
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
	};

	/**
	 * 点击同意或不同意
	 * @param {Object} i
	 */
	$scope.agree = function(i) {
		var state;
		var tradeState;
		//同意
		if(i == 1) {
			if(tid != null && tid != undefined) {
				state = 2;
				tradeState = 1;
			} else {
				Toast("发生了错误...")
			}
		}

		//不同意
		if(i == 2) {
			if(tid != null && tid != undefined) {
				state = 1;
				tradeState = 2;
			} else {
				Toast("发生了错误...")
			}
		}

		//修改数据
		$.ajax({
				url: IP + '/sysNotice/updateStock.do',
				type: 'POST',
				dataType: 'json',
				async: true,
				data: {
					id: tid,
					tradeState: tradeState,
					state: state,
					noTid: noTid
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					$scope.$apply(function() {
						Toast("处理完成")
						$scope.detailInfo = false;
						$window.location.reload();
					})
				} else {
					if(data.objectList == -3) {
						Toast("账户余额不足~");
					} else {
						Toast("购买出错..")
					}
				}
			})

	}

	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

});