var app = angular.module("mywallet", ['tm.pagination']);
app.controller("myWalletC", function($scope, $timeout, $window) {
	$scope.withdraw = false;
	$scope.uid = userId;
	if(identityINFO==0){		//0代表读者
		$scope.withdrawMoney=false;
	}
	else{
		$scope.withdrawMoney=true;
	}
	
	
	
	$scope.monwithdraw = function() {
		Toast("暂未开放功能..");
		return;
		//		$scope.withdraw = !$scope.withdraw;
		//		$scope.drawBackAlipay();
	};
	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 9
	};
	$scope.cancelP = function() {
		$scope.withdraw = false;
	};
	
	//查询用户金额
	$.ajax({
			url: IP + '/userMoney/queryMoney.do',
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
					$scope.myWalletInfo = data.objectList[0];
					$scope.myWalletInfo.goldThumbTack = parseInt($scope.myWalletInfo.silverThumbTack / 100);
					$scope.myWalletInfo.goldThumbTack = $scope.myWalletInfo.goldThumbTack.toFixed(2); // 输出结果为 2.45
					$scope.myWalletInfo.goldThumbTack1=($scope.myWalletInfo.goldThumbTack*0.6).toFixed(1);
				})
			} else {
				console.log("查询用户金额失败")
			}
		})
		.fail(function() {
			console.log("error");
		})
		.always(function() {
			console.log("complete");
		});

	//充值
	$scope.rechangeF = function() {
		if(userId == null || userId == undefined) {
			Toast("请先登录哦~");

			return false;
		}
		console.log($scope.rechangeMoney)
		console.log(typeof $scope.rechangeMoney)
		if($scope.rechangeMoney == null || $scope.rechangeMoney == undefined || typeof $scope.rechangeMoney != 'number' || $scope.rechangeMoney.length == 0 || $scope.rechangeMoney <= 0) {
			Toast("充值输入不正确，修改一下哦~");
			return false;
		}
		$window.open("http://www.manguo42.com/The42Novels/alipay/deposit.do?userId=" + userId + "&money=" + $scope.rechangeMoney / 100);

	}

	$scope.queryUserHistory = function() {
			$.ajax({
					url: IP + '/userMoney/queryFinancial.do',
					type: 'POST',
					dataType: 'json',
					async: true,
					data: {
						userId: userId,
						numPerPage: $scope.paginationConf.itemsPerPage,
						pageNum: $scope.paginationConf.currentPage
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						$scope.$apply(function() {
							$scope.paginationConf.totalItems = 50;
							$scope.moneyUseHistory = data.objectList;
							if(data.total <= 9) {
								$scope.isShowHistory = false;
							} else {
								$scope.isShowHistory = true;
							}
						})
					} else {
						console.log("查询历史记录失败")
					}
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});
		}
		// 重新获取数据条目
	var reGetProducts = function() {
		$scope.queryUserHistory();
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

	$scope.rechangeMoney = 0;
	$scope.select = function(y) {
		console.log(y);
		if(y == -1) {
			if($scope.customRechangeMoney < 0) {
				Toast("输入不正确");
				$scope.customRechangeMoney = "";
				return;
			}
		}
		$scope.rechangeMoney=y
	}
	$scope.drawBackType = true;
	$scope.drawBackAlipay = function() {
		$scope.drawBackType = true;
		//查询是否绑定支付宝账号
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
				console.log(data)
				if(data.flag == 1) {
					if(data.objectList[0].alipay == null || data.objectList[0].alipay == undefined || data.objectList[0].alipay == "") {
						if($scope.withdraw) {
							Toast("请先绑定支付宝账号哦~");
						}
						return;
					} else {
						$scope.$apply(function() {
							$scope.accountNo = data.objectList[0].alipay;
						})
					}
				} else {
					console.log("查询支付宝失败")
				}
			})
	}
	
	//输入数字监测
//	$scope.checkNum=function() {
//   if (isNaN($scope.customRechangeMoney)) {    
//      $scope.customRechangeMoney=0;    
//   }    
//   if ($scope.customRechangeMoney != null) {    
//       //检查小数点后是否对于两位
//       console.log($scope.customRechangeMoney.toString().indexOf("."))
//       if ($scope.customRechangeMoney.toString().indexOf(".")>0 ) {    
//           var newValue=$scope.customRechangeMoney.toString().split('.');
//           console.log(newValue)
//           console.log(newValue[0])
//           	  $scope.customRechangeMoney = newValue[0];   
//          
//       }    
//   }  
// }

	//提现
	//	$scope.drawBack = function(type) {
	//		//检测是否为空
	//		if($scope.accountNo == null || $scope.accountNo == undefined) {
	//			Toast("请先绑定支付宝账户哦~", 1000);
	//			return;
	//		}
	//		if($scope.accountName == null || $scope.accountName.length < 1) {
	//			Toast("请输入支付宝用户名哦~", 1000);
	//			return;
	//		}
	//		if($scope.password == null || $scope.password.length < 1) {
	//			Toast("请输入登录密码哦~", 1000);
	//			return;
	//		}
	//		if($scope.drawMoney == null || $scope.drawMoney.length < 1) {
	//			Toast("请输入提现金额哦~", 1000);
	//			return;
	//		}
	//		if($scope.drawMoney > $scope.myWalletInfo.goldThumbTack) {
	//			Toast("哪有这么多金书钉~~", 1000);
	//			return;
	//		}
	//		if($scope.drawMoney <= 0) {
	//			Toast("提现金额不能小于1~", 1000);
	//			return;
	//		}
	//		console.log($scope.password)
	//		var passWord = hex_md5($scope.password);
	//		//检查密码是否正确
	//		$.ajax({
	//				url: IP + '/userInfoDetail/fixUserPhoneHead.do',
	//				type: 'POST',
	//				dataType: 'json',
	//				async: true,
	//				data: {
	//					id: userId,
	//					oldPassword: passWord
	//				}
	//			})
	//			.done(function(data) {
	//				console.log(data)
	//				if(data.code == 100) {
	//					Toast("登录密码不对哎~", 1000);
	//					return;
	//				} else {
	//					$scope.$apply(function() {
	//						$scope.withdraw = false;
	//					})
	//					//请求提现
	//					$.ajax({
	//							url: IP + '/userMoney/drawBackMoney.do',
	//							type: 'POST',
	//							dataType: 'json',
	//							async: true,
	//							data: {
	//								id: userId,
	//								money: $scope.drawMoney,
	//								accountName: type,
	//								accountCode: $scope.accountNo
	//							}
	//						})
	//						.done(function(data) {
	//							console.log(data)
	//							if(data.flag == 1) {
	//								Toast("提现成功，等待审核中哦~");
	//							} else {
	//								Toast("提现失败啦");
	//							}
	//						})
	//				}
	//			})
	//}
});
function inputMinTen(){
		var value= $("#minTenInput").val();
		if(value<1){
			Toast("最小充值10个哟!",1000);
			$("#minTenInput").val(1)
		}
	}
 //检查是否是非数字值  
