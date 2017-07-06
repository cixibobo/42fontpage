var app = angular.module("mgbookshelf", ['tm.pagination']);
app.controller("myBookC", function($scope, $timeout, $window) {
	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 12
	};
	var id = userId;
	$scope.userNick = "";
	$scope.moneyList = "";

	//请求收藏列表数据
	$scope.collectList = function() {
		$.ajax({
				url: IP + '/userBookShelf/queryCollection.do',
				type: 'POST',
				dataType: 'json',
				async: true,
				data: {
					id: id,
					numPerPage: $scope.paginationConf.itemsPerPage,
					pageNum: $scope.paginationConf.currentPage
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					if(data.total == 0) {
						$scope.$apply(function() {
							$scope.collectNullShow = true;
						})
					}
					if(data.objectList.length != 0) {
						$scope.$apply(function() {
							$scope.paginationConf.totalItems = data.total;
							$scope.myCollectBookList = data.objectList;
							if(data.total <= 12) {
								$scope.upOneCol = false;
							} else {
								$scope.upOneCol = true;
							}

						})

						console.log(data);
					} else
						console.log("列表为空")
				} else {
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
	}

	//书籍跳转
	$scope.jump = function(book) {
		if(book.isOnShelf==0){
			Toast("此书已被下架");
			return;
		}
		$window.open("../book.html?book_id=" + book.id)
	}

	// 重新获取数据条目
	var reGetProducts = function() {
		$scope.collectList();
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

});
app.controller("myHolderC", function($scope, $timeout, $window) {
	// 配置分页基本参数
	$scope.paginationConf1 = {
		currentPage: 1,
		itemsPerPage: 12
	};
	var id = userId;
	//书籍跳转
	$scope.jumpH = function(book) {
		if(book.isOnShelf==0){
			Toast("此书已被下架");
			return;
		}
		$window.open("../book.html?book_id=" + book.id)
	}

	//请求持有列表数据
	$scope.holderList = function() {
		$.ajax({
				url: IP + '/userBookShelf/queryHolder.do',
				type: 'POST',
				dataType: 'json',
				async: true,
				data: {
					holderId: id,
					numPerPage: $scope.paginationConf1.itemsPerPage,
					pageNum: $scope.paginationConf1.currentPage
				}
			})
			.done(function(data) {
				console.log(data);
				if(data.flag == 1) {
					if(data.total == 0) {
						$scope.$apply(function() {
							$scope.holderNullShow = true;
						});
					}
					if(data.objectList.length != 0) {

						$scope.$apply(function() {
							$scope.paginationConf1.totalItems = data.total;
							//							$scope.products = 6;
							if(data.total <= 12) {
								$scope.upOneholder = false;
							} else {
								$scope.upOneholder = true;
							}

							$scope.myHolderBookList = data.objectList;
							$scope.myHolderBookList.forEach(function(item) {
								if(item.authorId == userId && item.nowStock > 0) {
									item.isSelf = true;
								} else {
									item.isSelf = false;
								}
								if(item.sellUnit == null || item.sellUnit == 0) {
									item.sellUnit = "未出售";
								} else {
									item.sellUnit = item.sellUnit + "银图钉";
								}
							})
						})

						console.log(data);
					} else
						console.log("列表为空")
				} else {
//					alert("查询收藏图书失败")
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
	}
	$scope.holderList();
	// 重新获取数据条目
	var reGetProducts = function() {
		$scope.holderList();
	};
	$scope.$watch('paginationConf1.currentPage', reGetProducts);

	/**
	 * 股权转让
	 * @param {Object} holderNum
	 * @param {Object} book
	 * @param {Object} phone
	 * @param {Object} treMoney
	 */
	$scope.transfreSubmit = function(holderNum, book, phone, treMoney) {
		console.log(holderNum);
		if(phone == null || phone == "" || phone.length != 11) {
			Toast("输入正确的手机号哦~(⊙o⊙)~", 1500);
			return;
		}
		if(treMoney == null || treMoney == "") {
			Toast("输入一下转让金额啦~~", 1500);
			return;
		}
		//此书为作者编写
		if(book.authorId == userId) {
			if(treMoney > book.nowStock) {
				Toast("你不能出售超过你当前所剩余的最大股权数~", 1500);
				return;
			}

		}
		//不是作者编写，是购买或其他所得
		else {
			if(holderNum < treMoney) {
				Toast("你没有足够的持有比例哦~", 2500);
				return;
			}
		}

		if(typeof treMoney === "number" && treMoney % 10 === 0) {

		} else {
			Toast("只能转让10的整数倍哦~~", 2500)
			return;
		}
		$.ajax({
				url: IP + '/userInfoDetail/queryUserInfoDetail.do',
				type: 'POST',
				dataType: 'json',
				async: true,
				data: {
					phone: phone
				}
			})
			.done(function(data) {
				console.log(data);
				if(data.objectList == null) {
					Toast("手机号不存在~检查检查哦~", 1500);
					return;
				} else {
					var buyer = data.objectList[0].accountId;
					var isOk = confirm("确定要转让" + treMoney + "%的股权到" + phone + "吗？");
					//如果点击确定，调用转让
					if(isOk) {
						console.log(book.id + " " + id + " " + buyer + " " + treMoney)
						$.ajax({
								url: IP + '/userBookShelf/updateStockInfo.do',
								type: 'POST',
								dataType: 'json',
								async: true,
								data: {
									bookId: book.id,
									shellId: id,
									toShellId: buyer,
									shellNum: treMoney
								}
							})
							.done(function(data) {
								console.log(data);
								if(data.flag == 1) {
									Toast("转让成功，等待对方确认", 2000);
									$scope.holderList();
								} else {
									Toast("转让出现了一点小问题~~");
								}
							})
					}
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