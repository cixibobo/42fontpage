var app = angular.module("commentManageApp", ['tm.pagination']);
app.controller("commentManageC", function($scope, $window) {
	$scope.isReader = true;
	$scope.isPraise = false;
	$scope.newPushFlag = true;
	$scope.praiseFlag = false;
	$scope.replyFlag = false;
	$scope.initConf = function() {
		// 配置分页基本参数
		$scope.paginationConf = {
			currentPage: 1,
			itemsPerPage: 20
		};
	}
	$scope.initConf();

	//帖子的举报内容提交
	$scope.submitReport = function(comment, jbContent) {
		console.log(comment + " ddddddddd" + jbContent)
		$scope.reportShow = false;
		$scope.jbContent = "";
		$.ajax({
				url: IP + '/common/insertReport.do',
				type: 'post',
				dataType: 'json',
				data: {
					userId: userId,
					content: jbContent,
					reportId: comment.id,
					reportType: 1
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					$scope.$apply(function() {　　
						$scope.reportShow = false;
						$scope.jbContent = "";
					});
					Toast("举报成功,等待审核中", 1000);
				}
			})
	}

	//跳转到具体的评论
	$scope.jumpBookComment = function(comment) {
		$window.open(CurrentIp + "/html/book.html?book_id=" + comment.bookId + "&comment_Id=" + comment.id, "_blank");
	}

	//查询作者所有的书
	$scope.authorBookClick = function() {
			$.ajax({
					url: IP + '/bookComment/selectAuthorBook.do',
					type: 'POST',
					dataType: 'json',
					async: true,
					data: {
						authorId: userId
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						$scope.$apply(function() {
							$scope.bookList = data.objectList;
							$scope.bookList.unshift({
								"bookName": "全部书籍"
							});
							$scope.selectedBook = $scope.bookList[0].id;
						})
					} else {
						console.log("查询作者书籍失败")
					}
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});
		}
		//根据最新发布时间排序
	$scope.orderTimeClick = function() {
			console.log("orderTimeClick");
			$scope.data = {};
			if($scope.selectedBook == null || $scope.selectedBook == undefined) {
				$scope.data.authorId = userId;
			} else {
				$scope.data.authorId = userId;
				$scope.data.bookId = $scope.selectedBook;
			}
			$scope.data.numPerPage = $scope.paginationConf.itemsPerPage;
			$scope.data.pageNum = $scope.paginationConf.currentPage;
			$scope.newPushFlag = true;
			$scope.praiseFlag = false;
			$scope.replyFlag = false;
			$.ajax({
					url: IP + '/bookComment/selectBookCommentByTime.do',
					type: 'POST',
					dataType: 'json',
					async: true,
					data: $scope.data
				})
				.done(function(data) {
					if(data.flag == 1) {
						$scope.$apply(function() {
							if(data.total == 0) {
								$scope.holderNullShow = true;
								$scope.commentList = '';
								return;
							} else {
								$scope.holderNullShow = false;
							}
							$scope.paginationConf.totalItems = data.total;
							$scope.commentList = data.objectList;
							$scope.commentList.forEach(function(item) {
								item.reply = "";
							})
						})
						console.log(data)
					} else {
						console.log("时间查询书籍失败")
					}
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});
		}
		//根据赞的数量排序
	$scope.orderPraiseClick = function() {
			$scope.data = {};
			if($scope.selectedBook == null || $scope.selectedBook == undefined) {
				$scope.data.authorId = userId;
			} else {
				$scope.data.authorId = userId;
				$scope.data.bookId = $scope.selectedBook;
			}
			$scope.data.numPerPage = $scope.paginationConf.itemsPerPage;
			$scope.data.pageNum = $scope.paginationConf.currentPage;
			$scope.newPushFlag = false;
			$scope.praiseFlag = true;
			$scope.replyFlag = false;
			$.ajax({
					url: IP + '/bookComment/selectBookCommentByPraise.do',
					type: 'POST',
					dataType: 'json',
					async: true,
					data: $scope.data
				})
				.done(function(data) {
					if(data.flag == 1) {
						$scope.$apply(function() {
							if(data.total == 0) {
								$scope.holderNullShow = true;
								$scope.commentList = '';
								return;
							} else {
								$scope.holderNullShow = false;
							}
							$scope.paginationConf.totalItems = data.total;
							$scope.commentList = data.objectList;
							$scope.commentList.forEach(function(item) {
								item.reply = "";
							})
						})
					} else {
						console.log("点赞查询书籍失败")
					}
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});
		}
		//根据回复数量排序
	$scope.orderReplyClick = function() {
		$scope.data = {};
		if($scope.selectedBook == null || $scope.selectedBook == undefined) {
			$scope.data.authorId = userId;
		} else {
			$scope.data.authorId = userId;
			$scope.data.bookId = $scope.selectedBook;
		}
		$scope.data.numPerPage = $scope.paginationConf.itemsPerPage;
		$scope.data.pageNum = $scope.paginationConf.currentPage;
		$scope.newPushFlag = false;
		$scope.praiseFlag = false;
		$scope.replyFlag = true;
		$.ajax({
				url: IP + '/bookComment/selectBookCommentByReply.do',
				type: 'POST',
				dataType: 'json',
				async: true,
				data: $scope.data
			})
			.done(function(data) {
				console.log("请求回复", data);
				if(data.flag == 1) {
					$scope.$apply(function() {
						if(data.total == 0) {
							$scope.holderNullShow = true;
							$scope.commentList = '';
							return;
						} else {
							$scope.holderNullShow = false;
						}
						$scope.paginationConf.totalItems = data.total;
						$scope.commentList = data.objectList;
						$scope.commentList.forEach(function(item) {
							item.reply = "";
						})
					})
				} else {
					console.log("回复查询书籍失败")
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {
				console.log("complete");
			});
	}

	//点击搜索
	$scope.search = function(e) {
		var keyCode = window.event ? e.keyCode : e.which;
		if(keyCode == 13) {
			if($scope.searchComment == null || $scope.searchComment.length == 0) {
				alert("请输入搜索内容");
				return;
			}
			console.log(userId + " " + $scope.searchComment + " " + $scope.paginationConf.itemsPerPage + " " + $scope.paginationConf.currentPage);
			$.ajax({
					url: IP + '/bookComment/selectBookCommentByReply.do',
					type: 'POST',
					dataType: 'json',
					async: true,
					data: {
						authorId: userId,
						commentContent: $scope.searchComment,
						numPerPage: $scope.paginationConf.itemsPerPage,
						pageNum: $scope.paginationConf.currentPage
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						if(data.objectList.length == 0) {
							Toast("没有搜索到相关评论", 1000);
						}
						$scope.$apply(function() {
							$scope.paginationConf.totalItems = data.total;
							$scope.commentList = data.objectList;
							$scope.commentList.forEach(function(item) {
								item.reply = "";
							})
						})
						console.log(data)

					} else {
						console.log("搜索查询书籍失败")
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
	$scope.orderTimeClick();
	$scope.authorBookClick();

	//设置点击菜单事件
	$scope.orderTimeClickC = function() {
		$scope.orderTimeClick();
	}
	$scope.orderPraiseClickC = function() {
		$scope.orderPraiseClick();
	}
	$scope.orderReplyClickC = function() {
		$scope.orderReplyClick();
	}

	//设置或取消置顶
	$scope.setTop = function(comment) {
		if(comment.isTop == 1) {
			comment.isTops = '置顶';
			comment.isTop = 0;
		} else {
			comment.isTops = '取消置顶';
			comment.isTop = 1;
		}
		$.ajax({
				type: "post",
				url: IP + "/bookComment/updateCommentTop.do",
				async: true,
				dataType: 'json',
				data: {
					id: comment.id,
					isTop: comment.isTop
				}
			}).done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					Toast("修改成功~", 1000);
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
	}

	//点赞
	$scope.praiseClick = function(comment) {
		if(comment.isPraise != undefined) {
			Toast("你已经赞过啦~", 1000);
			return;
		} else {
			$.ajax({
					type: "post",
					url: IP + "/bookComment/insertCommentPraise.do",
					async: true,
					dataType: 'json',
					data: {
						userId: comment.commentUserId,
						praiserId: userId,
						commentId: comment.id
					}
				}).done(function(data) {
					console.log(data)
					if(data.flag == 1) {
						$scope.$apply(function() {
							comment.bookCommentPraiseNum = data.objectList;
							comment.isPraise = true;
						})
						Toast("赞成功啦~", 1500);
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
		}
	}

	//设置置顶字符串
	$scope.setTops = function(comment) {
		if(comment.isTop == 0) {
			comment.isTops = '置顶';
		} else {
			comment.isTops = '取消置顶';
		}
		return true;
	}

	//点击回复按钮显示view
	$scope.replyClick = function(comment) {
		//评论的ID
	}

	//点击回复事件请求
	$scope.replyQuest = function(comment, content) {
			console.log(22222)
			$.ajax({
					type: "post",
					url: IP + "/bookComment/insertCommentReply.do",
					async: true,
					dataType: 'json',
					data: {
						commentId: comment.id,
						replyerId: userId,
						replyContent: content
					}
				}).done(function(data) {
					console.log(data)
					if(data.flag == 1) {
						$scope.$apply(function() {
							if($scope.newPushFlag) {
								$scope.orderTimeClick();
							} else if($scope.praiseFlag) {
								$scope.orderPraiseClick()
							} else {
								$scope.orderReplyClick();
							}

						})

						Toast("回复成功~", 1500);
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
		}
		//评论回复
	$scope.replayComment = function(comment, reply) {
		console.log(123)
		if(reply.length > 300) {
			Toast("不能超过300个字符哦~", 700);
			return;
		} else {
			$scope.replyQuest(comment, reply);
		}
	}

	//作者点击某一本书
	$scope.bookSelect = function(bookid) {
		if($scope.newPushFlag) {
			$scope.orderTimeClick();
		} else if($scope.praiseFlag) {
			$scope.orderPraiseClick();
		} else {
			$scope.orderReplyClick();
		}

	}
	var reGetProducts = function() {
		location.hash = "#topbookmanage1";
		if($scope.newPushFlag) {
			$scope.orderTimeClick();
		} else if($scope.praiseFlag) {
			$scope.orderPraiseClick();
		} else {
			$scope.orderReplyClick();
		}
		location.hash = "#topbookmanage";
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

	//查看评论的回复
	$scope.queryCommentReply = function(comment) {

	}
	$scope.replyContentNG = function(comment) {

	}

});
//检测输入的字符
function replyContent(comment) {
	console.log(comment)
	if(comment.length > 300) {
		Toast("不能超过300个字符哦~", 1000)
		return;
	}
}