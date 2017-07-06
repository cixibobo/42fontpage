var app = angular.module('moreApp', ['tm.pagination']);
var searchValue;
app.controller('moreCtrl', function($scope, $http, $window) {
	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 24
	};
	/**
	 *全部 
	 */
	var searchValue = "";
	var _newBookType = "";
	var _bookType = "";

	$scope.allSel = true;

	var type = (window.location.href.split("="))[1];
	/**
	 * 点击上面的全部新书菜单等样式的改变 
	 * sel 为参数，标示当前点击的
	 */
	$scope.setClassTop = function(sel) {
		switch(sel) {
			case 0:
				//表示点击的是全部
				$scope.allSel = true;
				$scope.yinSel = false;
				$scope.gengSel = false;
				$scope.newSel = false;
				break;
			case 1:
				//表示点击的是银图钉榜
				$scope.allSel = false;
				$scope.yinSel = true;
				$scope.gengSel = false;
				$scope.newSel = false;
				break;
			case 2:
				//表示点击的是更新榜
				$scope.allSel = false;
				$scope.yinSel = false;
				$scope.gengSel = true;
				$scope.newSel = false;
				break;
			case 3:
				//表示点击的是新书榜
				$scope.allSel = false;
				$scope.yinSel = false;
				$scope.gengSel = false;
				$scope.newSel = true;
				break;
			default:
				//默认是全部
				$scope.allSel = true;
				$scope.yinSel = false;
				$scope.gengSel = false;
				$scope.newSel = false;
				break;
		}
	}

	/**
	 * 查找 书籍
	 * @param {Object} index
	 * @param {Object} flag 用来初始化
	 */
	$scope.bookClasifyCode = function(index,flag) {
//		$scope.setClassTop(index);
		if(flag==1){
			$scope.setClassTop(index);
		}
		if(index == 1) {
			_bookType = 3;
			_newBookType='';
		}
		//若type==1表示更新
		else if(index == 2) {
			_bookType = 5;
			_newBookType='';
		}
		//否则表示新书
		else if(index ==3){
			_bookType = '';
			_newBookType = 6;
		}else{
			_bookType = '';
			_newBookType='';
		}
		$.ajax({
				type: "post",
				url: IP + '/distribute/bookClassificationQuery.do',
				async: true,
				data: {
					numPerPage: $scope.paginationConf.itemsPerPage,
					pageNum: $scope.paginationConf.currentPage,
					booktype: "",
					searchValue: searchValue,
					bookQueryType: _bookType, //排序类型分类排序作品
					newBookType: _newBookType //
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.more_book = data.objectList;
						$scope.paginationConf.totalItems = data.total;
						$scope.search_content_name = data.message;
					})
				}

			})
	}
	
	$scope.toBookInfo=function(id){
		window.open(CurrentIp+"/html/book.html?book_id="+id);
	}
	
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
	
	$scope.searchClass = function() {
		var search = {
			searchValue: $scope.searchMain
		}
		var searchJson = JSON.stringify(search)
		var hrefsrc = window.location;
		var substr = "classify";
		sessionStorage.Search = searchJson;
		sessionStorage.setItem("first", 1);
		window.location.href = CurrentIp+"/index.html#/classify";
	}

	//若type==0 表示银图钉
	if(type == 0) {
		_bookType = 3;
		$scope.setClassTop(1);
		$scope.bookClasifyCode(1,0);
	}
	//若type==1表示更新
	else if(type == 1) {
		_bookType = 5;
		$scope.setClassTop(2);
		$scope.bookClasifyCode(2,0);
	}
	//否则表示新书
	else {
		_newBookType = 6;
		$scope.setClassTop(3);
		$scope.bookClasifyCode(3,0);
	}
	

	//ng-img 分页
	var reGetProducts = function() {
		$scope.bookClasifyCode()
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);
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