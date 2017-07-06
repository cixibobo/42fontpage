var app = angular.module('loginApp', []);
// 生成二维码
code = drawPic().toLowerCase();
app.controller('loginCtrl', function($scope, $http, $window) {

	if(localStorage.userAccount != null && localStorage.userAccount != undefined && localStorage.userAccount != "") {
		$scope.login_phone = localStorage.userAccount;
		$scope.login_password = localStorage.password;
		$scope.rememberMe = true;
	} else {
		//记住我
		$scope.rememberMe = false;
	}

	/**
	 * 此标志用来判断是否为搜索还是注册键盘事件
	 */
	$scope.searchTop = false;

	/**
	 * 检测搜索框焦点事件 
	 * @param {Object} f
	 */
	$scope.searchTopF = function(f) {
		if(f == 1) {
			$scope.searchTop = true;
		} else {
			$scope.searchTop = false;
		}
	}

	/**
	 *一个显示正确，其余都为错误
	 */
	$scope.setShow = function(value) {
		$scope.phone_null = false;
		$scope.phone_format = false;
		$scope.phone_login = false;

		$scope.phone_password_null = false;
		$scope.phone_password = false;

		$scope.phone_code = false;
		$scope.phone_code_null = false;

		switch(value) {
			case 'phone_null':
				$scope.phone_null = true;
				break;
			case 'phone_format':
				$scope.phone_format = true;
				break;
			case 'phone_login':
				$scope.phone_login = true;
				break;
			case 'phone_password_null':
				$scope.phone_password_null = true;
				break;
			case 'phone_password':
				$scope.phone_password = true;
				break;
			case 'phone_code':
				$scope.phone_null = true;
				break;
			case 'phone_code_null':
				$scope.phone_null = true;
				break;
			default:
				break;
		}
	}

	$scope.verifyPassword = function() {
		if($scope.login_password == '' || $scope.login_password == null || $scope.login_password.length == 0) {
			$scope.setShow('phone_password_null');
			return;
		}
	}

	/**
	 * 搜索书籍
	 * @param {Object} e
	 */
	$scope.searchBook = function(e) {
		var keycode = window.event ? e.keyCode : e.which;
		if(keycode == 13) {

			$scope.searchClass();
		}
	};

	//	手机号码或者邮箱验证
	$scope.verifyPhone = function() {
			if($scope.login_phone == '' || $scope.login_phone == null) {
				$scope.setShow('phone_null');
				return;
			}
			if((!$scope.login_phone.match(/^1(3|4|5|7|8)\d{9}$/)) && (!$scope.login_phone.match(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/))) {
				$scope.setShow('phone_format');
				return;
			}
			if($scope.login_phone.match(/^1(3|4|5|7|8)\d{9}$/)) {
				$.ajax({
						type: "post",
						url: IP + '/login/verifyNickName.do',
						async: true,
						data: {
							phone: $scope.login_phone
						}
					})
					.done(function(data) {
						if(data.flag == 1) {
							if(data.objectList == false) {
								$scope.setShow('phone_login');
								return;
							}
							if(data.objectList == true) {
								$scope.phone_login = false;
							}
						}
					})
			}
			if($scope.login_phone.match(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/)) {
				$.ajax({
						type: "post",
						url: IP + '/login/verifyNickName.do',
						async: true,
						data: {
							email: $scope.login_phone
						}
					})
					.done(function(data) {
						if(data.flag == 1) {
							if(data.objectList == false) {
								$scope.setShow('phone_login');
								return;
							}
							if(data.objectList == true) {
								$scope.phone_login = false;
							}
						}
					})
			}
		}
		//点击投稿事件
	$scope.subMission = function() {
			Toast("请先登录", 1000);
		}
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

	//点击enter确认搜索
	document.onkeydown = function(event) {
		var e = event || window.event || arguments.callee.caller.arguments[0];
		if(e && e.keyCode == 13) {
			if(!$scope.searchTop) {
				//登录
				$scope.login_code = ($("#vcode").val());
				$scope.loginFunction();
			}
		}
	};

	$scope.loginFunction = function() {
		if(isNull($scope.login_phone)) {
			Toast("请输入手机号码或者邮箱", 1000)
			return;
		}
		if(isNull($scope.login_code)) {
			Toast("请输入验证码", 1000)
			return;
		}
		//加入登录验证是否为空，不然会车会报错！！
		//验证码验证
		var login_code = $scope.login_code;
		//		var code_LowerCase=code;
		if(login_code.toLowerCase() != code) {
			Toast("验证码错误", 1000)
			$scope.phone_code = true;
			drawPic().toLocaleLowerCase();
			code = drawPic().toLowerCase();
			return
		}
		var passWord;
		if($scope.login_password) {
			passWord = hex_md5($scope.login_password);
		}
		if($scope.login_phone.match(/^1(3|4|5|7|8)\d{9}$/)) {
			$.ajax({
					type: "post",
					url: IP + '/login/loginVerify.do',
					async: true,
					data: {
						phone: $scope.login_phone,
						password: passWord
					}
				})
				.done(function(data, status, headers, config) {
					console.log(data)
					if(data.flag == 0) {
						Toast("账号或者密码错误", 1000);
					}
					if(data.flag == 1) {
						Toast("欢迎浏览42文库", 1000)
						$scope.phone_login = true;
						userId = data.objectList;

						//加入localStorage
						if($scope.rememberMe) {
							//账号
							localStorage.userAccount = $scope.login_phone;
							//密码
							if(data.objectList[0].password != null && data.objectList[0].password != undefined && data.objectList[0].password.length > 0) {
								localStorage.password = $scope.login_password;
							}
						} else {
							if(localStorage.userAccount) {
								localStorage.userAccount = "";
								localStorage.password = "";
							}
						}

						localStorage.userInfo = JSON.stringify(data.objectList[0]);
						localStorage.userName = $scope.login_phone;
						localStorage.password = $scope.login_password;

						if(getCookie('previousURL')) {
							setTimeout("window.location.href =getCookie('previousURL')", 1000)
						} else {
							setTimeout("window.location.href = '../../index.html'", 1000)
						}

					} else {
						$scope.phone_login = false;
					}

				})
				.error(function(data, status, headers, config) {
					console.log("验证手机号码服务器错误")
				});
		}

		if($scope.login_phone.match(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/)) {
			$.ajax({
					type: "post",
					url: IP + '/login/loginVerify.do',
					async: true,
					data: {
						email: $scope.login_phone,
						password: passWord
					}
				})
				.done(function(data, status, headers, config) {
					if(data.flag == 0) {
						Toast("账号或者密码错误", 1000);
					}

					//alert(data.flag)
					if(data.flag == 1) {
						Toast("欢迎浏览42文库", 1000)
						$scope.phone_login = true;
						userId = data.objectList;
						//加入localStorage
						if($scope.rememberMe) {
							//账号
							localStorage.userAccount = $scope.login_phone;
							//密码
							if(data.objectList[0].password != null && data.objectList[0].password != undefined && data.objectList[0].password.length > 0) {
								localStorage.password = $scope.login_password;
							}
						} else {
							if(localStorage.userAccount) {
								localStorage.userAccount = "";
								localStorage.password = "";
							}
						}
						localStorage.userInfo = JSON.stringify(data.objectList[0]);
						localStorage.userName = $scope.login_phone;
						localStorage.password = $scope.login_password;
						if(getCookie('previousURL')) {
							setTimeout("window.location.href =getCookie('previousURL')", 1000)

						} else {
							setTimeout("window.location.href = '../../index.html'", 1000)
						}

					} else {
						$scope.phone_login = false;
					}

				})
				.error(function(data, status, headers, config) {
					console.log('验证邮箱失败')
				});
		}
	}
})