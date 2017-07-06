var app = angular.module("codeOldPhoneApp", []);
app.controller("codeOldPhoneC", function($scope, $window, $interval) {
	if(!isLogin()) {
		Toast("请先登陆", 1000);
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='../../LoginRegister/login.html'", 1000);
		return;
	}

	$scope.changFrameTop1 = function(frame_src) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='../../LoginRegister/login.html'", 1000);
			return;
		}
		$window.open("../sildebar.html?needUrl=" + frame_src, "_self");
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
						$scope.$apply(function() {
							$scope.message_total = data.total + sixinInfoNum;
							$scope.message = data.objectList;
							$scope.message[4] = sixinInfoNum;
							if(data.total == 0 && sixinInfoNum == 0) {
								$scope.message_zero = false;
							} else {
								$scope.message_zero = true;
							}
						})
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
		setTimeout("window.location.href='../../LoginRegister/login.html'", 10);
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
	//页面跳转选择
	$scope.returnToWin = function(url) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='../../LoginRegister/login.html'", 1000);
			return;
		}
		window.open("../../" + url + ".html")
	}
	var newEmail = location.href.split("=")[1];

	$scope.headUrl = userInfo.headUrl;

	/**
	 * 导航部分跳转
	 * @param {Object} index
	 */
	$scope.jumpIndex = function(index) {
		switch(index) {
			case 1:
				$window.open("../../../index.html#/homePage");
				break;
			case 2:
				$window.open("../../../index.html#/classify");
				break;
			case 3:
				$window.open("../../../index.html#/stapleHall");
				break;
			case 4:
				$window.open("../../../index.html#/association");
				break;
		}
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
		window.location.href = "../../../index.html#/classify";
	}

	$.ajax({
			url: IP + '/userInfoDetail/queryUserInfoDetail.do',
			type: 'POST',
			dataType: 'json',
			async: true,
			data: {
				id: userId
			}
		})
		.done(function(data) {
			if(data.flag == 1) {
				$scope.$apply(function() {
					$scope.email = data.objectList[0].email;
				})
			}
		})
		//验证码倒计时
	$scope.description = "获取验证码";
	var second = 59;
	var timerHandler;
	$scope.sendCode = function() {
			if($scope.rep == false) {
				Toast("请等待" + second + "秒后重发");
				return;
			}
			if($scope.email == undefined) {
				Toast("请稍后..")
				return;
			}
			$scope.sendCodeBack();
			if(timerHandler) {
				return;
			}
			timerHandler = $interval(function() {
				if(second <= 0) {
					$interval.cancel(timerHandler);
					second = 59;
					$scope.description = "获取验证码";
					$scope.wait_time = {
						"background-color": "#ff9900",
						"border-color": "#ff9900",
						"cursor": "pointer"
					}
					$scope.rep = true;
				} else {
					$scope.wait_time = {
						"background-color": "#cccccc",
						"border-color": "#cccccc",
						"cursor": "default"
					}
					$scope.description = second + "秒后重发";
					second--;
					$scope.rep = false;
				}
			}, 1000, 100);
		}
		//end 验证码倒计时

	//发送验证码
	$scope.sendCodeBack = function() {
		$.ajax({
				type: "post",
				url: IP + '/email/emailRegist.do',
				data: {
					email: $scope.email
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					Toast("发送成功，请去邮箱查看");
				} else {
					Toast("发送失败");
				}
			})

	}

	$scope.next = function() {
		//		alert($scope.register_code)
		$.ajax({
				type: "post",
				url: IP + '/email/fixEmailCode.do',
				data: {
					verifyCode: $scope.register_code,
					email: $scope.email
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					//修改邮箱
					$.ajax({
							type: "post",
							url: IP + '/userInfoDetail/fixUserInfoDetail.do',
							data: {
								accountId: userId,
								email: newEmail
							}
						})
						.done(function(data) {
							if(data.flag == 1) {
								$.ajax({
										url: IP + '/userInfoDetail/queryUserInfoDetail.do',
										type: 'POST',
										dataType: 'json',
										async: true,
										data: {
											id: userId
										}
									})
									.done(function(data) {
										localStorage.userInfo = JSON.stringify(data.objectList[0]);
										console.log(JSON.parse(localStorage.userInfo));
										$window.location.href = "modifySuccess.html?email=" + newEmail;
									})

							} else {
								Toast("修改失败");
							}
						})

				} else {
					$scope.$apply(function() {
						$scope.codeShow = true;
					})
				}
			})

	}
})