var app = angular.module('forgetPword', []);
app.controller('forgetPwordCtrl', function($scope, $interval, $window) {

	$scope.userType = 'guest';
	$scope.change_Pword = false;
	$scope.change_PAgain = false;

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
	 * 搜索书籍
	 * @param {Object} e
	 */
	$scope.searchBook = function(e) {
		var keycode = window.event ? e.keyCode : e.which;
		if(keycode == 13) {
			$scope.searchClass();
		}
	};
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

	//输入图片验证码点击确定事件
	$scope.inputCodeSure = function() {
		if($scope.sendCodefigure) {
			//前台先验证
			if($scope.verifyCodeP()) {
//				if($scope.phoneRegister) {
					//后台验证
					//				if($scope.getCodeFigureSet()) {
					//成功后发送短信验证码
					$scope.sendCode();
					//				} else {
					//					$scope.phone_code = true;
					//				}
//				} else {
//					$scope.sendMail();
//				}
			} else {
				$scope.phone_code = true;
			}
		} else {
			$scope.sendCodeFigureSet();
		}
	}

	//验证码倒计时
	$scope.description = "获取验证码";
	var second = 59;
	var timerHandler;

	$scope.getShow = function() {
		if($scope.phone_null == true) {
			Toast("请完善信息");
			return true;
		}
		if($scope.phone_register == true) {
			Toast("请完善信息");
			return true;
		}
		if($scope.phone_register == true) {
			Toast("请完善信息");
			return true;
		}
		if($scope.password_err == true) {
			Toast("请完善信息");
			return true;
		}
		if($scope.password_second_err == true) {
			Toast("请完善信息");
			return true;
		}
		if($scope.password_second_null == true) {
			Toast("请完善信息");
			return true;
		}
		if($scope.code_err == true) {
			Toast("请完善信息");
			return true;
		}
		return false;
	}

	$scope.sendCode = function() {
		if(!$scope.verifyPhone()) {
			return;
		}
		if(!$scope.verifyPassword()) {
			return;
		}
		if(!$scope.verifyPassWordAgain()) {
			return;
		}
		if($scope.forget_mobile.split('@')[1] == null) {
			$.ajax({
					type: "post",
					url: IP + '/sms/sendDaYuMessage.do',
					async: true,
					data: {
						userNumber: $scope.forget_mobile,
						verifyCode: $scope.login_code
					}
				})
				.done(function(data) {
					console.log(data)
					if(data.objectList == null) {
						//					Toast("验证码已失效，请重新获取")
						$scope.$apply(function() {
							$scope.phone_code = true;
						})
						$scope.sendCodeFigureSet();
					} else {
						timerHandler = $interval(function() {
							if(second <= 0) {
								$interval.cancel(timerHandler);
								second = 59;
								$scope.description = "点击获取";
								$scope.wait_time = {
									"background-color": "#ff9900",
									"border-color": "#ff9900",
									"cursor": "pointer"
								}
							} else {
								$scope.wait_time = {
									"background-color": "#cccccc",
									"border-color": "#cccccc",
									"cursor": "default"
								}
								$scope.description = second + "秒后重发";
								second--;
							}
						}, 1000, 100);

					}
					if(data.alibaba_aliqin_fc_sms_num_send_response) {
						if(data.alibaba_aliqin_fc_sms_num_send_response.result) {
							if(data.alibaba_aliqin_fc_sms_num_send_response.result.success) {

							} else {
								Toast("请等60秒后再次发送")
							}
						} else {
							Toast("请等60秒后再次发送")
						}
					} else {
						//					Toast("请等60秒后再次发送")
					}

				})
		} else {
			$scope.sendMail();
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
				} else {
					$scope.wait_time = {
						"background-color": "#cccccc",
						"border-color": "#cccccc",
						"cursor": "default"
					}
					$scope.description = second + "秒后重发";
					second--;
				}
			}, 1000, 100);
		}

	}
	//end 验证码倒计时
	/**
	 * val制为true,other false
	 */
	$scope.setShow = function(value) {
		if(value == '' || value == null) {
			return;
		}
		$scope.phone_null = false;
		$scope.phone_err_format = false;
		$scope.phone_register = false;

		$scope.password_null = false;
		$scope.password_err = false;

		$scope.password_second_err = false;
		$scope.password_second_null = false;

		$scope.code_err = false;

		switch(value) {
			case 'phone_null':
				$scope.phone_null = true;
				break;
			case 'phone_err_format':
				$scope.phone_err_format = true;
				break;
			case 'phone_register':
				$scope.phone_register = true;
				break;
			case 'password_null':
				$scope.password_null = true;
				break;
			case 'password_err':
				$scope.password_err = true;
				break;
			case 'password_second_err':
				$scope.password_second_err = true;
				break;
			case 'password_second_null':
				$scope.password_second_null = true;
				break;
			case 'code_err':
				$scope.code_err = true;
				break;
			default:
				break;
		}
	}

	$scope.verifyCodeP = function() {
		if($scope.login_code == null) {
			$scope.phone_code = true;
			return false;
		}
		//验证码验证
		var login_code = $scope.login_code;
		//		var code_LowerCase=code;
		if(login_code.toLowerCase() != code) {
			$scope.phone_code = true;
			$scope.sendCodeFigureSet();
			return false;
		} else {
			return true;
		}
	}
	var cishuLimit = 0;
	var timeLimit = 300;
	//获取后台生成的验证码
	$scope.sendCodeFigureSet = function() {
		if(!$scope.forget_mobile) {
			Toast("请先输入手机号码", 1000);
			return;
		}
		//验证手机号存在否
		if(!$scope.verifyPhone()) {
			return;
		}
		cishuLimit++;
		if(cishuLimit > 3) {
			$scope.sendCodefigure = false;
			Toast("频率太快了，请5分钟后再试")
			timerHandlerCode = $interval(function() {
				if(timeLimit <= 0) {
					$interval.cancel(timerHandlerCode);
					timeLimit = 300;
					cishuLimit = 0;
				} else {
					timeLimit--;
				}
			}, 1000, 100);
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/verifyCode/verifyCode.do',
				async: true,
				data: {
					numberPhone: $scope.forget_mobile
				}
			})
			.done(function(data) {
				if(data.verifyCode) {
					$scope.$apply(function() {
						$scope.sendCodefigure = true;
					})

					$("#codeValue").html(data.verifyCode)
					code = drawPicRegister(data.verifyCode).toLowerCase();
				} else {
					Toast("服务器缓存异常，请稍后再试", 1000);
				}
			})
	}

	/**
	 * 发送邮箱验证码
	 */
	$scope.sendMail = function() {
		$.ajax({
				type: "post",
				url: IP + "/email/emailRegist.do",
				async: true,
				data: {
					email: $scope.forget_mobile
				}
			})
			.done(function(data) {
				if(data.flag == 1) {

				}
			})
	}

	//验证手机号码 如果符合返回true
	$scope.verifyPhone = function() {
		if($scope.forget_mobile == '' || $scope.forget_mobile == null) {
			$scope.setShow('phone_null')
			return false;
		}
		$scope.phone_register = false;
		//判断是手机还是邮箱
		if($scope.forget_mobile.split('@')[1] == null) {
			if(!$scope.forget_mobile.match(/^1(3|4|5|7|8)\d{9}$/)) {
				$scope.setShow('phone_err_format')
				return false;
			}
			$.ajax({
					type: "post",
					url: IP + '/login/verifyNickName.do',
					async: false,
					data: {
						phone: $scope.forget_mobile
					}
				})
				.done(function(data) {
					console.log(data)
					if(data.flag == 1) {
						//true代表已经注册过了，false代表未注册
						if(data.objectList == true) {
							//							$scope.$apply(function() {
							$scope.phone_register = false;
							$scope.setShow('');
							//							})
						}
						if(data.objectList == false) {
							//							$scope.$apply(function() {
							$scope.phone_register = true;
							$scope.setShow('phone_register')
							//							})
						}

					}
				})
		} else {
			var _Reg = "/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/";
			if(!$scope.forget_mobile.match(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/)) {
				$scope.setShow('phone_err_format')
				return false;
			}
			$.ajax({
					type: "post",
					url: IP + '/email/verifyEmail.do',
					async: false,
					data: {
						email: $scope.forget_mobile
					}
				})
				.done(function(data) {
					console.log(data)
					if(data.flag == 1) {
						if(data.objectList == false) {
							//							$scope.$apply(function() {
							$scope.phone_register = true;
							$scope.setShow('phone_register')
							//							})
						}
						if(data.objectList == true) {
							//							$scope.$apply(function() {
							$scope.phone_register = false;
							$scope.setShow('');
							//							})
						}
					}
				})
		}
		return !$scope.phone_register;
	}

	//验证密码
	$scope.verifyPassword = function() {
		//		alert($scope.modify_password)
		if($scope.modify_password == '' || $scope.modify_password == null || $scope.modify_password.length == 0) {
			$scope.setShow('password_null')
			return false;
		}
		if($scope.modify_password.length < 6 || $scope.modify_password.length > 12) {
			$scope.setShow('password_err');
			return false;
		}
		return true;
	}

	//确认输入的密码
	$scope.verifyPassWordAgain = function() {
		if($scope.passwordagain == '' || $scope.passwordagain == null || $scope.passwordagain.length == 0) {
			$scope.setShow('password_second_null')
			return false;
		}
		if($scope.passwordagain != $scope.modify_password) {
			$scope.setShow('password_second_err')
			return false;
		}

		return true;
	}
	//发送验证码
	$scope.sendCodeBack = function() {
		$.ajax({
				type: "post",
				url: IP + '/sms/sendDaYuMessage.do',
				data: {
					userNumber: $scope.forget_mobile,
					verifyCode: $scope.login_code
				}

			})
			.done(function(data) {
				if(data == null) {
					Toast("验证码已失效，请重新获取")
					return;
				}
				if(data.alibaba_aliqin_fc_sms_num_send_response) {
					if(data.alibaba_aliqin_fc_sms_num_send_response.result) {
						if(data.alibaba_aliqin_fc_sms_num_send_response.result.success) {

						} else {
							Toast("请1小时后再次发送")
						}
					} else {
						Toast("请1小时后再次发送")
					}
				} else {
					Toast("请1小时后再次发送")
				}
			})

	}

	/**
	 *修改密码 
	 */
	$scope.modifiedPassWord = function() {

		if(!$scope.verifyPhone()) {
			return
		}
		if(!$scope.verifyPassword()) {
			return;
		}
		if(!$scope.verifyPassWordAgain()) {
			return;
		}
		var phoneNum;
		var emailNum;
		if($scope.forget_mobile.split('@')[1] == null) {
			phoneNum = $scope.forget_mobile;
		} else {
			emailNum = $scope.forget_mobile;
		}
		var pass = hex_md5($scope.modify_password);
		$.ajax({
				type: "post",
				url: IP + '/userInfoDetail/fixUserPhoneHead.do',
				data: {
					email: emailNum,
					phone: phoneNum,
					verifyCode: $scope.passwordCode,
					password: pass
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.code == 0003) {
					//					$scope.setShow('codeError');
					$scope.$apply(function() {
						$scope.code_err = true;
					})
				}
				if(data.flag == 1) {
					$scope.$apply(function() {
						Toast("修改成功", 1000);
						//账号
						localStorage.userAccount = $scope.forget_mobile;
						//密码
						localStorage.password = $scope.modify_password;
						localStorage.setItem("userId", data.objectList);

						var tologinl = $interval(function() {
							$interval.cancel(tologinl);
							$window.location.href = "../../html/LoginRegister/login.html";
						}, 1000);

					})
				}
			})

	}
});