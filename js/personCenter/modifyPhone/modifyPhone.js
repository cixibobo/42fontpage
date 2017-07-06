var app = angular.module("modifyPhoneApp", []);
app.controller("modifyPhoneC", function($scope, $window) {

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

	//若手机号为空且邮箱号不为空,则隐藏当前手机号
	if(!userInfo.phone) {
		$scope.showPhone = true;
	}
	var phone = userInfo.phone;
	$scope.phone = phone.substring(0, 3) + "****" + phone.substring(7, phone.length);

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

	$scope.next = function() {

		if($scope.nickName == null || $scope.nickName.trim() == "" || $scope.nickName.length != 11) {
			$scope.change = true;
			return;
		}
		if(!$scope.nickName.match(/^1(3|4|5|7|8)\d{9}$/)) {
			$scope.change = true;
			return;
		}

		//验证手机号码是否存在
		$.ajax({
				type: "post",
				url: IP + '/login/verifyNickName.do',
				async: true,
				data: {
					phone: $scope.nickName
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						if(data.objectList == false) {
							$scope.ishave = false;
							sessionStorage.setItem("fixPhoneHref", $scope.nickName);
							$window.open("codeNewPhone.html?phone=" + $scope.nickName, "_self");
							return;
						}
						if(data.objectList == true) {
							$scope.ishave = true;
							return;
						}
					})
				}
			})

	}

})