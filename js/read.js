var Request = new Object();
Request = GetRequest();

var _chapterId = Request.chapterId;
var _bookId = Request.bookId;
var _history = Request.isHistory;
var index = parseInt(Request.index) + 1;
var _juan_index = parseInt(Request.juanIndex) + 1;
var volumeCode; //当前卷编号
var _currentChapterId; // 当前章节Id
//下一章价格
var nextChapterPrice;
//存

var Util = (function() {
	var prefix = 'ft_read_'
	var StorageGetter = function(key) {
		return sessionStorage.getItem(prefix + key);
	}
	var StorageSetter = function(key, val) {
		return sessionStorage.setItem(prefix + key, val);
	}
	return {
		StorageGetter: StorageGetter,
		StorageSetter: StorageSetter,
	}
})();

/**
 *页面刷新事件监听
 */

var app = angular.module('readBook', []);
app.controller('personCtrl', function($scope, $http, $window) {
	var _chapterSilverMoney; //章节价格
	console.log(getCookie('currentChapterId') + getCookie('currentChapterId') + getCookie('_read_juan_index'))
	if(_history == undefined || _history == null) {
		if(getCookie('currentChapterId') && getCookie('_readindex') && getCookie('_read_juan_index')) {
			_chapterId = getCookie('currentChapterId');
			index = getCookie('_readindex');
			_juan_index = getCookie('_read_juan_index');
		}
	} else {
		index=0;
		_juan_index=0;
	}
	_currentChapterId = _chapterId;
	$scope._juan_index = _juan_index; //卷的序列
	var _buttonflag = 1; //0代表上一章，2代表下一章

	/**
	 * 此标志用来判断是否为下一章还是上一张 
	 */
	$scope.preNextFlag = true;

	$scope.getContent = function(id) {
		if(getCookie('currentChapterId')) {
			delCookie('currentChapterId');
			delCookie('_readindex');
			delCookie('_read_juan_index');
		}
		_currentChapterId = id;
		$('html, body').animate({ //添加animate动画效果  
			scrollTop: 0
		}, 10);
		_chapterId = id;
		$.ajax({
				type: "post",
				url: IP + '/createBook/queryChapter.do',
				data: {
					id: id,
					bookId: _bookId,
					userId: userId,
					state: 0,
					isHistory: _history
				}
			})
			.done(function(data) {
				console.log("下一张", data)

				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.chapter = content = data.objectList[0];
						if(data.objectList[0] != undefined) {
							if(!volumeCode) {
								volumeCode = data.objectList[0].volumeCode;
							}
							if(_buttonflag == 0) { //上一章
								index = parseInt(index) - 1;
								if(volumeCode != data.objectList[0].volumeCode) {
									_juan_index--;
									$scope._juan_index = _juan_index;
								}
							}
							if(_buttonflag == 2) { //下一章
								index = parseInt(index) + 1;
								if(volumeCode != data.objectList[0].volumeCode) {
									_juan_index++;
									$scope._juan_index = _juan_index;
								}
							}
							setCookie('currentChapterId', id);
							setCookie('_readindex', parseInt(index));
							setCookie('_read_juan_index', parseInt(_juan_index));
							_buttonflag = 1;
							var content = data.objectList[0].chapterContent;
							$scope.innerHtml(content);
							$scope.preChapterId = data.objectList[0].preChapterId;
							$scope.nextChapterId = data.objectList[0].nextChapterId;
							_chapterSilverMoney = data.objectList[0].chapterPrice;
							$scope.index = index;
							$("#title").html($scope.chapter.bookName+"- "+$scope.chapter.volumeName+"- "+$scope.chapter.chapterName+"- 42轻小说- 42文库")
							$scope.authorId = data.objectList[0].authorId;
							//							$scope.nextChapterInfo($scope.nextChapterId);

						}
					})
				}
			})
	}
	$scope.getContent(_chapterId);
	//	if(_history == undefined || _history == null) {
	//
	//	} else {
	//		$scope.getContent();
	//	}
	//主题颜色
	var themeColors = {
			"white": "#ffffff",
			"naturals": "#f6f4ec",
			"green": "#e6f0e6",
			"skyblue": "#e3f5fa",
			"grey": "#f5f5f5",
			"pink": "#f5e9ef",
			"dark": "#323536",
		}
		//主题字体
	var themeFonts = {
		"yaahei": "微软雅黑 ",
		"soong": "STSong",
		"kaai": "STKaiti",
	}
	var themeIndex = {
		"yaahei": 0,
		"soong": 1,
		"kaai": 2,
	}

	//阅读设置弹窗
	var r_set_popup = false;
	$scope.readSet = function() {
		$scope.r_set_popup = !$scope.r_set_popup;
		//黑色背景
		if(Util.StorageGetter('back-dark')) {
			if(Util.StorageGetter('back-dark') == 'dark') {
				$scope.nightModeCss('dark');
			}
		}
		if(Util.StorageGetter('background_color')) {
			$("#changeTheme  .iconfont").empty();
			$('.' + Util.StorageGetter('background_color')).append("<i class='iconfont'>&#xe621;</i>");
			Util.StorageSetter('back-dark', 'white')
		}

		if(Util.StorageGetter('font_size')) {
			$scope.fontSize = Util.StorageGetter('font_size');
		}
		if(Util.StorageGetter('line_height')) {
			$scope.fontLine = Util.StorageGetter('line_height')
		}
		if(Util.StorageGetter('font_family')) {
			var _index = 0;
			var type = Util.StorageGetter('font_family');
			var elemList = $("#changeFont .change_font");
			$(elemList).removeClass('active');
			$(elemList[themeIndex[type]]).addClass('active');
		}
	};

	//关闭阅读设置弹窗
	$scope.closeSet = function() {
		$scope.r_set_popup = false;
	};
	//满屏
	var _isAllScreen = true;
	$scope.fullScreen = function() {
			if(_isAllScreen) {
				kaishi();
			} else {
				guanbi();
			}
			_isAllScreen = !_isAllScreen;
		}
		//日间夜间模式切换。。
	$scope.nightModeCss = function(value) {
			if(value == 'white') {
				Util.StorageSetter('back-dark', value);
				$("#readArticle p").css("color", "#ffffff");
				$("#readArticle span").css("color", "#ffffff");
				//$(".reward_bbtn").css("background-color", "#323536");
				$(".readb_title").css("color", "#000000");
				if(Util.StorageGetter('background_color')) {
					$scope.changeTheme(Util.StorageGetter('background_color'))
				} else {
					$scope.changeTheme('pink')
				}

			} else {
				Util.StorageSetter('back-dark', value);
				$scope.theme_bg = {
					"background-color": themeColors[value],
				}
				$("#readArticle p").css("background-color", themeColors[value]);
				$("#readArticle span").css("background-color", themeColors[value]);
				$("#readArticle p").css("color", "#ffffff");
				$("#readArticle span").css("color", "#ffffff");
				//$(".reward_bbtn").css("background-color", "#323536");
				$(".readb_title").css("color", "#ffffff");
			}
		}
		//夜间模式
	$scope.nightMode = function() {
		var value;
		//夜间黑色
		if(Util.StorageGetter('back-dark')) {
			if(Util.StorageGetter('back-dark') == 'dark') {
				value = "white";
				$scope.nightModeCss(value)
				return;
			}
			value = "dark";
			$scope.nightModeCss(value)
		} else {
			value = "dark";
			$scope.nightModeCss(value)
		}
	}

	//背景换肤
	$scope.changeTheme = function(val) {
		$("#changeTheme  .iconfont").empty();
		$('.' + val).append("<i class='iconfont'>&#xe621;</i>");

		$scope.theme_bg = {
			"background-color": themeColors[val],
		}
		$("#readArticle p").css("background-color", themeColors[val]);
		$("#readArticle span").css("background-color", themeColors[val]);
		if(val == 'dark') {
			$("#readArticle p").css("color", "#ffffff");
			$("#readArticle span").css("color", "#ffffff");
			$(".readb_title").css("color", "#ffffff");
			//$(".reward_bbtn").css("background-color", "#323536");
		} else {
			$("#readArticle p").css("color", "#000000");
			$("#readArticle span").css("color", "#000000");
			$(".readb_title").css("color", "#000000");
			//$(".reward_bbtn").css("background-color", "#efeceb");
		}
		Util.StorageSetter('background_color', val);
	}

	//更改字体样式
	$scope.changeFont = function(type) {
		$("#readArticle").css('font-family', themeFonts[type]);
		$("#readArticle p").css('font-family', themeFonts[type]);
		$("#readArticle span").css('font-family', themeFonts[type]);
		Util.StorageSetter('font_family', type);
		Util.StorageSetter('line_height', '2.4em');
	}

	//行高改动 
	$scope.fontLineChange = function(type) {
			var number = $scope.fontLine;
			number = parseFloat(number).toFixed(1);
			if(number <= 1.2) {
				number = 1.3;
			}
			if(number >= 2.6) {
				number = 2.5;
			}
			if(1.2 < number && number < 2.6) {
				if(type == 0) {
					if($scope.fontLine > 1.2) {
						$scope.fontLine = $scope.fontLine - 0.1;
					}
				} else {
					if($scope.fontLine < 2.6) {
						$scope.fontLine = (1 + parseFloat($scope.fontLine) * 10) / 10;
					}
				}
				$scope.fontLine = parseFloat($scope.fontLine).toFixed(1);
				$("#readArticle").css('line-height', $scope.fontLine + 'em');
				$("#readArticle p").css('line-height', $scope.fontLine + 'em');
				$("#readArticle span").css('line-height', $scope.fontLine + 'em');
				Util.StorageSetter('line_height', $scope.fontLine);
			}
		}
		//字号改动 
	$scope.fontSizeChange = function(type) {
		var number = $scope.fontSize;
		if(number <= 12) {
			number = 13;
		}
		if(number >= 28) {
			number = 27;
		}
		if(12 < number && number < 28) {
			if(type == 0) {
				if($scope.fontSize > 12) {
					$scope.fontSize--;
				}
			} else {
				if($scope.fontSize < 28) {
					$scope.fontSize++;
				}
			}
			$("#readArticle").css('font-size', $scope.fontSize + 'px');
			$("#readArticle p").css('font-size', $scope.fontSize + 'px');
			$("#readArticle span").css('font-size', $scope.fontSize + 'px');
			Util.StorageSetter('font_size', $scope.fontSize);
			$("#readArticle p").css('line-height', Util.StorageGetter('line_height') + 'em');
		}

	}

	/**
	 * 打赏
	 */
	//打赏弹窗
	var myVar = false;
	$scope.toggle = function() {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			return;
		}
//		if(userId == $scope.authorId) {
//			Toast("亲,自己不能给自己的书打赏哟", 1000);
//			return;
//		}
		//查询账户金额
		$.ajax({
				type: "post",
				url: IP + '/userMoney/queryMoney.do',
				async: true,
				data: {
					id: userId
				}
			})
			.done(function(data) {
				$scope.$apply(function() {
					$scope.userMoney = data.objectList[0];
				})
			})

		$scope.myVar = !$scope.myVar;
	};
	//关闭打赏弹窗
	$scope.cancelP = function() {
		$scope.myVar = false;
	};

	//铜的价格
	$scope.setRewardT = function(tong) {
			if($scope.money_T) {
				if($scope.money_T == tong) {
					tong = 0;
				}
			}
			$scope.money_T = tong;
		}
		/**
		 *金额json数据 
		 */
	var rewardJSON = {
			7: "奈奈的拳击比赛真好看",
			42: "宇宙、生命以及一切问题的终极答案",
			106: "贵站美术设计师的生日",
			248: "某站站长某天夜间失眠，起床抽烟的时刻",
			473: "某站站长随意打的数字，具体含义未知",
			613: "某台湾哲学美少女赐予的网站数字",
			1031: "某站站长不要脸地把自己生日日期加了上去",
			2017: "某站开站的年份"
		}
		//银的价格
	$scope.setRewardY = function(yin) {
//		$scope.rewardTitle = rewardJSON[yin];
		if($scope.money_Y) {
			if($scope.money_Y == yin) {
				yin = 0;
			}
		}
		$scope.money_Y = yin;
	}

	//大赏提交
	$scope.subReward = function() {
		if($scope.money_T > $scope.userMoney.copperThumbTack) {
			$scope.balanceDialog = true;
			return
		}
		if($scope.money_Y > $scope.userMoney.silverThumbTack) {
			$scope.balanceDialog = true;
			return
		}

		if($scope.money_T == undefined && $scope.money_Y == undefined) {
			Toast("请先选择打赏金额", 1000);
			return;
		}

		if($scope.money_T != undefined) {
			$.ajax({
					type: "post",
					url: IP + '/readBook/rewardForBook.do',
					async: true,
					data: {
						bookId: _bookId,
						userId: userId,
						fee: $scope.money_T,
						type: 1
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						Toast("谢谢打赏", 1000);
						$scope.myVar = false;
					} else {
						Toast("打赏失败", 1000)
					}
				})
		}
		if($scope.money_Y != undefined) {
			$.ajax({
					type: "post",
					url: IP + '/readBook/rewardForBook.do',
					async: true,
					data: {
						bookId: _bookId,
						userId: userId,
						fee: $scope.money_Y,
						type: 0
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						Toast("谢谢打赏", 1000);
						$scope.myVar = false;
					} else {
						Toast("打赏失败", 1000)
					}
				})

		}
		$scope.myVar = false;
	}

	//跳转到充值页面
	$scope.returnToRecharge = function() {
		$scope.balanceDialog = !$scope.balanceDialog;
		$window.location.href = "./personCenter/sildebar.html?needUrl=" + "mywallet"
	}

	//上一章
	$scope.preChapter = function() {
		_buttonflag = 0;
		if(!$scope.preChapterId) {
			Toast("没有上一章啦", 1000);
			return;
		}
		$scope.preNextFlag = false;
		$scope.nextChapterInfo($scope.preChapterId)
		if($scope.flag == 0) {
			Toast("上一章错误", 1000);
			return;
		}
		if($scope.flag == 2) {
			/**
			 * 若存在点击保存则直接扣费 
			 */
			if(sessionStorage.getItem("islongerPrompt") == 1) {
				$scope.moneyIsRead();
				if(!$scope.moneyIsFlag) {
					$scope.balanceDialog = true;
				}
				//余额足够
				else {
					//读书

					$.ajax({
							type: "post",
							url: IP + '/readBook/readBook.do',
							async: true,
							data: {
								userId: userId,
								money: nextChapterPrice,
								chapterId: $scope.preChapterId,
								bookId: _bookId
							}
						})
						.done(function(data) {
							if(data.flag == 1) {

								$scope.getContent($scope.preChapterId);
							} else {
								Toast("消费异常,请联系客服", 1000);
							}

						})

				}
			} else {
				$scope.purchaseChapter = true;
				return;
			}
		}
	}

	/**
	 *	查询下一章的信息 
	 * @param {Object} nextId
	 */
	$scope.nextChapterInfo = function(nextId) {
		//查询信息
		$.ajax({
				type: 'post',
				url: IP + '/createBook/queryChapterTou.do',
				dataType: 'json',
				async: false,
				data: {
					id: nextId
				}
			})
			.done(function(data) {
				console.log("下一章信息", data)

				nextChapterPrice = data.objectList[0].chapterPrice;

				if(data.objectList[0].id == null) {
					$scope.flag = 0;
					return;
				}
				/**
				 * 判断是否可读 
				 */
				$.ajax({
						type: 'post',
						url: IP + '/readBook/bookIsRead.do',
						dataType: 'json',
						async: false,
						data: {
							bookId: _bookId,
							chapterId: nextId,
							userId: userId,
							isFreeRead: null,
							money: nextChapterPrice
						},
					})
					.done(function(data) {
						console.log("是否可读", data)
						if(data.flag == 1) {
							$scope.flag = 1;

							$scope.getContent(nextId);

						} else {
							$scope.flag = 2;
							return;
						}

					})
			})
	}

	/**
	 * 用户余额 是否足够 
	 */
	$scope.moneyIsRead = function() {
		//查询余额是否够
		$.ajax({
				type: "post",
				url: IP + '/userMoney/queryMoney.do',
				async: false,
				data: {
					id: userId
				}
			})
			.done(function(data) {
				console.log("用户余额", data)
				$scope.userMoney = data.objectList[0];
				//										var chapterMoney = $scope.chapter_money_show;
				if(nextChapterPrice > ($scope.userMoney.silverThumbTack + $scope.userMoney.copperThumbTack * 10.0)) {
					//					$scope.balanceDialog = true;
					$scope.moneyIsFlag = false;
					return;
				} else {
					$scope.moneyIsFlag = true;
					return;
				}
			})
	}

	//下一章

	$scope.nextChapter = function() {
		_buttonflag = 2;
		$scope.preNextFlag = true;
		//
		if(!$scope.nextChapterId) {
			Toast("没有下一章啦", 1000);
			return;
		}

		$scope.nextChapterInfo($scope.nextChapterId)
		if($scope.flag == 0) {
			Toast("下一章错误", 1000);
			return;
		}
		if($scope.flag == 2) {
			/**
			 * 若存在点击保存则直接扣费 
			 */
			if(sessionStorage.getItem("islongerPrompt") == 1) {
				$scope.moneyIsRead();
				if(!$scope.moneyIsFlag) {
					$scope.balanceDialog = true;
				}
				//余额足够
				else {
					//读书
					$.ajax({
							type: "post",
							url: IP + '/readBook/readBook.do',
							async: true,
							data: {
								userId: userId,
								money: nextChapterPrice,
								chapterId: $scope.nextChapterId,
								bookId: _bookId
							}
						})
						.done(function(data) {
							console.log(data)
							console.log($scope.nextChapterId)
							if(data.flag == 1) {

								$scope.getContent($scope.nextChapterId);
							} else {
								Toast("消费异常,请联系客服", 1000);
							}

						})
				}
			} else {
				$scope.purchaseChapter = true;
				return;
			}
		}
	}

	$scope.confirmPurchaseChapter = function() {
		if($scope.islongerPrompt) {
			sessionStorage.setItem("islongerPrompt", 1);
		} else {
			sessionStorage.setItem("islongerPrompt", 0);
		}
		$scope.moneyIsRead();
		$scope.purchaseChapter = false;
		if(!$scope.moneyIsFlag) {
			$scope.balanceDialog = true;
		}
		//余额足够
		else {
			if($scope.preNextFlag) {
				var s = $scope.nextChapterId;
			} else {
				var s = $scope.preChapterId;
			}
			//读书

			$.ajax({
					type: "post",
					url: IP + '/readBook/readBook.do',
					async: true,
					data: {
						userId: userId,
						money: nextChapterPrice,
						chapterId: s,
						bookId: _bookId
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						$scope.getContent(s);
					} else {
						Toast("消费异常,请联系客服", 1000);
					}
				})

		}

	}
	$scope.cancelPurchaseChapter = function() {

		$scope.purchaseChapter = false;
		return false;
	}

	//	this.isScrewActive = false;
	$scope.screwActive = function() {
			this.isScrewActive = true;

		}
		//初始化
	$scope.init = function() {
		$("#readArticle").css("background-color", "#e6f0e6");
		$("#readArticle p").css("background-color", "#e6f0e6");
		$("#readArticle span").css("background-color", "#e6f0e6");
		$("#readArticle").css("font-size", "20px");
		$("#readArticle p").css("font-size", "20px");
		$("#readArticle span").css("font-size", "20px");
		$("#readArticle").css("line-height", "2.0em");
		$("#readArticle p").css("line-height", "2.0em");
		$("#readArticle span").css("line-height", "2.0em");
		if(Util.StorageGetter('background_color')) {
			$scope.theme_bg = {
				"background-color": themeColors[Util.StorageGetter('background_color')]
			}
			$("#readArticle").css("background-color", themeColors[Util.StorageGetter('background_color')]);
			$("#readArticle p").css("background-color", themeColors[Util.StorageGetter('background_color')]);
			$("#readArticle span").css("background-color", themeColors[Util.StorageGetter('background_color')]);
			if(Util.StorageGetter('background_color')=='dark'){
				$("#readArticle p").css("color", "#ffffff");
				$("#readArticle span").css("color", "#ffffff");
				$(".readb_title").css("color", "#ffffff");
			}
		}
		//黑色背景
		if(Util.StorageGetter('back-dark')) {
			if(Util.StorageGetter('back-dark') == 'dark') {
				$scope.nightModeCss('dark');
			}
		}
		$("#readArticle").css('font-size', Util.StorageGetter('font_size') + 'px');
		$("#readArticle p").css('font-size', Util.StorageGetter('font_size') + 'px');
		console.log(Util.StorageGetter('font_size'));
		$("#readArticle span").css('font-size', Util.StorageGetter('font_size') + 'px');
		$("#readArticle span").addClass('white-space-inline')
		$("#readArticle").css('line-height', Util.StorageGetter('line_height') + 'em');
		$("#readArticle p").css('line-height', Util.StorageGetter('line_height') + 'em');
		$("#readArticle").css('font-family', themeFonts[Util.StorageGetter('font_family')]);
		$("#readArticle p").css('font-family', themeFonts[Util.StorageGetter('font_family')]);
		$("#readArticle span").css('font-family', themeFonts[Util.StorageGetter('font_family')]);

		//		if(sessionStorage.getItem('black')){
		//			$(".reward_bbtn").css("background-color","#323536");
		//			$scope.theme_bg = {
		//				"background-color": "#323536"
		//			}
		//			$("#readArticle p").css({"background-color":"#323536","color":"#ffffff"});
		//			$("#readArticle span").css({"background-color":"#323536","color":"#ffffff"});
		//		}
	}

	$scope.innerHtml = function(content) {
			$("#readArticle").html(content);
			console.log(content)
			//初始化
			$scope.init();

			document.oncontextmenu = function() {
				return false;
			}
			document.onkeydown = function() {
				if(event.ctrlKey && window.event.keyCode == 67) {
					return false;
				}
			}
			document.body.oncopy = function() {
					return false;
				}
				//不建议连选中文本都不行
			document.onselectstart = function() {
					return false;
				}
				/**
				 * 
				 * 键盘左右按键事件
				 */
				setTimeout(document.onkeydown = function(event) {
				var e = event || window.event ;
				if(e && e.keyCode == 37) { // 按 left
					$scope.preNextFlag = false;
					$scope.preChapter();
				}
				if(e && e.keyCode == 39) { // 按 right 
					$scope.preNextFlag = true;
					$scope.nextChapter();
				}
			},2000)
			
		}
		//回退到书本页
	$scope.backToBook = function() {
		$window.location.href = "./book.html?book_id=" + _bookId;
	}

});
app.directive("backToTop", function() {
	return {
		restrict: "E",
		link: function(scope, element, attr) {
			var e = $(element);
			$(window).scroll(function() { //滚动时触发  
				if($(document).scrollTop() > 300) //获取滚动条到顶部的垂直高度,到相对顶部300px高度显示  
					e.fadeIn(300)
				else
					e.fadeOut(200);
			});
			/*点击回到顶部*/
			e.click(function() {
				$('html, body').animate({ //添加animate动画效果  
					scrollTop: 0
				}, 500);
			});
		}
	};
});
//字体变换样式
$("#changeFont dd").click(function() {
	$(".change_font").removeClass('active');
	$(this).addClass('active');
})

//点击样式变化
$("#screwList li").click(function() {
		if($(this).hasClass('active')) {
			$("#screwList li").removeClass('active');
			return;
		}
		$("#screwList li").removeClass('active');
		$(this).addClass('active');
	})
	//打赏金额
$("#pushpinList li").click(function() {
	if($(this).hasClass('active')) {
		$("#pushpinList li").removeClass('active');
		return;
	}
	$("#pushpinList li").removeClass('active');
	$(this).addClass('active');
})

//开始全屏
function kaishi() {
	var docElm = document.documentElement;
	//W3C   
	if(docElm.requestFullscreen) {
		docElm.requestFullscreen();
	}
	//FireFox   
	else if(docElm.mozRequestFullScreen) {
		docElm.mozRequestFullScreen();
	}
	//Chrome等   
	else if(docElm.webkitRequestFullScreen) {
		docElm.webkitRequestFullScreen();
	}
	//IE11   
	else if(elem.msRequestFullscreen) {
		elem.msRequestFullscreen();
	}

}
//开始关闭 
function guanbi() {

	if(document.exitFullscreen) {
		document.exitFullscreen();
	} else if(document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if(document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	} else if(document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}
//全屏事件监听 
document.addEventListener("fullscreenchange", function() {
	fullscreenState.innerHTML = (document.fullscreen) ? "" : "not ";
}, false);
document.addEventListener("mozfullscreenchange", function() {

	fullscreenState.innerHTML = (document.mozFullScreen) ? "" : "not ";
}, false);
document.addEventListener("webkitfullscreenchange", function() {

	fullscreenState.innerHTML = (document.webkitIsFullScreen) ? "" : "not ";
}, false);

document.addEventListener("msfullscreenchange", function() {

	fullscreenState.innerHTML = (document.msFullscreenElement) ? "" : "not ";
}, false);