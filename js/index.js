

var app = angular.module("myApp", ['ngRoute', 'tm.pagination']);
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: "./html/homePage.html",
			controller: function($scope) {
				$("#search").val("");
			}
		})
		.when('/classify', {
			templateUrl: './html/classification.html',
			controller: 'classifyController'
		})
		.when('/postDetail/:id', {
			templateUrl: "./html/post_detail.html",
			controller: function($scope) {
				$("#search").val("");
			},
			controller: 'postDetailController',

		})
		.when('/stapleHall', {
			templateUrl: "./html/staple_hall.html",
			controller: function($scope) {
				$("#search").val("");
			},
			controller: 'bookDingController',

		})
		.when('/association', {
			templateUrl: "./html/association.html",
			controller: function($scope) {
				$("#search").val("");
			}
		})
		.otherwise({
			redirectTo: '/',
			controller: function($scope) {
				$("#search").val("");
			}
		});
//		$locationProvider.html5Mode(true);
}]);

/*
	顶部导航
	*/


if(sixinInfoNum==undefined){
	var sixinInfoNum = 0;
}
var sixinFlag=false;
app.controller("header", ["$scope", "$http", function($scope, $http, $window, $location) {
		if(userId == undefined || userId == null) {
			$scope.showImageTop = false;
		}
		var sdk = new WSDK();
		
		sdk.Base.login({
			uid: userId + "",
			appkey: appkey,
			credential: 'The42Novels',
			timeout: 5000,
			success: function(data) {
				// {code: 1000, resultText: 'SUCCESS'}
				console.log('login success', data);
				var recentTribe = [];

				sdk.Base.getUnreadMsgCount({
					count: 30,
					success: function(data) {
						console.log(data);
						var list = data.data;
						list.forEach(function(item) {
							if(item.contact.substring(0, 8) === 'chntribe') {
								recentTribe.push(item);
							} else {
								sixinInfoNum = sixinInfoNum + item.msgCount;
								sixinFlag=true;
							}
						});
						sessionStorage.setItem("sixinInfoNum",sixinInfoNum);
						$scope.searchMessage();
						console.log("私信消息总量：", sixinInfoNum)
					},
					error: function(error) {
						sessionStorage.setItem("sixinInfoNum",0);
						console.log('获取未读消息的条数失败', error);
					}
				});
			},
			error: function(error) {
				// {code: 1002, resultText: 'TIMEOUT'}
				$scope.searchMessage();
				console.log('login fail', error);
			}
		});

		//获取背景图片
		/**
		 * 书本下滑线样式初始化
		 */

		var conList = $("#con_nav .nav_name");
		conList.removeClass('active');
		$(conList[0]).addClass('active');
		$.ajax({
				type: "post",
				url: IP + '/homePage/bookCarousel.do',
				async: true,
				data: {
					imageLocation: 4
				}
			})
			.done(function(data, status, headers, config) {
				if(data.flag == 1) {
					if(data.objectList[0]) {
						$scope.backgroudImg = {
							'background-image': 'url(' + data.objectList[0].imageUrl + ')'
						}
					}
				}
			})
		$scope.loginShow = true;
		$scope.person_info = false;
		if(localStorage.userInfo) {
			$scope.loginShow = false;
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
							var identity=data.objectList[0].identity;
							if(identityINFO==0&&identity==1){
								Toast("申请作者成功，请重新登录",1000);
								localStorage.removeItem('userInfo');
								localStorage.removeItem('islongerPrompt')
								setCookie("previousURL", location.href);
								setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
							}
						})
					}
				})
		}

		//页面跳转选择
		$scope.returnToWin = function(url) {
			if(isLogin()) {
				window.open("./html/" + url + ".html")
					//window.location.href = "./html/" + url + ".html";
				return;
			}
			//				Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
		}

		//页面跳转选择
		$scope.returnToWin1 = function(url) {
			if(isLogin()) {
				window.open("./html/" + url)
					//window.location.href = "./html/" + url + ".html";
				return;
			}
			//				Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
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
						console.log("查询的消息", data)
						if(data.flag == 1) {
							$scope.$apply(function() {
								if(data.total == 0 && sixinInfoNum==0) {
									$scope.message_zero = false;
								} else {
									$scope.message_zero = true;
								}
								$scope.message_total = data.total + sixinInfoNum;
								$scope.message = data.objectList;
								$scope.message[4]=sixinInfoNum;
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
						console.log(data)
						if(data.flag == 1) {
							$scope.$apply(function() {
								if(data.objectList[0]) {
									$scope.dyMessage = data.objectList;
								}
							})
							$scope.moreDongtai2 = false;
							$scope.moreDongtai3 = false;
							$scope.moreDongtai1 = false;
							if($scope.dyMessage==null || $scope.dyMessage.length == 0) {
								$scope.moreDongtai2 = true;
							} else if($scope.dyMessage.length <= 5) {
								$scope.moreDongtai3 = true;
							} else {
								$scope.moreDongtai1 = true;
							}
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
			//		$scope.searchDynamic();	//动态

		//退出账户
		$scope.signOut = function() {
			localStorage.removeItem('userInfo');
			localStorage.removeItem('islongerPrompt')
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
		}

		$scope.searchOK = function(e) {
			var keycode = window.event ? e.keyCode : e.which;
			if(keycode == 13) {
				//需要处理的事情
				var _classType = $scope.selectedCode;
				var search = {
					searchValue: $scope.searchContent
				}
				var searchJson = JSON.stringify(search)
				var hrefsrc = window.location;
				var substr = "classify";
				sessionStorage.Search = searchJson;
				if((hrefsrc + "").indexOf(substr) >= 0) {
					window.location.reload();
				} else {
					sessionStorage.setItem("first", 1);
					window.open("./index.html#/classify");
					//	window.location.href = ;

				}
			}
		}
		$.ajax({
				type: "post",
				url: IP + '/distribute/bookDistribute.do'
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.classifyList = data.objectList;
					})
				}
			})
			//选择类型

		//确认搜索
		$scope.searchClass = function() {
				var _classType = $scope.selectedCode;
				var search = {
					searchValue: $("#search").val()
				}
				var searchid = $("#search").val();
				if(searchid == null || searchid == "") {
					alert("请输入你要搜索的内容");
					return false;
				}
				var searchJson = JSON.stringify(search)
				var hrefsrc = window.location;
				var substr = "classify";
				sessionStorage.Search = searchJson;
				if((hrefsrc + "").indexOf(substr) >= 0) {
					window.location.reload();
				} else {
					sessionStorage.setItem("first", 1);
					//				window.open="./index.html#/classify";
					window.location.href = "./index.html#/classify";
				}

			}
			//按enter键进行搜索
		$('#search').bind('keypress', function(event) {
			if(event.keyCode == 13) {
				//需要处理的事情
				$scope.searchClass();
			}
		});
	}])
	//尾部图片数据
app.controller("footerControll", function($scope, $http) {
	$scope.footerShow = function() {
		$.ajax({
				type: "post",
				url: IP + '/homePage/bookCarousel.do',
				async: true,
				data: {
					imageLocation: 1
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.footerList = data.objectList;
					})
				}
			})

		$.ajax({
				type: "post",
				url: IP + '/homePage/bookCarousel.do',
				async: true,
				data: {
					imageLocation: 2
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						if(data.objectList[0]) {
							$scope.QRcode = data.objectList[0].imageUrl;
						}
					})
				}
			})
	}
})

app.directive('renderFinish', function() {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {
				console.log('ng-repeat执行完毕')
				scope.$eval(attr.repeatFinish)
			}
		}
	}
})

//app.controller('frame', function($scope) {
//	$scope.changeFrame = function(htmlName) {
//
//		$scope.frameSrc = './html/' + htmlName + '.html';
//		$scope.setFrameHeight();
//
//	}
//	$scope.setFrameHeight = function() {
//		var ifmheight = $("#iframepage").contents().find("body").height() + 'px';
//		$("#iframepage").height(ifmheight);
//	}
//})