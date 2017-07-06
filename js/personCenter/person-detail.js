var app = angular.module("personDetailApp", []);
var id;
app.controller("personDetail", function($scope, $window, $interval) {
	id = userId;
	var isSign = false;
	$scope.sign_show = false;
	$scope.userImage = null;

	console.log(userInfo)

	$scope.nickNameCheck = "检测昵称";

	//昵称按下事件
	$scope.check = function() {
			$scope.nickNameCheck = "检测昵称";
			$scope.nickOK = false;
		}
		//	var timer = $interval(function() {
		//	}, 1000);
		//	timer.then($scope.check());

	$scope.sexs = [
		"男", "女", "保密"
	]
	console.log(id)
		//查询用户详细信息
	$.ajax({
			url: IP + '/userInfoDetail/queryUserInfoDetail.do',
			type: 'POST',
			dataType: 'json',
			async: true,
			data: {
				id: id
			}
		})
		.done(function(data) {
			console.log("用户信息", data)
			if(data.flag == 1) {
				$scope.$apply(function() {
					$scope.personInfo = data.objectList[0];
					if(data.objectList[0].male == 'F') {
						$scope.flag = '女';
					} else if(data.objectList[0].male == 'M') {
						$scope.flag = '男';
					} else {
						$scope.flag = '保密';
					}
					if($scope.personInfo.alipay == null || $scope.personInfo.alipay == undefined || $scope.personInfo.alipay.length == 0) {
						$scope.zfOnly = false;
					} else {
						$scope.zfOnly = true;
					}
					if($scope.personInfo.email == null || $scope.personInfo.email == undefined || $scope.personInfo.email.length == 0) {
						$scope.emailOnly = false;
					} else {
						$scope.emailOnly = true;
					}
					$scope.personInfo.password = $scope.personInfo.password.substring(0, 12);
					address($scope.personInfo.province, $scope.personInfo.city);
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
	$scope.cl = function(sex) {
		$scope.flag = sex;
	}

	$scope.zfClick = function() {
		$scope.zfOnly = false;
		$scope.zfFocus = false;

	}

	/**
	 * 修改头像
	 */

	$("#fileInput2").change(function() {

		setImagePreview('fileInput2', 'image2')
		$("#image2").on("load", function() { // 等待图片加载成功后，才进行图片的裁剪功能  
			newWriteConfig3();
		})
		$scope.$apply(function() {
			$scope.screenshot = true;
		})
	})
	$("#fileInput3").change(function() {

			setImagePreview('fileInput3', 'image2')
			$("#image2").on("load", function() { // 等待图片加载成功后，才进行图片的裁剪功能  
				newWriteConfig3();
			})
			$scope.$apply(function() {
				$scope.screenshot = true;
			})
		})
		//	$('#imageForm').ajaxForm(function(data) {
		//		console.log("touxiang ",data)
		//		if(data.code == 1) {
		//			console.log(data);
		//			$scope.userImage = data.fileId;
		//			$("#imageImg").attr('src', data.message);
		//			$.ajax({
		//					url: IP + '/userInfoDetail/fixUserInfoDetail.do',
		//					type: 'POST',
		//					dataType: 'json',
		//					async: true,
		//					data: {
		//						accountId: id,
		//						portrait: $scope.userImage
		//					}
		//				})
		//				.done(function(data) {
		//					if(data.flag == 1) {
		//						Toast("头像修改成功啦~\(≧▽≦)/~", 2000);
		//					} else {
		//						console.log("修改个人信息失败");
		//					}
		//				})
		//				.fail(function() {
		//					console.log("error");
		//				})
		//				.always(function() {
		//					console.log("complete");
		//				});
		//		} else {
		//			Toast("头像上传失败！", 700);
		//		}
		//	});
	$scope.sign = function() {
		if(isSign) {
			Toast("你今天已经签过到啦~\(≧▽≦)/~", 2000);
			return;
		} else {
			var time = ((new Date()).getTime() - (new Date($scope.personInfo.continueSignTime)).getTime()) / 3600000 / 24;
			console.log($scope.personInfo.continueSignTime);
			console.log(time);
			console.log((new Date()).getDay());
			console.log(parseInt(((new Date()).getTime() - (new Date($scope.personInfo.continueSignTime)).getTime()) / 3600000 / 24));

			if(time < 1) {
				Toast("你今天已经签过到啦~\(≧▽≦)/~", 2000);
				return;
			} else if(time <= 2) {
				$scope.personInfo.continueSign = $scope.personInfo.continueSign + 1;
			} else {
				$scope.personInfo.continueSign = 1;
			}
			var tongNum = 0;
			//若能被5整除
			if($scope.personInfo.continueSign % 5 == 0) {
				tongNum = 15*10;
			} else {
				tongNum = 5*10;
			}
			$.ajax({
					url: IP + '/userInfoDetail/fixUserInfoDetail.do',
					type: 'POST',
					dataType: 'json',
					async: true,
					data: {
						accountId: id,
						continueSign: $scope.personInfo.continueSign
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						console.log("修改个人信息成功", data);
						$.ajax({
								url: IP + '/userMoney/updateUserMoney.do',
								type: 'POST',
								dataType: 'json',
								async: true,
								data: {
									id: userId,
									copperThumbTack: tongNum
								}
							})
							.done(function(data) {
								if(data.flag == 1) {
									Toast("签到成功,+" + tongNum + "铜螺钉~", 3000);
									isSign = true;
									$scope.$apply(function() {
										$scope.sign_show = true;
									})
									setTimeout(function() {
										$scope.$apply(function() {
											$scope.sign_show = false;

										})
									}, 5000);

								} else {
									console.log("修改个人信息失败");
								}
							})
					}
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});
		}
	}

	$scope.fixNickShowF = function() {

		//		$('#maskDiv',parent.document).show();
		//		$('#sildeBody', parent.document).css('overflow', 'hidden');
		$scope.fixNickShow = !$scope.fixNickShow;
		if($scope.fixNickShow) {
			$scope.nickNameCheck = "检测昵称";
		}

	}

	$scope.sureSomeMoney = function(nickName) {
		console.log(1111)
			//查询用户余额
		$.ajax({
				url: IP + '/userMoney/queryMoney.do',
				type: 'POST',
				dataType: 'json',
				async: true,
				data: {
					id: id
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					if(data.objectList[0].silverThumbTack < 1) {
						Toast("你的银图钉不足,请充值哦~", 2000);
						return;
					} else {
						$.ajax({
								url: IP + '/login/fixNickName.do',
								type: 'POST',
								dataType: 'json',
								async: true,
								data: {
									accountId: id,
									nickName: nickName
								}
							})
							.done(function(data) {
								console.log(data)
								if(data.flag == 1) {
									$scope.$apply(function() {
										$scope.personInfo.nickName = nickName;
										Toast("修改昵称成功啦~", 2000);
										$scope.sureFixSomeMoneyShow = false;
										$scope.fixNickShow = !$scope.fixNickShow;
									})
								} else {
									$scope.sureFixSomeMoneyShow = false;
									Toast("未知原因修改昵称失败");
								}
							});

					}
				}
			});

	}

	$scope.cancelSure = function() {
		$scope.sureFixSomeMoneyShow = false;
		$scope.fixNickShow = false;
		$scope.popubBodyMask = false;
		//		$('html,body').css('overflow', 'auto')
	}

	//修改邮箱判断
	$scope.fixEmail = function() {
		if($scope.personInfo.email == null || $scope.personInfo.email == undefined || $scope.personInfo.email.length == 0) {
			Toast("请先填写邮箱哦~");
			return;
		}
		$window.open("../personCenter/modifyEmail/modifyEmail.html?email=" + $scope.personInfo.email);
	}

	//修改昵称
	$scope.fixNickName = function(nickName) {
		console.log($scope.nickNameCheck)
		if(nickName == null || nickName.trim() == "") {
			$scope.fixNN = true;
			return;
		}
		//是否为检测昵称
		if($scope.nickNameCheck == "检测昵称") {
			$.ajax({
					url: IP + '/login/verifyNickName.do',
					type: 'POST',
					dataType: 'json',
					async: true,
					data: {
						nickName: nickName
					}
				})
				.done(function(data) {
					console.log(data)
					if(data.objectList) {
						$scope.$apply(function() {
							$scope.nickTrue = true;
						})
						return;
					} else {

						$scope.$apply(function() {
							$scope.nickOK = true;
							$scope.nickNameCheck = "修改";
						})
						return;
					}
				});
		} else {
			$scope.sureFixSomeMoneyShow = true;

		}
	}

	$scope.saveInfo = function() {
		if($scope.personInfo.signature == null || $scope.personInfo.signature == "") {
			Toast("总要说点什么吧→_→", 1000);
			return;
		}
		if($scope.personInfo.email == null || $scope.personInfo.email == undefined || $scope.personInfo.email.length == 0) {
			//			$scope.emailRShow = true;
			//			return;
		} else {
			if(!(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test($scope.personInfo.email))) {
				$scope.emailGShow = true;
				return;
			}
		}
		if($scope.personInfo.alipay == null || $scope.personInfo.alipay == undefined || $scope.personInfo.alipay.trim().length <= 0) {
			//			$scope.alipayRShow = true;
			//			return;
		} else {
			if(!(/^1[34578]\d{9}$/.test($scope.personInfo.alipay)) && !(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test($scope.personInfo.alipay))) {
				$scope.alipayGShow = true;
				return;
			}
		}

		if($scope.flag == '女') {
			$scope.sex = 'F';
		} else if($scope.flag == '男') {
			$scope.sex = 'M';
		} else {
			$scope.sex = 'B';
		}
		$scope.zfOnly = true;
		$scope.zfFocus = false;
		$.ajax({
				url: IP + '/userInfoDetail/fixUserInfoDetail.do',
				type: 'POST',
				dataType: 'json',
				async: true,
				data: {
					accountId: id,
					signature: $scope.personInfo.signature,
					dateOfBirths: $scope.personInfo.dateOfBirth,
					male: $scope.sex,
					province: document.getElementById('location_p').value,
					city: document.getElementById('location_c').value,
					email: $scope.personInfo.email,
					alipay: $scope.personInfo.alipay
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					console.log("修改个人信息成功", data);
					Toast("保存个人信息成功啦~\(≧▽≦)/~", 1000);
					$.ajax({
							url: IP + '/userInfoDetail/queryUserInfoDetail.do',
							type: 'POST',
							dataType: 'json',
							async: true,
							data: {
								id: id
							}
						})
						.done(function(data) {
							localStorage.userInfo = JSON.stringify(data.objectList[0]);
							console.log(JSON.parse(localStorage.userInfo));
						})
				} else {
					console.log("修改个人信息失败");
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
	}
});
var address = function(province, city) {
	console.log(province + city);
	new PCAS('location_p', 'location_c', '', province, city, '');
}

function setImagePreview(fileId, images) {
	var docObj = document.getElementById(fileId);
	var imgObjPreview = document.getElementById(images);
	if(docObj.files && docObj.files[0]) {
		//火狐下，直接设img属性
		imgObjPreview.style.display = 'block';
		imgObjPreview.style.width = '300px';
		//imgObjPreview.src = docObj.files[0].getAsDataURL();

		//火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式  
		imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);
	} else {
		//IE下，使用滤镜
		docObj.select();
		var imgSrc = document.selection.createRange().text;
		var localImagId = document.getElementById("localImag");
		//必须设置初始大小
		localImagId.style.width = "300px";
		//图片异常的捕捉，防止用户修改后缀来伪造图片
		try {
			localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
			localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
		} catch(e) {
			alert("您上传的图片格式不正确，请重新选择!");
			return false;
		}
		imgObjPreview.style.display = 'none';
		document.selection.empty();
	}
	return true;
}