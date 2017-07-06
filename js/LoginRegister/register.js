var app = angular.module('register', []);
// 生成二维码
var code;
app.controller('registerCtrl', function($scope, $interval, $http, $window) {
	$scope.registerClickButtonShow = true;
	$scope.registerValue = "注册";
	$scope.userType = 'guest';
	$scope.change = false;
	$scope.change_P = false;
	//验证码倒计时
	$scope.description = "点击获取";
	var second = 59;
	var timerHandler;
	$scope.phoneRegister = true;
	var isPhoneRegister = 0;
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
	 *转换注册方式 
	 * 这里将localStorage.setItem的值改成了数字，如果用true或者false有问题
	 */
	$scope.changeToPhone = function() {
		$scope.phoneRegister = !$scope.phoneRegister;
		if($scope.phoneRegister) {
			localStorage.setItem("_registerState", 1);
			localStorage.setItem("_registerStateReg", "手机注册")
		} else {
			localStorage.setItem("_registerState", 2);
			localStorage.setItem("_registerStateReg", "邮箱注册")
		}
		window.location.reload(true);
	}
	$scope.titleReg = "手机注册";
	if(localStorage.getItem('_registerState')) {
		var flag = localStorage.getItem('_registerState');
		if(flag == 1) {
			//		$scope.phoneRegister = eval(flag.toLowerCase());
			$scope.phoneRegister = true;
		} else {
			$scope.phoneRegister = false;
		}
		if(localStorage.getItem('_registerState') == 1) {
			isPhoneRegister = 0;
		} else {
			isPhoneRegister = 1;
		}
		$scope.titleReg = localStorage.getItem("_registerStateReg");
		localStorage.removeItem('_registerState');

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

	//输入图片验证码点击确定事件
	$scope.inputCodeSure = function() {
		if($scope.description != "点击获取"){
			Toast("请稍后再次发送");
			return;
		}
		//如果是手机注册
		if($scope.phoneRegister) {
			//若已经显示图片验证码
			if($scope.sendCodefigure) {
				//前台先验证
				//成功后发送短信验证码
				if($scope.verifyCodeP()) {
					$scope.sendCode();
				}
			} else {
				$scope.sendCodeFigureSet();
			}
		} else {
			//若已经显示图片验证码
			if($scope.sendCodefigure) {
				//前台先验证
				//成功后发送邮箱验证码
				if($scope.verifyCodeE()) {
					$scope.sendMail();
				}
			} else {
				$scope.sendCodeFigureSetEmail();
			}
		}
	}
	
	//重新获取图片验证码
	$scope.reGetPicCode=function(){
		if($scope.phoneRegister){
			$scope.sendCodeFigureSet();
		}else{
			$scope.sendCodeFigureSetEmail();
		}
	}

	/**
	 * 发送手机验证码
	 */
	$scope.sendCode = function() {

		if(isNull($scope.register_mobile)) {
			Toast("请输入手机号码", 1000)
			return;
		}
		if(!$scope.verifyPhone()) {
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/sms/sendDaYuMessage.do',
				async: true,
				data: {
					userNumber: $scope.register_mobile,
					verifyCode: $scope.login_code
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.objectList == null) {
					if(data.alibaba_aliqin_fc_sms_num_send_response) {
						if(data.alibaba_aliqin_fc_sms_num_send_response.result) {
							if(data.alibaba_aliqin_fc_sms_num_send_response.result.success) {
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
							} else {
								Toast("请等60秒后再次发送")
							}
						} else {
							Toast("请等60秒后再次发送")
						}
					} else {
						$scope.$apply(function() {
							$scope.phone_code = true;
						})
						$scope.sendCodeFigureSet();
					}

				} else {

				}
				//				if(data.alibaba_aliqin_fc_sms_num_send_response) {
				//					if(data.alibaba_aliqin_fc_sms_num_send_response.result) {
				//						if(data.alibaba_aliqin_fc_sms_num_send_response.result.success) {
				//
				//						} else {
				//							Toast("请等60秒后再次发送")
				//						}
				//					} else {
				//						Toast("请等60秒后再次发送")
				//					}
				//				} else {
				//					//					Toast("请等60秒后再次发送")
				//				}

			})
		//			if(timerHandler) {
		//				return;
		//			}

	}
	/**
	 *验证邮箱格式 
	 */
	$scope.verifyMail = function() {
		if($scope.register_mail == '' || $scope.register_mail == null) {
			$scope.$apply(function() {
				$scope.setShow('email_null')
			})
			return false;
		}
		var _Reg = "/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/";
		if(!$scope.register_mail.match(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/)) {
			$scope.setShow('emailError')
			return false;
		}
		$.ajax({
				type: "post",
				url: IP + '/email/verifyEmail.do',
				async: true,
				data: {
					email: $scope.register_mail
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					if(data.objectList == false) {
						$scope.$apply(function() {
							$scope.email_register = true;
						})
					}
					if(data.objectList == true) {
						$scope.$apply(function() {
							$scope.email_register = false;
							$scope.setShow('email_register_show')
						})
					}
				}
			})
		if(!$scope.email_register) {
			return false;
		}
		return true;
	}
	/**
	 * 发送邮箱验证码
	 */
	$scope.sendMail = function() {
		isPhoneRegister = 1;
		if(isNull($scope.register_mail)) {
			Toast("请输入邮箱", 1000)
			return;
		}
		if(!$scope.verifyMail()) {
			return;
		}
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
		$.ajax({
				type: "post",
				url: IP + "/email/emailRegist.do",
				async: true,
				data: {
					nickName: $scope.nickName,
					email: $scope.register_mail,
					code: $scope.login_code,
					password: $scope.register_password
				}
			})
			.done(function(data) {
				alert(JSON.stringify(data))
				if(data.objectList != null) {
					$scope.$apply(function() {
						$scope.phone_code = true;
						$scope.sendCodeFigureSetEmail();
					})
				}
			})
	}

	//end 验证码倒计时
	/**
	 * val制为true,other false
	 */
	$scope.setShow = function(value) {
		$scope.change = false;
		$scope.ishave = false;
		$scope.password_null = false;
		$scope.password_S = false;
		$scope.phone_null = false;
		$scope.password_SR = false;
		$scope.password_R = false;
		$scope.password_null_R = false;
		$scope.phone_format = false;
		$scope.phone_register = false;
		$scope.email_register = false;
		$scope.email_null = false;
		$scope.emailError = false;
		$scope.codeError = false;
		$scope.email_code_error = false;
		$scope.register_protocol_show = false;
		$scope.phone_code = false;
		$scope[value] = true;
	}

	//发送验证
	$scope.sendCodeBack = function() {
		$.ajax({
				type: "post",
				url: IP + '/sms/sendDaYuMessage.do',
				async: true,
				data: {
					userNumber: $scope.register_mobile,
					verifyCode: $scope.login_code
				}
			})
			.done(function(data) {
				if(data.objectList == null) {
					Toast("验证码已失效，请重新获取")
					$scope.$apply(function() {
						$scope.phone_code = true;
					})
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
					Toast("请等60秒后再次发送")
				}
			})

	}
	//验证昵称是否可用
	$scope.verifyName = function() {
		if($scope.nickName == '' || $scope.nickName == null) {
			$scope.setShow('change')
			return false;
		}
		$.ajax({
				type: "post",
				url: IP + '/login/verifyNickName.do',
				async: true,
				data: {
					nickName: $scope.nickName
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					//
					if(data.objectList == false) {
						$scope.ishave = false;
					}
					if(data.objectList == true) {
						$scope.$apply(function() {
							$scope.setShow('ishave')
						})

					}
				}
			})
		if(!$scope.ishave) {
			return true;
		}
		return false;

	}
	//检查密码是否有效
	$scope.verifyPassWord = function() {
		if($scope.register_password == '' || $scope.register_password == null || $scope.register_password.length == 0) {
			$scope.setShow('password_null')
			return false;
		}
		if($scope.register_password.length < 6 || $scope.register_password.length > 12) {
			$scope.setShow('password_S')
			return false
		}
		return true;
	}
	//检查第二次密码是否有效
	$scope.verifyPassWordR = function() {
		if($scope.register_password_repert == '' || $scope.register_password_repert == null || $scope.register_password_repert.length == 0) {
			$scope.setShow('password_null_R')
			return false;
		}
		if($scope.register_password_repert.length < 6 || $scope.register_password_repert.length > 12) {
			$scope.setShow('password_SR')
			return false;
		}
		if($scope.register_password != $scope.register_password_repert) {
			$scope.setShow('password_R')
			return false;
		}
		return true;
	}
	//验证手机号码
	$scope.verifyPhone = function() {
		if($scope.register_mobile == '' || $scope.register_mobile == null || $scope.register_mobile.length == 0) {
			$scope.setShow('phone_null')
			return false;
		}
		if(!$scope.register_mobile.match(/^1(3|4|5|7|8)\d{9}$/)) {
			$scope.setShow('phone_format')
			return false;
		}
		$.ajax({
				type: "post",
				url: IP + '/login/verifyNickName.do',
				async: true,
				data: {
					phone: $scope.register_mobile
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					if(data.objectList == false) {
						$scope.$apply(function() {
							$scope.phone_register = false;
						})
					}
					if(data.objectList == true) {
						$scope.$apply(function() {
							$scope.phone_register = true;
							$scope.setShow('phone_register')
						})
					}
				}
			})
		if(!$scope.phone_register) {
			return true;
		}
		return false;
	}

	/*	//检查密码是否有效
		$scope.verifyPassWord = function() {
				if($scope.register_password == '' || $scope.register_password == null) {
					$scope.setShow('password_null')
					return false;
				}
				if($scope.register_password.length < 6 || $scope.register_password.length > 12) {
					$scope.setShow('password_S')
					return false
				}
				return true;
			}*/
	//同意协议事件
	$scope.agreeProtocol = function() {
		if($scope.register_protocol) {
			$scope.register_protocol_show = false;
		}
	}

	//点击投稿事件
	$scope.subMission = function() {
		Toast("请先登录", 1000);
	}

	//点击enter确认搜索
	document.onkeydown = function(event) {
		var e = event || window.event || arguments.callee.caller.arguments[0];
		if(e && e.keyCode == 13) {
			if(!$scope.searchTop) {
				//注册
				$scope.register();
			}

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
	$scope.loLogin = function() {
		$window.location.href = "./login.html"
	}

	//前台验证手机图片验证码
	$scope.verifyCodeP = function() {
		if($scope.login_code == null) {
			$scope.phone_code = true;
			return false;
		}
		//图片验证码验证
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
	//前台验证邮箱图片验证码
	$scope.verifyCodeE = function() {
		if($scope.login_code == null) {
			$scope.phone_code = true;
			return false;
		}
		//图片验证码验证
		var login_code = $scope.login_code;
		//		var code_LowerCase=code;
		if(login_code.toLowerCase() != code) {
			$scope.phone_code = true;
			$scope.sendCodeFigureSetEmail();
			return false;
		} else {
			return true;
		}
	}
	var cishuLimit = 0;
	var timeLimit = 300;
	var timerHandlerCode;
	//获取后台生成的手机图片验证码
	$scope.sendCodeFigureSet = function() {
		if(!$scope.register_mobile) {
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
					numberPhone: $scope.register_mobile
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
	var frequencyLimitEmail = 0;
	var timeLimitEmail = 300;
	var timerHandlerCodeEmail;
	//获取后台生成的邮箱图片验证码
	$scope.sendCodeFigureSetEmail = function() {
		if(!$scope.register_mail) {
			Toast("请先输入邮箱", 1000);
			return;
		}
		//验证邮箱存在否
		if(!$scope.verifyMail()) {
			return;
		}
		frequencyLimitEmail++;
		if(frequencyLimitEmail > 3) {
			$scope.sendCodefigure = false;
			Toast("频率太快了，请5分钟后再试")
			timerHandlerCodeEmail = $interval(function() {
				if(timeLimitEmail <= 0) {
					$interval.cancel(timerHandlerCodeEmail);
					timeLimitEmail = 300;
					frequencyLimitEmail = 0;
				} else {
					timeLimitEmail--;
				}
			}, 1000, 100);
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/verifyCode/verifyCodeEmail.do',
				async: true,
				data: {
					email: $scope.register_mail
				}
			})
			.done(function(data) {
				if(data.verifyCodeEmail) {
					$scope.$apply(function() {
						$scope.sendCodefigure = true;
					})

					$("#codeValue").html(data.verifyCodeEmail)
					code = drawPicRegister(data.verifyCodeEmail).toLowerCase();
				} else {
					Toast("超时，请稍后再试", 1000);
				}
			})
	}

	//提交注册
	$scope.register = function() {

		if(isNull($scope.nickName)) {
			Toast("请输入昵称", 1000)
			return;
		}
		if(!$scope.verifyName()) {
			return;
		}
		if(!$scope.verifyPassWord()) {
			return;
		}
		if(!$scope.verifyPassWordR()) {
			return;
		}
		if(!$scope.register_protocol) {
			$scope.register_protocol_show = true;
			return;
		}
		//验证码验证
		var login_code = $scope.login_code;
		//		var code_LowerCase=code;
		if(login_code.toLowerCase() != code) {
			$scope.phone_code = true;
			drawPic().toLocaleLowerCase();
			code = drawPic().toLowerCase();
			return;
		}
		var passWord = hex_md5($scope.register_password);
		if($scope.phoneRegister) {
			if(!$scope.verifyPhone()) {
				return;
			}
			if(isNull($scope.register_mobile)) {
				Toast("请输入手机号码", 1000)
				return;
			}
			if(isNull($scope.register_code)) {
				Toast("请输入验证码", 1000)
				return;
			}
			$scope.registerValue = "";
			$scope.registerClickButtonShow = false;
			$.ajax({
					type: "post",
					url: IP + '/login/registerAccount.do',
					async: true,
					data: {
						phone: $scope.register_mobile,
						nickName: $scope.nickName,
						password: passWord,
						verifyCode: $scope.register_code
					}
				})
				.done(function(data) {
					console.log(data)
					if(data.code == 0003) {
						$scope.setShow('codeError')
						$scope.$apply(function() {
							$scope.registerClickButtonShow = true;
							$scope.registerValue = "注册";
						})
					} else {
						if(data.flag == 1) {
							$scope.$apply(function() {
								Toast("注册成功", 1000);
								$scope.registerValue = "注册";
								$scope.registerClickButtonShow = true;
								//账号
								localStorage.userAccount = $scope.register_mobile;
								//密码
								localStorage.password = $scope.register_password;
								localStorage.setItem("userId", data.objectList);
								var tologinl = $interval(function() {
									$interval.cancel(tologinl);
									$window.location.href = "./login.html";
								}, 1000);

							})
						} else {
							$scope.$apply(function() {
								$scope.registerClickButtonShow = true;
								$scope.registerValue = "注册";
							})
							Toast("注册失败，请重新注册", 1000)
						}
						$scope.$apply(function() {
							$scope.registerClickButtonShow = true;
							$scope.registerValue = "注册";
						})
					}
				})
		}
		if(!$scope.phoneRegister) {
			if(isNull($scope.register_mail)) {
				Toast("请输入邮箱", 1000)
				return;
			} else {
				if(!$scope.verifyMail()) {
					return;
				}
			}
			if(isNull($scope.email_code)) {
				Toast("请输入验证码", 1000)
				return;
			}
			$scope.registerValue = "";
			$scope.registerClickButtonShow = false;
			$.ajax({
					type: "post",
					url: IP + '/email/registerAccount.do',
					async: true,
					data: {
						email: $scope.register_mail,
						nickName: $scope.nickName,
						password: passWord,
						verifyCode: $scope.email_code
					}
				})
				.done(function(data) {
					console.log(data)
					if(data.code == 0003) {
						Toast("验证码错误", 1000)
						$scope.$apply(function() {
							$scope.registerClickButtonShow = true;
							$scope.registerValue = "注册";
						})

					}
					if(data.flag == 1) {
						//alert(111)
						$scope.$apply(function() {
							Toast("注册成功", 1000);
							$scope.registerClickButtonShow = true;
							$scope.registerValue = "注册";
							//账号
							localStorage.userAccount = $scope.register_mail;
							//密码
							localStorage.password = $scope.register_password;
							localStorage.setItem("userId", data.objectList);

							var tologinl = $interval(function() {
								$interval.cancel(tologinl);
								$window.location.href = "./login.html";
							}, 1000);

						})
					} else {
						Toast("请求错误，请稍后再试")
						$scope.$apply(function() {
							$scope.registerClickButtonShow = true;
							$scope.registerValue = "注册";
						})
					}
				})
		}

	}
});

app.directive('ngEnter', function() {
	return function(scope, element, attrs) {
		element.bind("keydown keypress", function(event) {
			if(event.which === 13) {
				scope.$apply(function() {
					scope.$eval(attrs.ngEnter);
				});
				event.preventDefault();
			}
		});
	};
});