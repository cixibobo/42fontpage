//var app=angular.module("stapleHall",[]);
var price = 0;
var nowStock = 0;
var bookid = 0;
var authorid = 0;

var userName = null;
app.controller("bookDingController", function($scope, $window, $route) {
	//清空搜索框内容
	$("#search").val("");
	//获取分类数据
	var conList = $("#con_nav .nav_name");
	conList.removeClass('active');
	$(conList[2]).addClass('active');
	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 20,
		pagesLength: 7
	};

	var day_type, lengthNum;
	$scope.listLive = [];
	$scope.horizontIndex = [];
	$scope.horizont = [];
	$scope.copperIndex = [];
	$scope.copper = [];
	$scope.silverIndex = [];
	$scope.silver = [];
	$scope.indexListLive = {};
	$scope.listData = [];
	//是否已经加载完成
	$scope.isFinished = false;
	//初始化最热门和最新背景
	$scope.hot = true;
	$scope.newMost = false;
	var type = 1;

	//书的跳转
	$scope.jump = function(id) {
		$window.open(CurrentIp + "/html/book.html?book_id=" + id);
	}

	$scope.allProfit = function(type, kind) {

		$scope.isFinished = false;
		$scope.listLive = [];
		$scope.horizontIndex = [];
		$scope.horizont = [];
		$scope.copperIndex = [];
		$scope.copper = [];
		$scope.silverIndex = [];
		$scope.silver = [];
		$scope.indexListLive = {};
		$scope.listData = [];
		if(type == 1) {
			lengthNum = 7;
		} else if(type == 2) {
			lengthNum = 30;
		} else {
			lengthNum = 90;
		}
		$.ajax({
				type: "post",
				url: IP + "/bookNailHall/bookNailHallList.do",
				async: true,
				data: {
					type: type,
					kind: kind,
					numPerPage: $scope.paginationConf.itemsPerPage,
					pageNum: $scope.paginationConf.currentPage
				}
			})
			.done(function(data) {
				console.log(data)

				//设置为几天；
				$scope.day = lengthNum;
				//设置开始的天是几号

				//				$scope.pageall = parseInt((data.total) / 8) + 1;
				//				$scope.pageInit();
				//多少条数据
				data.objectList.forEach(function(item) {
					console.log(item);
					$scope.startDay = (new Date(item.startDate.substring(0, 10)));
					var d = $scope.startDay;
					//设置
					for(var i = 0; i < $scope.day; i++) {
						console.log(i);
						var listDD = {
							"id": 0,
							"bookId": 0,
							"statisticsDate": "",
							"silverProfit": 0,
							"copperProfit": 0
						}
						if(item.list[i] == null) {
							var dat = new Date((d / 1000 + i * 3600 * 24) * 1000);
							listDD.statisticsDate = dat.getFullYear() + "-" + (dat.getMonth() + 1) + "-" + dat.getDate();
							$scope.listData.push(listDD);
							$scope.horizontIndex.push(listDD.statisticsDate.substring(5, listDD.statisticsDate.length));
							$scope.copperIndex.push(0);
							$scope.silverIndex.push(0);

						} else {
							var j = 0;
							while(((new Date(item.list[i].statisticsDate.substring(0, 10))).getTime() - $scope.startDay.getTime()) / 3600000 / 24 > 0) {
								listDD.statisticsDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
								console.log(listDD.statisticsDate)
								$scope.listData.push(listDD);
								$scope.horizontIndex.push(listDD.statisticsDate.substring(5, listDD.statisticsDate.length));
								$scope.copperIndex.push(0);
								$scope.silverIndex.push(0);
								$scope.startDay = new Date(($scope.startDay / 1000 + 1 * 3600 * 24) * 1000);
								d = $scope.startDay;
								j++;
								console.log("相差天数不为0")
							}

							$scope.listData.push(item.list[i]);
							$scope.copperIndex.push(item.list[i].copperProfit);
							$scope.silverIndex.push(item.list[i].silverProfit);
							$scope.horizontIndex.push(($scope.startDay.getMonth() + 1) + "-" + $scope.startDay.getDate());
							$scope.day = $scope.day - j;

						}

						$scope.startDay = new Date(($scope.startDay / 1000 + 1 * 3600 * 24) * 1000);

					}
					console.log($scope.horizontIndex)
					$scope.indexListLive.bookId = item.bookId;
					$scope.indexListLive.authorId = item.authorId;
					$scope.indexListLive.list = $scope.listData;
					$scope.indexListLive.startDate = item.startDate;
					$scope.indexListLive.bookImageUrl = item.bookImageUrl;
					$scope.indexListLive.bookName = item.bookName;
					$scope.indexListLive.headUrl = item.headUrl;
					$scope.indexListLive.nickName = item.nickName;
					$scope.indexListLive.nowStock = item.nowStock;
					$scope.indexListLive.sellUnit = item.sellUnit;
					$scope.indexListLive.silverProfit = item.silverProfit;
					//若剩余股权大于0，显示购买按钮
					if(item.nowStock > 0) {
						$scope.indexListLive.canBuy = false;
						$scope.indexListLive.buyValue = '购买';
					} else {
						$scope.indexListLive.canBuy = true;
						$scope.indexListLive.buyValue = '已售完';
					}
					$scope.indexListLive.complex_list_time = '周榜';
					$scope.indexListLive.complex_listshow = false;
					$scope.indexListLive.showBuyInfo = false;
					$scope.listLive.push($scope.indexListLive);
					$scope.horizont.push($scope.horizontIndex);
					$scope.copper.push($scope.copperIndex);
					$scope.silver.push($scope.silverIndex);
					$scope.horizontIndex = [];
					$scope.copperIndex = [];
					$scope.silverIndex = [];
					$scope.listData = [];
					$scope.indexListLive = {};
					$scope.day = lengthNum;
					console.log("tianshu", $scope.day)
				})
				$scope.$apply(function() {
					$scope.paginationConf.totalItems = data.total;
					$scope.listLive = $scope.listLive;
				})
				console.log("水平线", $scope.horizont);
				console.log("银图钉", $scope.silver);
				console.log("铜螺钉", $scope.copper);
				console.log($scope.listLive);
				$scope.isFinished = true;
			})

	}
	$scope.allProfit(1, 2);

	/**
	 * 查询某本书的打书钉
	 * @param {Object} type
	 * @param {Object} kind
	 * @param {Object} bookId 书id
	 * @param {Object} _index 下标位置
	 */
	$scope.signProfig = function(type, kind, bookId, _index) {

		$scope.horizontIndex = [];
		$scope.copperIndex = [];
		$scope.silverIndex = [];
		$scope.indexListLive = {};
		$scope.listData = [];

		if(type == 1) {
			lengthNum = 7;
		} else if(type == 2) {
			lengthNum = 30;
		} else {
			lengthNum = 90;
		}
		$.ajax({
				type: "post",
				url: IP + "/bookNailHall/bookNailHallList.do",
				async: true,
				data: {
					type: type,
					kind: kind,
					bookId: bookId
				}
			})
			.done(function(data) {
				console.log(data)
					//设置为几天；
				$scope.daySign = lengthNum;
				//多少条数据
				data.objectList.forEach(function(item) {
					console.log(item);
					$scope.startDay = (new Date(item.startDate.substring(0, 10)));
					var d = $scope.startDay;
					//设置
					for(var i = 0; i < $scope.daySign; i++) {
						console.log(i);
						var listDD = {
							"id": 0,
							"bookId": 0,
							"statisticsDate": "",
							"silverProfit": 0,
							"copperProfit": 0
						}
						if(item.list[i] == null) {
							var dat = new Date((d / 1000 + i * 3600 * 24) * 1000);
							listDD.statisticsDate = dat.getFullYear() + "-" + (dat.getMonth() + 1) + "-" + dat.getDate();
							$scope.listData.push(listDD);
							$scope.horizontIndex.push(listDD.statisticsDate.substring(5, listDD.statisticsDate.length));
							$scope.copperIndex.push(0);
							$scope.silverIndex.push(0);

						} else {
							var j = 0;
							while(((new Date(item.list[i].statisticsDate.substring(0, 10))).getTime() - $scope.startDay.getTime()) / 3600000 / 24 > 0) {
								listDD.statisticsDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
								console.log(listDD.statisticsDate)
								$scope.listData.push(listDD);
								$scope.horizontIndex.push(listDD.statisticsDate.substring(5, listDD.statisticsDate.length));
								$scope.copperIndex.push(0);
								$scope.silverIndex.push(0);
								$scope.startDay = new Date(($scope.startDay / 1000 + 1 * 3600 * 24) * 1000);
								d = $scope.startDay;
								j++;
								console.log("相差天数不为0")
							}

							$scope.listData.push(item.list[i]);
							$scope.copperIndex.push(item.list[i].copperProfit);
							$scope.silverIndex.push(item.list[i].silverProfit);
							$scope.horizontIndex.push(($scope.startDay.getMonth() + 1) + "-" + $scope.startDay.getDate());
							$scope.daySign = $scope.daySign - j;

						}

						$scope.startDay = new Date(($scope.startDay / 1000 + 1 * 3600 * 24) * 1000);

					}
					console.log($scope.horizontIndex)
					$scope.indexListLive.bookId = item.bookId;
					$scope.indexListLive.authorId = item.authorId;
					$scope.indexListLive.list = $scope.listData;
					$scope.indexListLive.startDate = item.startDate;
					$scope.indexListLive.bookImageUrl = item.bookImageUrl;
					$scope.indexListLive.bookName = item.bookName;
					$scope.indexListLive.headUrl = item.headUrl;
					$scope.indexListLive.nickName = item.nickName;
					$scope.indexListLive.nowStock = item.nowStock;
					$scope.indexListLive.sellUnit = item.sellUnit;
					$scope.indexListLive.silverProfit = item.silverProfit;
					//若剩余股权大于0，显示购买按钮
					if(item.nowStock > 0) {
						$scope.indexListLive.canBuy = false;
						$scope.indexListLive.buyValue = '购买';
					} else {
						$scope.indexListLive.canBuy = true;
						$scope.indexListLive.buyValue = '已售完';
					}
					//					$scope.indexListLive.complex_list_time='周榜';
					//					$scope.indexListLive.complex_listshow=false;
					$scope.indexListLive.showBuyInfo = false;
					$scope.listLive[_index] = $scope.indexListLive;
					$scope.horizont[_index] = $scope.horizontIndex;
					$scope.copper[_index] = $scope.copperIndex;
					$scope.silver[_index] = $scope.silverIndex;
					//					$scope.horizontIndex = [];
					//					$scope.copperIndex = [];
					//					$scope.silverIndex = [];
					//					$scope.listData = [];
					//					$scope.indexListLive = {};
					//					$scope.daySign = lengthNumSign;
					console.log("tianshu", $scope.daySign)
				})
				$scope.$apply(function() {
					//					$scope.paginationConf.totalItems = data.total;
					$scope.listLive = $scope.listLive;
					$scope.rrr(_index);
				})
				console.log("水平线", $scope.horizont);
				console.log("银图钉", $scope.silver);
				console.log("铜螺钉", $scope.copper);
				console.log($scope.listLive);
			})
	}

	$scope.ComplexTimeClick = function(bookinfo, book, _index) {
		bookinfo.complex_listshow = false;
		if(book == 1) {
			//			if($scope.hot) {
			//				$scope.allProfit(1, 2);
			//			} else {
			//				$scope.allProfit(1, 1);
			//			}
			bookinfo.complex_list_time = '周榜';
		} else if(book == 2) {
//			if($scope.hot) {
//				$scope.signProfig(2, 2, bookinfo.bookId, _index);
//			} else {
//				$scope.signProfig(2, 1, bookinfo.bookId, _index);
//			}
			//			alert(1)
			bookinfo.complex_list_time = '月榜';
		} else {
			//			if($scope.hot) {
			//				$scope.allProfit(3, 2);
			//			} else {
			//				$scope.allProfit(3, 1);
			//			}
			bookinfo.complex_list_time = '季榜';
		}

	}

	$scope.rrr = function(_index_) {
			var options = {

				//Boolean - If we show the scale above the chart data			
				scaleOverlay: false,

				//Boolean - If we want to override with a hard coded scale
				scaleOverride: false,

				//** Required if scaleOverride is true **
				//Number - 表格上有几道横线，分成scaleSteps块
				scaleSteps: 1,
				//Number - 总的高度值
				scaleStepWidth: 50,
				//Number - 开始的数值
				scaleStartValue: 0,

				//String - Y轴线的颜色
				scaleLineColor: "rgba(0,0,0,.1)",

				//Number - X轴和Y轴线的宽度，推荐为1
				scaleLineWidth: 1,

				//Boolean - 是否在Y轴上显示数值
				scaleShowLabels: true,

				//Interpolated JS string - can access value
				scaleLabel: "<%=value%>",

				//String - 轴上应用的字体
				scaleFontFamily: "'Arial'",

				//Number - 轴上字体的大小
				scaleFontSize: 12,

				//String - 轴上字体样式
				scaleFontStyle: "normal",

				//String - 轴上字体颜色
				scaleFontColor: "#666",

				///Boolean - 是否在表上显示标尺线
				scaleShowGridLines: false,

				//String - 标尺线的颜色
				scaleGridLineColor: "rgba(0,0,0,.05)",

				//Number - 标尺线的宽度
				scaleGridLineWidth: 1,

				//Boolean - 点与点之间是否为曲线，true曲线，false直线
				bezierCurve: false,

				//Boolean - 是否显示点
				pointDot: true,

				//Number - 点的大小
				pointDotRadius: 3,

				//Number - 点边框的像素宽度
				pointDotStrokeWidth: 1,

				//Boolean - Whether to show a stroke for datasets
				datasetStroke: true,

				//Number - 线的宽度
				datasetStrokeWidth: 2,

				//Boolean - 是否用颜色填充数据集
				datasetFill: false,

				//Boolean - 动画
				animation: true,

				//Number - 动画的时间，多少数值之后运行完动画
				animationSteps: 60,

				//String - 动画效果
				animationEasing: "easeOutQuart",

				//Function - 当动画完成时的动作
				onAnimationComplete: null

			}

			$scope.horizontQ = [];
			$scope.copperQ = [];
			$scope.silverQ = [];
			var j = 0;

			//		if(_index_ == null || _index_ == undefined) {
			var ctx = document.getElementsByTagName('canvas');
			//			alert("if")
			for(var i = 0; i < ctx.length; i++) {
				var c = ctx[i].getContext("2d");
				console.log(c);
				if(lengthNum != 7) {
					if(lengthNum == 30) {
						for(j = 0; j < 30; j++) {
							$scope.horizontQ.push(($scope.horizont[i])[j]);
							$scope.copperQ.push(($scope.copper[i])[j]);
							$scope.silverQ.push(($scope.silver[i])[j]);
							j = j + 3;
						}

					} else if(lengthNum == 90) {
						for(j = 0; j < 90; j++) {
							$scope.horizontQ.push(($scope.horizont[i])[j]);
							$scope.copperQ.push(($scope.copper[i])[j]);
							$scope.silverQ.push(($scope.silver[i])[j]);
							j = j + 9;
						}
					}
					$scope.horizont[i] = $scope.horizontQ;
					$scope.copper[i] = $scope.copperQ;
					$scope.silver[i] = $scope.silverQ;
					$scope.horizontQ = [];
					$scope.copperQ = [];
					$scope.silverQ = [];
					console.log("testetst", $scope.horizont[i]);
				}
				var data = {
					labels: $scope.horizont[i],
					datasets: [{
							fillColor: "#DDDDDD",
							strokeColor: "#DDDDDD",
							pointColor: "#FFCF11",
							pointStrokeColor: "#fff",
							data: $scope.silver[i]
						}
						//				,
						//				{
						//					fillColor: "rgba(151,187,205,0.5)",
						//					strokeColor: "rgba(151,187,205,1)",
						//					pointColor: "rgba(151,187,205,1)",
						//					pointStrokeColor: "#fff",
						//					data: $scope.copper[i]
						//				}
					]
				}
				new Chart(c).Line(data, options);
//				if(i == 0) {
//					fir = new Chart(c);
//					fir.Line(data, options);
//				} else if(i == 1) {
//					sec = new Chart(c);
//					sec.Line(data, options);
//				} else {
//					thr = new Chart(c);
//					thr.Line(data, options);
//				}
//				

			}
		}
		//		} else {
		//			var ctx = document.getElementsByTagName('canvas');
		////			ctx[_index_].remove();
		////			
		////			alert(1+"  "+ctx.length)
		////			var ca = document.createElement('canvas');
		////			var pos = document.getElementsByTagName('canvas')[_index_];
		////			pos.append(ca);
		////			ctx = document.getElementsByTagName('canvas');
		//			alert(2+"  "+ctx.length)
		//			var c1 = ctx[_index_].getContext("2d");
		//			alert("else")
		//			console.log(c1);
		//			if(lengthNum != 7) {
		//				if(lengthNum == 30) {
		//					for(j = 0; j < 30; j++) {
		//						$scope.horizontQ.push(($scope.horizont[_index_])[j]);
		//						$scope.copperQ.push(($scope.copper[_index_])[j]);
		//						$scope.silverQ.push(($scope.silver[_index_])[j]);
		//						j = j + 3;
		//					}
		//
		//				} else if(lengthNum == 90) {
		//					for(j = 0; j < 90; j++) {
		//						$scope.horizontQ.push(($scope.horizont[_index_])[j]);
		//						$scope.copperQ.push(($scope.copper[_index_])[j]);
		//						$scope.silverQ.push(($scope.silver[_index_])[j]);
		//						j = j + 9;
		//					}
		//				}
		//				$scope.horizont[_index_] = $scope.horizontQ;
		//				$scope.copper[_index_] = $scope.copperQ;
		//				$scope.silver[_index_] = $scope.silverQ;
		//				$scope.horizontQ = [];
		//				$scope.copperQ = [];
		//				$scope.silverQ = [];
		//				console.log("testetst", $scope.horizont[_index_]);
		//			}
		//			var data1 = {
		//				labels: [1, 2, 3, 4, 5, 6, 7],
		//				//				labels: $scope.horizont[_index_],
		//
		//				datasets: [{
		//						fillColor: "#DDDDDD",
		//						strokeColor: "#DDDDDD",
		//						pointColor: "#FFCF11",
		//						pointStrokeColor: "#fff",
		//						//						data: $scope.silver[_index_]
		//						data: [2, 3, 4, 5, 6, 7, 8]
		//
		//					}
		//					//				,
		//					//				{
		//					//					fillColor: "rgba(151,187,205,0.5)",
		//					//					strokeColor: "rgba(151,187,205,1)",
		//					//					pointColor: "rgba(151,187,205,1)",
		//					//					pointStrokeColor: "#fff",
		//					//					data: $scope.copper[i]
		//					//				}
		//				]
		//			}
		////			if(_index_ == 0) {
		////				fir.destroy();
		////				fir = new Chart(c1);
		////				fir.Line(data, options);
		////			} else if(_index_ == 1) {
		////				sec = new Chart(c1);
		////				sec.Line(data, options);
		////			} else {
		////				thr.destroy();
		////				thr = new Chart(c1);
		////				thr.Line(data, options);
		////			}
		//			new Chart(c1).Line(data1, options);
		//
		//		}

	//	}

	//购买界面框
	$scope.buyStock = function(stockInfo) {
		//检测登录
		if(userId == null || userId == undefined || userId == "") {
			Toast("请先登录哦~");
			return;
		}
		console.log(stockInfo)
			//价格
		price = stockInfo.sellUnit;
		nowStock = stockInfo.nowStock;
		bookid = stockInfo.bookId;
		authorid = stockInfo.authorId;
		$scope.showBuyInfo = true;
		$scope.popubBodyMask = true;
		$('html,body').css('overflow', 'hidden');
	}

	//取消购买界面框
	$scope.cancelBuyStock = function() {
		$scope.showBuyInfo = false;
		$scope.popubBodyMask = false;
		$('html,body').css('overflow', 'auto');
	}

	//点击最热门和最新事件
	$scope.hotS = function() {
		if(!$scope.isFinished) {
			return;
		}
		$scope.hot = true;
		$scope.newMost = false;
		//设置kind为2并请求数据
		$scope.allProfit(type, 2);
	}
	$scope.newMostS = function() {
		if(!$scope.isFinished) {
			return;
		}

		$scope.hot = false;
		$scope.newMost = true;
		//设置kind为1并请求数据
		$scope.allProfit(type, 1);
	}
	var reGetProducts = function() {
		if($scope.hot) {
			$scope.hotS();
		} else {
			$scope.newMostS();
		}
	}
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

	//购买输入改变事件
	$scope.buyChF = function(buy) {
			$scope.transPrice = buy * price;
		}
		//初始化默认协议为未点击
	$scope.isAgree = false;
	//购买股权
	$scope.buySure = function(buy) {
		if(userId == null || userId == undefined || userId.length == 0) {
			Toast("请先登录哦~", 2000);
			return;
		}
		if(!$scope.isAgree) {
			Toast("请先同意协议哦~", 2000);
			return;
		}
		if(buy == undefined || buy.length == 0 || price == 0) {
			Toast("输入不能为空哦~", 2000);
			return;
		}
		if(buy % 10 != 0) {
			Toast("只能输入10的整数倍哦~", 2000);
			return;
		}
		if(buy <= 0) {
			Toast("购买数目不能小于0哦~", 2000);
			return;
		}
		if(buy > nowStock) {
			Toast("只剩" + nowStock + "%了哦~", 2000);
			return;
		}

		$scope.isAgree = false;
		price = 0;
		$scope.buyPercent = 0;
		$scope.transPrice = 0;

		//		alert(bookid + " " + authorid + " " + userId + " " + buy + " " + userName)
		$.ajax({
				url: IP + '/bookNailHall/buyStock.do',
				type: 'POST',
				dataType: 'json',
				async: true,
				data: {
					bookId: bookid,
					shellId: authorid,
					toShellId: userId,
					shellNum: buy,
					userName: userName
				}
			})
			.done(function(data) {
				console.log(data);
				if(data.flag == 1) {
					Toast("购买成功啦~", 2000);
					$('html,body').css('overflow', 'auto');
					$scope.$apply(function() {
						$scope.showBuyInfo = false;
						$scope.popubBodyMask = false;
						$scope.allProfit();
					})

				} else {
					Toast("购买出现了一点小问题~~");
				}
			})
	}

});
app.directive("runoobDirective", function() {
	return {
		link: function(scope, element, attrs) {
			if(scope.$last) {
				scope.$eval(attrs.runoobDirective)
			}
		}
	};
});
app.directive('pageRepeat', function() {
		return {
			link: function(scope, element, attr) {
				if(scope.$last == true) {
//					$(".page-list .pagination li").eq(1).addClass('active')
					pageTab();
				}
			}
		}
	})
	//app.directive('pageRepeat', function() {
	//	return {
	//		link: function(scope, element, attr) {
	//			if(scope.$last == true) {
	//				$(".page-list .pagination li").eq(1).addClass('active')
	//				pageTab();
	//			}
	//		}
	//	}
	//})s