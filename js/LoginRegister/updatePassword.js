var app = angular.module("fixPsdApp", []);
code = drawPic().toLowerCase();
app.controller("fixPsdC", function($scope, $interval, $http, $window) {

	if(!isLogin()) {
		Toast("请先登陆", 1000);
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='../../html/LoginRegister/login.html'", 1000);
		return;
	}

	$scope.changFrameTop1 = function(frame_src) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='../../html/LoginRegister/login.html'", 1000);
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

						if(!data.objectList[0]) {
							$scope.dyMessage = data.objectList;
						}
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

	$scope.headUrl = userInfo.headUrl;

	$scope.signOut = function() {
		localStorage.removeItem('userInfo')
		setTimeout("window.location.href='../../html/LoginRegister/login.html'", 10);
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
			setTimeout("window.location.href='../../html/LoginRegister/login.html'", 1000);
			return;
		}
		window.open("../../html/" + url + ".html")
	}

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

	$scope.change = false;
	$scope.change_P = false;
	var id = userId;
	//检查输入的旧密码
	$scope.verifyOldPassWord = function() {
			if($scope.oldPsd == '' || $scope.oldPsd == null) {
				$scope.change = true;
				return;
			}
			if($scope.oldPsd.length < 6 || $scope.oldPsd.length > 12) {
				$scope.change = true;
			}
		}
		//检查输入的新密码
	$scope.verifyNewPassWord = function() {
			if($scope.newPsd == '' || $scope.newPsd == null) {
				$scope.password_S = true;
				return;
			}
			if($scope.newPsd.length < 6 || $scope.newPsd.length > 12) {
				$scope.password_S = true;
			}
		}
		//检查输入的验证码
	$scope.verifyCode = function() {
		if($scope.login_code == '' || $scope.login_code == null) {
			$scope.phone_code = true;
			return;
		}
	}

	//检查输入的新密码
	$scope.verifyReNewPassWord = function() {
			if($scope.newPsd == '' || $scope.newPsd == null) {
				$scope.password_S = true;
				return;
			}
			if($scope.reNewPsd != $scope.newPsd) {
				$scope.Npassword_N = true;
				return;
			}

		}
		//提交修改
	$scope.fixPsd = function() {
		$scope.verifyReNewPassWord();
		$scope.verifyNewPassWord();
		$scope.verifyCode();
		$scope.verifyOldPassWord();
		if($scope.change || $scope.ishave || $scope.password_S || $scope.Npassword_S || $scope.Npassword_N || $scope.phone_code) {
			return;
		}
		//验证码验证
		var login_code = $scope.login_code;
		//		var code_LowerCase=code;
		if(login_code.toLowerCase() != code) {
			Toast("验证码错啦", 1000)
			$scope.phone_code = true;
			return
		}
		var passWord;
		var oldPassWord;
		if($scope.newPsd) {
			passWord = hex_md5($scope.newPsd);
		}
		if($scope.oldPsd) {
			oldPassWord = hex_md5($scope.oldPsd);
		}
		console.log(1111111111111)
		$http({
				method: 'post',
				url: IP + '/userInfoDetail/fixUserPhoneHead.do',
				params: {
					id: id,
					oldPassword: oldPassWord
				}
			})
			.success(function(data, status, headers, config) {
				console.log(data)
				if(data.flag == 1) {
					if(data.code == 100) {
						Toast("原密码不对呦", 2000);
						$scope.ishave = true;
						return;
					} else {
						$http({
								method: 'post',
								url: IP + '/userInfoDetail/fixUserPhoneHead.do',
								params: {
									id: id,
									password: passWord
								}
							})
							.success(function(data, status, headers, config) {
								if(data.flag == 1) {
									Toast("修改密码成功啦", 2000);
								}
							})
							.error(function(data, status, headers, config) {
								Toast("修改密码失败", 2000);
							});
					}
					Toast("修改密码成功啦", 2000);
				}
			})
			.error(function(data, status, headers, config) {
				Toast("修改密码失败", 2000);
			});
	}

});