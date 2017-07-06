var app = angular.module("bookmanage", ['tm.pagination']);

app.controller("bookManC", function($scope, $window) {
	
	var id = userId;
	$scope.shellStockNum = 0;
	$scope.shellUserNum = 5;

	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 10
	};

	//点击是否同意出售打书钉
	$scope.agree = function(flag, authorBook) {
		if(authorBook.isSellUnit) {
			if(!flag) {
				if(authorBook.nowStock != null && authorBook.nowStock > 0) {
					Toast("已出售不能更改哦~~", 1000);
				} else {

					authorBook.isSellUnit = false;
				}
			}

		} else {
			if(flag) {
				if(authorBook.isSubmit == 0) {
					Toast("此书还未发布哦~");
					return;
				} else if(authorBook.isSubmit == 1 && authorBook.reportResult == null) {
					Toast("此书正在审核中哦~");
					return;
				} else if(authorBook.isSubmit == 1 && authorBook.reportResult == 1) {
					Toast("此书审核未通过~");
					return;
				} else if(authorBook.isOnShelf == null || authorBook.isOnShelf == 0) {
					Toast("此书已下架~");
					return;
				}
				authorBook.isAgreeInfo = true;
			}
		}
	}
	$scope.changeToJin = function(){
		alert("功能暂无开放");
	}
	$scope.trueAgreeInfo = function(authorBook) {
		authorBook.isAgreeInfo = false;
		authorBook.isSellUnit = true;
	}

	//书的跳转
	$scope.jump = function(book) {
		if(book.isSubmit == 0) {
			Toast("此书还未发布哦~");
			return;
		} else if(book.isSubmit == 1 && book.reportResult == null) {
			Toast("此书正在审核中哦~");
			return;
		} else if(book.isSubmit == 1 && book.reportResult == 1) {
			Toast("此书审核未通过~");
			return;
		} else if(book.isOnShelf == null || book.isOnShelf == 0) {
			Toast("此书已下架~");
			return;
		}
		$window.open(CurrentIp + "/html/book.html?book_id=" + book.id);
	}

	//点击出售打书钉
	$scope.sellClick = function(authorBook) {
		//如果未同意出售，提示同意信息
		if(!authorBook.isSellUnit) {
			Toast("你还未同意出售打书钉哦~~", 1000);
			return;
		}

		authorBook.sellShow = true;
		if(authorBook.nowStock > 0) {
			$scope.shellStockNum = authorBook.nowStock;
			$scope.shellMoneyPer = authorBook.sellUnit;
		}

	}
	$scope.cancleStock = function(book) {
		book.sellShow = false;
	}

	//请求用户书籍列表数据
	$scope.queryUserBook = function() {
		$.ajax({
				url: IP + '/userBookManager/queryMyWriteBook.do',
				type: 'POST',
				dataType: 'json',
				async: true,
				data: {
					authorId: id,
					numPerPage: $scope.paginationConf.itemsPerPage,
					pageNum: $scope.paginationConf.currentPage
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.total == 0) {
					$scope.$apply(function() {
						$scope.holderNullShow = true;
					});
				}
				if(data.flag == 1) {
					if(data.objectList.length != 0) {
						$scope.$apply(function() {
							$scope.paginationConf.totalItems = data.total;
							$scope.authorBookList = data.objectList;
							if(data.total <= 3) {
								$scope.isShowPage = false;
							} else {
								$scope.isShowPage = true;
							}

							$scope.authorBookList.forEach(function(item) {
								//若没有持有人，则显示自己的头像
								console.log(item.holderList)
								if(item.holderList == undefined || item.holderList.length == 0) {
									item.holderList = [{
										"headUrl": ""
									}];
									item.holderList[0].headUrl = item.headUrl;
								}

								//是否同意出售
								item.isAgreeInfo = false;

								if(item.nowStock > 0) {
									item.isSell = true;
									item.isSellUnit = true;
									item.sellShow = false;
								}
								if(item.silverMoney == null || item.silverMoney == 0) {
									item.silverMoney = 0;
								}
								if(item.copperMoney == null || item.copperMoney == 0) {
									item.copperMoney = 0;
								}
								if(item.isSubmit == 0) {
									item.isReportState = "此书未发布..";
									item.editShow = true;
									item.shareShow = false;
									item.deleteShow = true;
								} else if(item.isSubmit == 1 && item.reportResult == null) {
									item.isReportState = "此书正在审核中.."
									item.editShow = true;
									item.shareShow = false;
									item.deleteShow = false;
								} else if(item.isSubmit == 1 && item.reportResult == 1) {
									item.isReportState = "此书审核未通过..";
									item.editShow = false;
									item.shareShow = false;
									item.deleteShow = true;
								} else if(item.isSubmit == 1 && item.reportResult == 0) {
									item.isReportState = "审核已通过"
									item.editShow = true;
									item.shareShow = true;
									item.deleteShow = false;
								}
								if(item.isOnShelf == 0) {
									item.isReportState = "此书已下架"
									item.editShow = false;
									item.shareShow = false;
									item.deleteShow = true;
								}
							})

						})

						console.log($scope.authorBookList);
					} else
						console.log("列表为空")
				} else {
//					alert("请求用户书籍列表数据失败")
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
	}

	/**
	 * 分享书
	 * @param {Object} book
	 */
	$scope.shareBook = function(book) {

	}

	var deleteBookInfo;
	$scope.deleteBook = function(book) {
		if(book.deleteShow == false) {
			Toast("此书目前不能删除！");
			return;
		} else {
			deleteBookInfo = book;
			$scope.deleteBookShow = true;
		}
	}

	$scope.trueDeleteBook = function() {

		if(deleteBookInfo != null && deleteBookInfo != undefined) {
			$.ajax({
					url: IP + '/createBook/removeBook.do',
					type: 'POST',
					dataType: 'json',
					async: true,
					data: {
						id: deleteBookInfo.id
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						Toast("删除稿件成功~", 2000);
						$scope.$apply(function() {
							$scope.deleteBookShow = false;
							$scope.queryUserBook();
						})
					} else {
						Toast("删除出了点小问题，请稍后再试..")
					}
				})
		} else {
			Toast("删除出了点小问题，请稍后再试..")
		}

	}

	$scope.queryUserBook();
	// 重新获取数据条目
	var reGetProducts = function() {
		$scope.queryUserBook();
		location.hash="#topbookmanage";
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

	$scope.edit = function(book) {
		if(book.editShow == false) {
			Toast("此书目前不能编辑");
			return;
		} else {
			$window.open(CurrentIp + "/html/newwrite.html?id=" + book.id, "_blank");
		}
	}
	$scope.setOkFix = function(book) {
			if(book.nowStock > 0) {
				book.OkFix = '修改';
			} else {
				book.OkFix = '出售';
			}
			return true;
		}
		//点击确认出售按钮
	$scope.fixStockInfo = function($index, book, shellStockNum, shellUserNum, shellMoneyPer) {
		console.log(shellStockNum)
		if(book.isOnShelf == 0) {
			Toast("此书已下架，您不能修改");
			return;
		}
		if(shellStockNum <= 50 && shellStockNum % 10 == 0 && shellStockNum > 0) {
			if(shellUserNum <= 5) {
				if(shellMoneyPer > 0) {
					//如果书已经出售
					if(book.nowStock > 0) {
						//修改股权信息
						$.ajax({
								url: IP + '/userBookManager/fixStockInfo.do',
								type: 'POST',
								dataType: 'json',
								async: true,
								data: {
									id: book.id,
									sellUnit: shellMoneyPer
								}
							})
							.done(function(data) {
								if(data.flag == 1) {
									$scope.queryUserBook();
									Toast("修改成功~", 2000);
									console.log(data);
								} else {}
							})
							.fail(function() {
								console.log("error");
							})
							.always(function() {
								console.log("complete");
							});
					} else {
						//初始化股权信息
						$.ajax({
								url: IP + '/userBookManager/fixStockInfo.do',
								type: 'POST',
								dataType: 'json',
								async: true,
								data: {
									holderId: id,
									bookId: book.id,
									nowStock: shellStockNum,
									sellUnit: shellMoneyPer
								}
							})
							.done(function(data) {
								if(data.flag == 1) {
									$scope.queryUserBook();
									Toast("出售成功~", 2000);

									console.log(data);
								} else {}
							})
							.fail(function() {
								console.log("error");
							})
							.always(function() {
								console.log("complete");
							});
					}

				} else {
					alert("售卖单价不能小于1银图钉/1%")
				}
			} else {
				alert("出售人数上限不能超过5人")
			}
		} else {
			alert("股权出售不能大于50%且只能出售10%的整数倍")
		}
	}
});