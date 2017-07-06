var app = angular.module('myfriend', ['tm.pagination']);


app.controller("myFriendC", function($scope, $window) {
	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 9
	};
	$scope.allNum = 30;
	$scope.fun = false;
	$scope.flow = true;
	$scope.sixin = function(user) {
		if($scope.flow) {
			$window.open(CurrentIp + "/html/messageCenter/personal.html?id=" + user.userId, "_blank");
		} else {
			$window.open(CurrentIp + "/html/messageCenter/personal.html?id=" + user.followId, "_blank");
		}
	}
	$scope.flagCancelFlow = true;
	$scope.cancelFlows = function(followid, userid) {
		console.log(followid, userid);
		$.ajax({
				url: IP + '/userFollow/cancelFlows.do',
				type: 'POST',
				dataType: 'json',
				async: true,
				data: {
					followId: followid,
					userId: userid
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					console.log("取消关注成功")
					$scope.$apply(function() {
						$scope.queryFlows();
					})
				} else {
					console.log("查询关注失败")
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});

	}

	$scope.queryFuns = function() {
		$scope.fun = true;
		$scope.flow = false;
		//请求粉丝数据
		$.ajax({
				url: IP + '/userFollow/queryFollow.do',
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
				if(data.flag = 1) {
					if(data.objectList.length != 0) {
						$scope.$apply(function() {
							$scope.myConFansList = data.objectList;
							$scope.paginationConf.totalItems = data.total;
							$scope.fansNum = data.total;
							$scope.flagCancelFlow = false;
						})

						console.log(data);
					} else {
						$scope.$apply(function() {
							$scope.myConFansList = data.objectList;
							$scope.paginationConf.totalItems = data.total;
							$scope.fansNum = data.total;
							$scope.flagCancelFlow = false;
						})
						console.log("列表为空")
					}
				} else {
					console.log("查询粉丝失败")
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
	};
	$scope.queryFlows = function() {
		$scope.fun = false;
		$scope.flow = true;
		//请求关注数据
		$.ajax({
				url: IP + '/userFollow/queryFollow.do',
				type: 'POST',
				dataType: 'json',
				async: true,
				data: {
					followId: userId,
					numPerPage: $scope.paginationConf.itemsPerPage,
					pageNum: $scope.paginationConf.currentPage
				}
			})
			.done(function(data) {
				if(data.flag = 1) {
					if(data.objectList.length != 0) {
						$scope.$apply(function() {
							$scope.paginationConf.totalItems = data.total;
							$scope.cernNum = data.total;
							$scope.myConFansList = data.objectList;
							$scope.flagCancelFlow = true;
						})

						console.log(data);
					} else {
						$scope.$apply(function() {
							$scope.paginationConf.totalItems = data.total;
							$scope.cernNum = data.total;
							$scope.myConFansList = data.objectList;
							$scope.flagCancelFlow = true;
						})
						console.log("列表为空")
					}
				} else {
					console.log("查询关注失败")
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
	}
	$scope.queryFlows();
	//点击粉丝按钮
	$scope.clickFuns = function() {
			// 初始化分页参数
			$scope.paginationConf = {
				currentPage: 1,
				itemsPerPage: 3
			};
			//请求数据
			$scope.queryFuns();
		}
		//点击关注按钮
	$scope.clickFlows = function() {
		// 初始化分页参数
		$scope.paginationConf = {
			currentPage: 1,
			itemsPerPage: 3
		};
		//请求关注数据
		$scope.queryFlows();
	}
	var reGetProducts = function() {
		if($scope.fun) {
			$scope.queryFuns();
		} else {
			$scope.queryFlows();
		}
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);
});