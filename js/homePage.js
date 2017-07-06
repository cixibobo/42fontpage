var imgsider;
app.factory("bookCarouselCache", function($cacheFactory) {
	return $cacheFactory("bookCarousel");
})
var _carousel_first_img;
 var seconds=1;//间隔时间
 var IsOver=false;//鼠标是否覆盖div
 var IsCall=false;//是否满足2秒后触发事件
 var mouseId;//当前显示的id
app.controller('homePageController', ['$scope', '$location', '$window', '$http', '$timeout', '$routeParams', function($scope, $location, $window, $http, $timeout, $routeParams, bookCarouselCache) {
	//	银图钉,铜螺钉收益转换
	$scope.tenTimes = 10;
	var conList=	$("#con_nav .nav_name");
	conList.removeClass('active');
	$(conList[0]).addClass('active');
	var timeName = {
			'week': '周榜',
			'month': '月榜',
			'quarter': '季榜'
		}
		//获取推荐位书籍
	$.ajax({
			type: "post",
			url: IP + '/homePage/sliderPic.do',
			async: true,
			data: {
				numPerPage: 12
			}
		})
		.done(function(data) {
			if(data.flag == 1) {
				$scope.hotBook = data.objectList
			}
		})
		//获取轮播图
	$.ajax({
			type: "post",
			url: IP + '/homePage/bookCarousel.do',
			async: true,
			data: {
				imageLocation: 0
			}
		})
		.done(function(data, status, headers, config) {
			console.log(data)
			if(data.flag == 1) {
				$scope.$apply(function(){
					$scope.bannerList = data.objectList;
					imgsider=$scope.bannerList;
					var j=0;
					for(var i=0;i<imgsider.length;i++){
						imgsider[i].index=j;
						j++;
					}
					console.log(imgsider)
					//构造imgs数组对象
					if(data.objectList[0]){
						slider()
					}
				})
			
			}
		})

	//银图钉个人消费排行榜
	$.ajax({
			type: "post",
			url: IP + '/homePage/selectEveryDayBookBIncome.do',
			async: true,
			data: {
				type: 4,
				numPerPage: 12
			}
		})
		.done(function(data) {
			if(data.flag == 1) {
				$scope.silverPin = data.objectList
			}
		})
		//银图钉消费排行榜 周，月，季	
	$scope.yingTime = function(type) {
		$.ajax({
				type: "post",
				url: IP + '/homePage/queryBookByIncome.do',
				async: true,
				data: {
					'type': type,
					numPerPage: 9
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.silverMq = data.objectList
				}
			})
	}
	$scope.yingTime(2);
	//综合性排行榜	
	$.ajax({
			type: "post",
			url: IP + '/homePage/queryBookByClick.do',
			async: true,
			data: {
				dateType: 4,
				type: 4,
				numPerPage: 12
			}
		})
		.done(function(data) {
			if(data.flag == 1) {
				$scope.$apply(function() {
					$scope.complexAll = data.objectList
				})
			}
		})
		//综合消费排行榜 周，月，季
	$scope.complexTime = function(dateType) {
			$.ajax({
					type: "post",
					url: IP + '/homePage/queryBookByClick.do',
					async: true,
					data: {
						'dateType': dateType,
						numPerPage: 9
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						$scope.$apply(function() {
							$scope.complexBar = data.objectList
						})
					}
				})

		}
		//章节更新时间排行榜
	$.ajax({
			type: "post",
			url: IP + '/homePage/updateBookList.do',
			async: true,
			data: {
				dateType: 4,
				numPerPage: 12
			}
		})
		.done(function(data) {
			if(data.flag == 1) {
				$scope.chapterUpdate = data.objectList
			}
		})
		//章节更新时间高扬榜 周，月，季
	$scope.chapterUpdateTime = function(dateType) {
		$.ajax({
				type: "post",
				url: IP + '/homePage/updateBookList.do',
				async: true,
				data: {
					dateType: dateType,
					numPerPage: 9
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.chapterUpdateBar = data.objectList
					})
				}
			})
	}
	$scope.chapterUpdateTime(2);
	$scope.chapterUpdateTimeClick = function(time, type) {
		$scope.chapterupdate_list_time = timeName[time];
		$scope.chapterupdate_listshow = !$scope.chapterupdate_listshow;
		$scope.chapterUpdateTime(type);
	}

	//新书推荐位
	$.ajax({
			type: "post",
			url: IP + '/homePage/LatestBookList.do',
			async: true,
			data: {
				type: 4,
				numPerPage: 6
			}
		})
		.done(function(data) {
			if(data.flag == 1) {
				$scope.$apply(function() {
					$scope.newBook = data.objectList
				})
			}
		})
		//新书最后底图
		//新书最后图片位置
	$.ajax({
			type: "post",
			url: IP + '/homePage/bookCarousel.do',
			async: true,
			data: {
				imageLocation: 3
			}
		})
		.done(function(data) {
			if(data.flag == 1) {
				$scope.$apply(function() {
					if(data.objectList[0]) {
						_newLastUrl=data.objectList[0].url;
						$scope.newLastPic = data.objectList[0].imageUrl;
					}
				})
			}
		})
$scope.lastPic=function(){
	if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
			return;
		}
	window.location.href=_newLastUrl;
}
	$scope.silverTimeClick = function(time, type) {
		$scope.silver_pinshow_time = timeName[time];
		$scope.silver_pinshow = !$scope.silver_pinshow;
		$scope.yingTime(type)
	}

	$scope.complexTime(2);
	$scope.ComplexTimeClick = function(time, type) {
		$scope.complex_list_time = timeName[time];
		$scope.complex_listshow = !$scope.complex_listshow;
		$scope.complexTime(type);
	}
/*
 *更多跳转搜索
 */
	$scope.returnMore=function(type){
		window.location.href='./html/moreList/moreList.html?type='+type;
	}
	//大亨榜,周，月，季
	$scope.tycoonListTime = function(dateType) {
		$.ajax({
				type: "post",
				url: IP + '/homePage/selectTycoonList.do',
				async: true,
				data: {
					'dateType': dateType,
					numPerPage: 9
				}
			})
			.done(function(data) {
				console.log("大亨榜", data)
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.tycoonList = data.objectList
					})
				}
			})
	}
	$scope.tycoonListTime(2);
	$scope.tycoonTimeClick = function(time, type) {
		$scope.tycoon_list_time = timeName[time];
		$scope.tycoon_listshow = !$scope.tycoon_listshow;
		$scope.tycoonListTime(type);
	}

	/*大亨关注帖子作者弹窗*/
	//鼠标滑上显示
	$scope.followTyShow = function(id, index,tycoonlist) {
			if($("#tyContent"+index).children().length!=0){
				$("#tyContent"+index).remove();
			}
             console.log("大亨榜 id",id+"index "+index)
             var html=[];
             html.push("<div id='tyContent"+index+"' >");
             html.push("<div class='home-page_dis_follow'   ng-mouseleave='mouseLeaveTy("+index+")'>");
             html.push("<div class='clear'>");
             html.push("<img class='dis_follow_pic fl' src="+tycoonlist.headUrl+" />");
             html.push("<div class='dis_follow_info fl'>");
             html.push("<p class='key_writer_name'>"+tycoonlist.nickName+"</p>");
             html.push("<p><span class='my_follows'>关注:"+tycoonlist.follows+"</span>");
             if(index>2){
             	if(tycoonlist.sunIncome){
             		 html.push("<span class='my_follows'>银图钉:"+tycoonlist.sunIncome+"</span>");	
             	}
             	else{
             		 html.push("<span class='my_follows'>银图钉:"+0+"</span>");
             	}
             }
             html.push("<span class='follow_funs'>粉丝:"+tycoonlist.fans+"</span></p>");
             html.push("</div>");
             if(tycoonlist.signature){
             	 html.push("<div class='key_writer'>"+tycoonlist.signature+"</div>");
             }
            	else{
            		 html.push("<div class='key_writer'>"+""+"</div>");
            	}
             html.push("<div class='follow_btns isOnSelf' >");
             html.push("<span class='active position commentIsFans' onclick='addAttention("+tycoonlist.authorId+","+index+","+1+")'"+">+关注</span>");
             html.push("<span onclick='commentCancelFlows("+tycoonlist.authorId+","+1+")'"+"class='active position unCommentIsFans'>取消关注</span>");
             html.push("<span><p style='text-decoration: none;color: #F39800;' onclick='toSixin("+tycoonlist.authorId+")' >私信</p></span>");
			 html.push("</div></div>");
			var htmls=html.join("");
			$("#tyWindow"+index).append(htmls);
				$(".commentIsFans").hide();
				$(".unCommentIsFans").show();
				$(".isOnSelf").show();												
//		$scope.isOnSelf = true;
		$.ajax({
				type: "post",
				url: IP + "/userInfoDetail/queryUserInfoDetail.do",
				async: true,
				data: {
					id: id
				}
			})
			.done(function(data) {
				console.log("queryUserInfoDetail ",data)
				if(data.flag == 1) {
					if(!data.objectList[0]) {
						console.log("为空")
					}
					$scope.$apply(function() {
						$scope.queryIsFollow(id, index, 1)
						$scope.replyerDetail = data.objectList[0];
						console.log($scope.replyerDetail.accountId + " " + userId)
						if($scope.replyerDetail.accountId == userId) {
//							$scope.isOnSelf = false;
								$(".isOnSelf").hide();	
						}
						
					})
				}

			})
	}

	//加关注
	$scope.addAttention = function(id, positionId,i) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/userFollow/addFlows.do',
				type: 'post',
				dataType: 'json',
				data: {
					followId: userId,
					userId: id
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					if(data.objectList) {
						$scope.$apply(function() {
						if(i == 1) {
								$(".commentIsFans").hide();
								$(".unCommentIsFans").show();
//								
//								$scope['followTy' + positionId] = false;
							} else {
								$(".isFans").hide();
//								$scope['followCo' + positionId] = false;
							}
						})
						Toast("感谢关注", 1000);
					}
				}
			})
	}

	//取消关注comment in
	$scope.commentCancelFlows = function(id,i) {
		console.log(id + " " + userId)
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/userFollow/cancelFlows.do',
				type: 'post',
				dataType: 'json',
				data: {
					followId: userId,
					userId: id
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					if(data.objectList) {
						$scope.$apply(function() {
							if(i == 1) {
								$(".unCommentIsFans").toggle();
								$(".commentIsFans").toggle();
							} else {
								$(".isFans").toggle()
							}
						})
						Toast("取消关注", 1000);
					}
				}
			})
	}

	$scope.toSixin = function(id) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href=CurrentIp+'/html/LoginRegister/login.html'", 1000);
			return;
		}
		$window.open(CurrentIp+ '/html/messageCenter/personal.html?id=' + id);
	}

	//查询是否已关注作者
	$scope.queryIsFollow = function(_userId, positionId, i) {
		console.log("是否已经关注", _userId)
		if(_userId == userId) {
			if(i == 1) {
				$(".isOnSelf").hide();
				return;
			} else {
				$(".isSelf").hide();
				return;
			}
		} else {
			if(i == 1) {
				$(".isOnSelf").show();
			} else {
				$(".isSelf").show();
			}
		}
		$.ajax({
				type: "post",
				url: IP + '/userFollow/queryIsFollow.do',
				type: 'post',
				dataType: 'json',
				data: {
					followId: userId,
					userId: _userId
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					if(data.objectList == true) {
						$scope.$apply(function() {
							if(i == 1) {
								$(".commentIsFans").hide();	
								$(".unCommentIsFans").show();
							} else {
								$(".isFans").hide();
							}
						})
//						$("#" + positionId + ".position").html("已关注");
					} else {
						$scope.$apply(function() {
							if(i == 1) {
								$(".commentIsFans").show();
								$(".unCommentIsFans").hide();
							} else {
								$(".isFans").show();
							}
						})
//						$("#" + positionId + ".position").html("关注");
					}
				}
			})
	}

	//鼠标滑开隐藏
	$scope.mouseLeaveTy = function(index) {
		$("#tyContent"+index).remove();
//		IsOver=false;
//   if(IsCall)
////	    {
//	        $scope['followTy'+index] = false;
	        //两秒满足后要执行的代码
//	         alert("覆盖两秒离开后调用");
//	    }
//   	IsCall=false;
//		for(var i=0;i<10;i++){
//			 $scope['followTy'+i] = false;
//		}
	}

	//解囊榜,周，月，季
	$scope.userConsumptionTime = function(dateType) {
		$.ajax({
				type: "post",
				url: IP + '/homePage/selectSolutionCapsuleList.do',
				async: true,
				data: {
					'dateType': dateType,
					numPerPage: 9
				}
			})
			.done(function(data) {
				$scope.$apply(function() {
					$scope.consumptionList = data.objectList
				})
			})
	}
	$scope.userConsumptionTime(2);
	$scope.consumptionTimeClick = function(time, type) {
			$scope.user_consumption_time = timeName[time];
			$scope.user_consumptionshow = !$scope.user_consumptionshow;
			$scope.suserConsumptionTime(type);
		}
		/*解囊关注帖子作者弹窗*/
		//鼠标滑上显示
	$scope.followCoShow = function(id, index,tycoonlist) {
		if($("#CoContent"+index).children().length!=0){
				$("#CoContent"+index).remove();
			}
             console.log("大亨榜 id",id+"index "+index)
             var html=[];
             html.push("<div id='CoContent"+index+"' >");
             html.push("<div class='home-page_dis_follow'   ng-mouseleave='mouseLeaveTy("+index+")'>");
             html.push("<div class='clear'>");
             html.push("<img class='dis_follow_pic fl' src="+tycoonlist.headUrl+" />");
             html.push("<div class='dis_follow_info fl'>");
             html.push("<p class='key_writer_name'>"+tycoonlist.nickName+"</p>");
             html.push("<p><span class='my_follows'>关注:"+tycoonlist.follows+"</span>");
             if(index>2){
             	if(tycoonlist.sunIncome){
             		 html.push("<span class='my_follows'>银图钉:"+tycoonlist.sunIncome+"</span>");	
             	}
             	else{
             		 html.push("<span class='my_follows'>银图钉:"+0+"</span>");
             	}
             }
             html.push("<span class='follow_funs'>粉丝:"+tycoonlist.fans+"</span></p>");
             html.push("</div>");
             if(tycoonlist.signature){
             	 html.push("<div class='key_writer'>"+tycoonlist.signature+"</div>");
             }
            	else{
            		 html.push("<div class='key_writer'>"+""+"</div>");
            	}
             html.push("<div class='follow_btns isOnSelf' >");
             html.push("<span class='active position commentIsFans' onclick='addAttention("+tycoonlist.authorId+","+index+","+1+")'"+">+关注</span>");
             html.push("<span onclick='commentCancelFlows("+tycoonlist.authorId+","+1+")'"+"class='active position unCommentIsFans'>取消关注</span>");
             html.push("<span><p style='text-decoration: none;color: #F39800;' onclick='toSixin("+tycoonlist.authorId+")' >私信</p></span>");
			 html.push("</div></div>");
			var htmls=html.join("");
			$("#CoWindow"+index).append(htmls);
				$(".commentIsFans").hide();
				$(".unCommentIsFans").show();
				$(".isOnSelf").show();												

			$.ajax({
					type: "post",
					url: IP + "/userInfoDetail/queryUserInfoDetail.do",
					async: true,
					data: {
						id: id
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						if(!data.objectList[0]) {
							console.log("为空")
						}
						$scope.$apply(function() {
							$scope.queryIsFollow(id, index, 1)
							$scope.replyerDetail = data.objectList[0];
							console.log($scope.replyerDetail.accountId + " " + userId)
							if($scope.replyerDetail.accountId == userId) {
//								$scope.isSelf = false;
								$(".isOnSelf").hide();
							}
//							$scope['followCo' + index] = true;
						})
					}

				})
		}
		//鼠标滑开隐藏
	$scope.mouseLeaveCo = function(index) {
			$("#CoContent"+index).remove(); 
		}
		//收藏榜,周，月，季
	$scope.collectionTime = function(dateType) {
		$.ajax({
				type: "post",
				url: IP + '/homePage/queryBookByClick.do',
				async: true,
				data: {
					'dateType': dateType,
					'type': 2,
					numPerPage: 9
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.collectionList = data.objectList
					})
				}
			})
	}
	$scope.collectionTime(2);
	$scope.collectionTimeClick = function(time, type) {
			$scope.collection_list_time = timeName[time];
			$scope.collection_listshow = !$scope.collection_listshow;
			$scope.collectionTime(type);
		}
		//点击榜,周，月，季
	$scope.checkBarTime = function(dateType) {
		$.ajax({
				type: "post",
				url: IP + '/homePage/queryBookByClick.do',
				async: true,
				data: {
					'dateType': dateType,
					'type': 0,
					numPerPage: 9
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.checkBarList = data.objectList
					})
				}
			})

	}
	$scope.checkBarTime(2);
	$scope.checkBarTimeClick = function(time, type) {
		$scope.check_bar_list_time = timeName[time];
		$scope.check_bar_listshow = !$scope.check_bar_listshow;
		$scope.checkBarTime(type);
	}

	//点赞榜,周，月，季
	$scope.likeListTime = function(dateType) {
		$.ajax({
				type: "post",
				url: IP + '/homePage/queryBookByClick.do',
				async: true,
				data: {
					'dateType': dateType,
					'type': 1,
					numPerPage: 9
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.likeList = data.objectList
					})
				}
			})
	}
	$scope.likeListTime(2);
	$scope.likeListTimeClick = function(time, type) {
			$scope.like_list_time = timeName[time];
			$scope.like_listshow = !$scope.like_listshow;
			$scope.likeListTime(type);
		}
		//打开新窗口
	$scope.openWin = function(book_id) {
		//		$window.location.href="./html/book.html" + '?book_id=' + book_id;
		window.open("./html/book.html" + '?book_id=' + book_id);
	}

}]);

//ng-repeat的结束时间指令设计 轮播图
app.directive('repeatFinish', function() {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {
				//				$("#banner  li:first-child").addClass('on');
				
				$(".slideInner").slide({
					slideContainer: $('.slideInner a'),
					effect: 'easeOutCirc',
					autoRunTime: 1000,
					slideSpeed: 3000,
					nav: true,
					autoRun: true,
					prevBtn: $('a.prev'),
					nextBtn: $('a.next')
				});
				
			}
		}
	}
})

//ng-repeat的结束时间指令设计 银推荐书本
app.directive('silverFinish', function() {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {
				if(scope.$last == true) {
					$('.recommend_book_li').on('mouseenter', function() {
						$(this).find('.silverinfo_list').show();
						$(this).find('.recommend_book_writer').animate({
							width: "30px",
							height: "30px"
						}, 500)
						$(this).find('.test1').animate({
							left: '10px',
							top: '45px'
						}, 150)
						$(this).find('.test2').animate({
							top: '65px'
						}, 300)
						$(this).find('.test3').animate({
							top: '85px'
						}, 450)
						$(this).find('.test4').animate({
							top: '105px'
						}, 600)
						$(this).find('.test5').animate({
							top: '125px'
						}, 750)
					});
					$('.recommend_book_li').on('mouseleave', function() {
						$(this).find('.silverinfo_list').hide();
						$(this).find('.recommend_book_writer').animate({
							width: "15px",
							height: "15px"
						}, 1)
						$(this).find('.silverinfo_list p').not('.silverinfo_writer').animate({
							left: "10px",
							top: "-30px"
						}, 1)
					});
				}
			}
		}
	}
})

app.directive('complexFinish', function() {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {
				if(scope.$last == true) {
					$('#complex .recommend_book_li').on('mouseenter', function() {
						$(this).find('.silverinfo_list').show();
						$(this).find('.recommend_book_writer').animate({
							width: "30px",
							height: "30px"
						}, 500)
						$(this).find('.test1').animate({
							left: '10px',
							top: '45px'
						}, 150)
						$(this).find('.test2').animate({
							top: '65px'
						}, 300)
						$(this).find('.test3').animate({
							top: '85px'
						}, 450)
						$(this).find('.test4').animate({
							top: '105px'
						}, 600)
						$(this).find('.test5').animate({
							top: '125px'
						}, 750)
					});
					$('#complex .recommend_book_li').on('mouseleave', function() {
						$(this).find('.silverinfo_list').hide();
						$(this).find('.recommend_book_writer').animate({
							width: "15px",
							height: "15px"
						}, 1)
						$(this).find('.silverinfo_list p').not('.silverinfo_writer').animate({
							left: "10px",
							top: "-30px"
						}, 1)
					});
				}
			}
		}
	}

})
app.directive('chapterupdateFinish', function() {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {
				if(scope.$last == true) {
					$('#chapterupdate .recommend_book_li').on('mouseenter', function() {
						$(this).find('.silverinfo_list').show();
						$(this).find('.recommend_book_writer').animate({
							width: "30px",
							height: "30px"
						}, 500)
						$(this).find('.test1').animate({
							left: '10px',
							top: '45px'
						}, 150)
						$(this).find('.test2').animate({
							top: '65px'
						}, 300)
						$(this).find('.test3').animate({
							top: '85px'
						}, 450)
						$(this).find('.test4').animate({
							top: '105px'
						}, 600)
						$(this).find('.test5').animate({
							top: '125px'
						}, 750)
					});
					$('#chapterupdate .recommend_book_li').on('mouseleave', function() {
						$(this).find('.silverinfo_list').hide();
						$(this).find('.recommend_book_writer').animate({
							width: "15px",
							height: "15px"
						}, 1)
						$(this).find('.silverinfo_list p').not('.silverinfo_writer').animate({
							left: "10px",
							top: "-30px"
						}, 1)
					});
				}
			}
		}
	}
})
app.directive('newFinish', function() {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {
				if(scope.$last == true) {
					$('#newbook .recommend_book_li').on('mouseenter', function() {
						$(this).find('.silverinfo_list').show();
						$(this).find('.recommend_book_writer').animate({
							width: "30px",
							height: "30px"
						}, 500)
						$(this).find('.test1').animate({
							left: '10px',
							top: '45px'
						}, 150)
						$(this).find('.test2').animate({
							top: '65px'
						}, 300)
						$(this).find('.test3').animate({
							top: '85px'
						}, 450)
						$(this).find('.test4').animate({
							top: '105px'
						}, 600)
						$(this).find('.test5').animate({
							top: '125px'
						}, 750)
					});
					$('#newbook .recommend_book_li').on('mouseleave', function() {
						$(this).find('.silverinfo_list').hide();
						$(this).find('.recommend_book_writer').animate({
							width: "15px",
							height: "15px"
						}, 1)
						$(this).find('.silverinfo_list p').not('.silverinfo_writer').animate({
							left: "10px",
							top: "-30px"
						}, 1)
					});
				}
			}
		}
	}
})
app.directive('hotFinish', function() {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {
				if(scope.$last == true) {
					$('#hotbook .hot_book_li').on('mouseenter', function() {
						$(this).find('.hotinfo_list').show();
						$(this).find('.hot_book_bookname').hide();
						$(this).find('.test1').animate({
							//							left: '10px',
							top: '5px',
						}, 150)
						$(this).find('.test2').animate({
							top: '25px'
						}, 300)
						$(this).find('.test3').animate({
							top: '45px'
						}, 450)
						$(this).find('.test4').animate({
							top: '65px'
						}, 600)
					});
					$('#hotbook .hot_book_li').on('mouseleave', function() {
						$(this).find('.hotinfo_list').hide();
						$(this).find('.hot_book_bookname').show();
						$(this).find('.hotinfo_list p').animate({
							left: "0px",
							top: "-10px",
						}, 1)
					});
				}
			}
		}
	}
})

app.directive('onFinishRender', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			if(scope.$last === true) {
				element.ready(function() {
					$("#r_img").remove();
				});
			}
		}
	}
})
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
/**
 * 关注，取消关注，私信更改方法
 */
//加关注
	function addAttention(id, positionId,i) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/userFollow/addFlows.do',
				type: 'post',
				dataType: 'json',
				data: {
					followId: userId,
					userId: id
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					if(data.objectList) {
						if(i == 1) {
								$(".commentIsFans").hide();
								$(".unCommentIsFans").show();
//								$scope['followTy' + positionId] = false;
							} else {
								$(".isFans").hide();
//								$scope['followCo' + positionId] = false;
							}
						Toast("感谢关注", 1000);
					}
				}
			})
	}
	//私信
	function toSixin(id){
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href=CurrentIp+'/html/LoginRegister/login.html'", 1000);
			return;
		}
		window.open(CurrentIp+'/html/messageCenter/personal.html?id=' + id);
	}
	//取消关注
	function commentCancelFlows(id,i) {
		console.log(id + " " + userId)
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
			return;
		}
		$.ajax({
				type: "post",
				url: IP + '/userFollow/cancelFlows.do',
				type: 'post',
				dataType: 'json',
				data: {
					followId: userId,
					userId: id
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					if(data.objectList) {
						
							if(i == 1) {
								$(".unCommentIsFans").hide();
								$(".commentIsFans").show();
							} else {
								$(".isFans").show()
							}
						Toast("取消关注", 1000);
					}
				}
			})
	}
