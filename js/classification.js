var searchJSON;
var searchValue;

app.controller("classifyController", function($scope, $http, $window, $routeParams) {

	if(sessionStorage.Search) {
		searchJSON = sessionStorage.Search;
		searchJSON = eval("(" + searchJSON + ")");
	}

	//搜索内容回显
	if(sessionStorage.Search) {
		$scope.search_content_name = searchJSON.searchValue;
		sessionStorage.removeItem('Search');
		$("#search").val($scope.search_content_name);
	}
	var searchIndex = 0;
	var conList = $("#con_nav .nav_name");
	conList.removeClass('active');
	$(conList[1]).addClass('active');
	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 24
	};

	/*
		图书分类数组
	*/
	$scope.bookDistributeClass = function() {
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
	}

	$scope.bookDistributeClass();
	//获取分类数据
	//将搜索的值复制给
	searchValue = $scope.search_content_name;
	//搜索查询
	var pageNum = 1;
	var _bookType, _bookQueryType;
	var _newBookType;

	$scope.bookClassificationQuery = function(_bookType, _bookQueryType, _newBookType) {
		$.ajax({
				type: "post",
				url: IP + '/distribute/bookClassificationQuery.do',
				async: true,
				data: {
					numPerPage: $scope.paginationConf.itemsPerPage,
					pageNum: $scope.paginationConf.currentPage,
					booktype: _bookType,
					searchValue: searchValue,
					bookQueryType: _bookQueryType,
					newBookType: _newBookType
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.hot_book = data.objectList;
						$scope.paginationConf.totalItems = data.total;
						$scope.search_content_name = data.message;
					})
				}

			})
	}

	if(searchValue&&sessionStorage.getItem("first")!=1) {
		if(sessionStorage.feileiValue == 0) {
			_bookType = null;
		} else {
			_bookType = sessionStorage.feileiValue;
			_bookType--;
		}
		switch(parseInt(sessionStorage.paixuValue)) {
			case 1:
				_bookQueryType = 3;
				break;
			case 2:
				_bookQueryType = 4;
				break;
			case 3:
				_bookQueryType = 5;
				break;
			case 4:
				_bookQueryType = 0;
				break;
			case 5:
				_bookQueryType = 2;
				break;
			case 6:
				_bookQueryType = 1;
				break;
			default:
				_bookQueryType = null;
				break;
		}
		switch(parseInt(sessionStorage.zuopinValue)) {
			case 1:
				_newBookType = null;
				break;
			case 2:
				_newBookType = 6;
				break;
			default:
				_newBookType = null;
				break;
		}
//		alert(_bookType + " " + _bookQueryType + " " + _newBookType)
		$scope.bookClassificationQuery(_bookType, _bookQueryType, _newBookType);

	}

	//点击分类
	$scope.bookClasifyCode = function(code) {
		_bookType = code;
		$scope.bookClassificationQuery(code, _bookQueryType, _newBookType);

	}

	//点击排序
	$scope.bookQueryType = function(bookQueryType) {
		_bookQueryType = bookQueryType;
		$scope.bookClassificationQuery(_bookType, bookQueryType, _newBookType);
	}

	//点击作品
	$scope.bookWorks = function(newBookType) {
		_newBookType = newBookType;
		$scope.bookClassificationQuery(_bookType, _bookQueryType, newBookType);
	}

	//打开新窗口
	$scope.openWin = function(book_id) {
			$window.open("./html/book.html" + '?book_id=' + book_id);
			//alert(book_id)
		}
		//ng-img 分页
	var reGetProducts = function() {
		$scope.bookClassificationQuery(_bookType, _bookQueryType, _newBookType)
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

});

app.directive('repeatclassFinish', function() {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {
				if(searchValue) {
					if(sessionStorage.getItem("first")==1) {
						sessionStorage.feileiValue = 0;
						sessionStorage.paixuValue = 0;
						sessionStorage.zuopinValue = 1;
						sessionStorage.setItem("first", 0);
					}
					if(sessionStorage.feileiValue && sessionStorage.feileiValue != 0) {
						$(".classifyListA span").removeClass('selected');
						$(".classifyListA span").removeClass('unselected');
						$(".classifyListA span").eq(sessionStorage.feileiValue).addClass('selected');
						$(".classifyListA span").eq(sessionStorage.feileiValue).unbind('mouseenter').unbind('mouseleave');

					}
					if(sessionStorage.paixuValue && sessionStorage.paixuValue != 0) {
						$(".classifyListB span").removeClass('selected');
						$(".classifyListB span").removeClass('unselected');
						$(".classifyListB span").eq(sessionStorage.paixuValue).addClass('selected');
						$(".classifyListB span").eq(sessionStorage.paixuValue).unbind('mouseenter').unbind('mouseleave');

					}
					if(sessionStorage.zuopinValue && sessionStorage.zuopinValue != 1) {
						console.log(sessionStorage.zuopinValue)
						$(".classifyListC span").removeClass('selected');
						$(".classifyListC span").removeClass('unselected');
						$(".classifyListC span").eq(parseInt(sessionStorage.paixuValue) - 1).addClass('selected');
						$(".classifyListC span").eq(parseInt(sessionStorage.paixuValue) - 1).unbind('mouseenter').unbind('mouseleave');

					}
				} else {
					sessionStorage.feileiValue = 0;
					sessionStorage.paixuValue = 0;
					sessionStorage.zuopinValue = 1;
				}
				$(".classifyListA span").mouseenter(function() {
					$(this).addClass('unselected');
				}).mouseleave(function() {
					$(this).removeClass('unselected');
				})
				$(".classifyListB span").mouseenter(function() {
					$(this).addClass('unselected');
				}).mouseleave(function() {
					$(this).removeClass('unselected');
				})
				$(".classifyListC span").mouseenter(function() {
					$(this).addClass('unselected');
				}).mouseleave(function() {
					$(this).removeClass('unselected');
				})
				$(".classifyListA span").click(function() {
					sessionStorage.feileiValue = $(this).index() - 1;
					$(".classifyListA span").removeClass('selected');
					$(".classifyListA span").removeClass('unselected');
					$(this).addClass('selected');
					$(".classifyListA span").mouseenter(function() {
						$(this).addClass('unselected');
					}).mouseleave(function() {
						$(this).removeClass('unselected');
					})
					$(this).unbind('mouseenter').unbind('mouseleave');
				})
				$(".classifyListB span").click(function() {
					sessionStorage.paixuValue = $(this).index();
					$(".classifyListB span").removeClass('selected');
					$(".classifyListB span").removeClass('unselected');
					$(this).addClass('selected');
					$(".classifyListB span").mouseenter(function() {
						$(this).addClass('unselected');
					}).mouseleave(function() {
						$(this).removeClass('unselected');
					})
					$(this).unbind('mouseenter').unbind('mouseleave');
				})
				$(".classifyListC span").click(function() {

					sessionStorage.zuopinValue = $(this).index();
					$(".classifyListC span").removeClass('selected');
					$(".classifyListC span").removeClass('unselected');
					$(this).addClass('selected');
					$(".classifyListC span").mouseenter(function() {
						$(this).addClass('unselected');
					}).mouseleave(function() {
						$(this).removeClass('unselected');
					})
					$(this).unbind('mouseenter').unbind('mouseleave');
				})
			}
		}
	}
})
app.directive('pageRepeat', function() {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {
//				$(".page-list .pagination li").eq(1).addClass('active')
				pageTab();
			}
		}
	}
})
app.directive('chapterFinish', function() {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {
				if(scope.$last == true) {
					$('.list_live li').on('mouseenter', function() {
						$(this).find('.classInfo_list').show();
						$(this).find('.class_book_writer').animate({
							width: "30px",
							height: "30px"
						}, 500)
						$(this).find('.class_p1').animate({
							top: '45px'
						}, 150)
						$(this).find('.class_p2').animate({
							top: '70px'
						}, 300)
						$(this).find('.class_p3').animate({
							top: '95px'
						}, 450)
						$(this).find('.class_p4').animate({
							top: '120px'
						}, 600)
						$(this).find('.class_p5').animate({
							top: '145px'
						}, 750)
					});
					$('.b_body li').on('mouseleave', function() {
						$(this).find('.classInfo_list').hide();
						$(this).find('.class_book_writer').animate({
							width: "15px",
							height: "15px"
						}, 1)
						$(this).find('.classInfo_list p').not('.silverinfo_writer').animate({
							left: "10px",
							top: "-10px"
						}, 1)
					});
				}
			}
		}
	}
})