var _isfivemiss = true; //设置5秒后评论的变量
app.controller("associationController", function($scope, $location, $window, $http, $anchorScroll) {
	var conList = $("#con_nav .nav_name");
	conList.removeClass('active');
	$(conList[3]).addClass('active');
	var themeType = 1;
	var title;
	var listType = "HOT";

	/**
	 * 设置图片显示为居中的部分 
	 * @param {Object} img
	 */
	$scope.setImgSize = function(img) {
		// 获取原图片大小，宽和高
		var screenImage = img;
		// Create new offscreen image to test
		var theImage = new Image();
		theImage.src = screenImage.attr("src");
		// Get accurate measurements from that.
		theImage.onload = function() {
			var imageWidth = theImage.width;
			var imageHeight = theImage.height;
			//			alert(imageWidth+" "+imageHeight)
			//第一种情况
			//原始图片的宽和高都比200x120大，并且宽大于高
			if(imageWidth > 200 && imageHeight > 125 && imageHeight <= imageWidth) {
				if(imageWidth > 750 || imageHeight > 600) {
					img.css({ "top": "-20%", "left": "-60%", "height": 120 + imageHeight * 0.2, "width": "auto" });
				} else if(imageWidth > 550 || imageHeight > 450){
					img.css({ "top": "-20%", "left": "-30%", "height": 120 + imageHeight * 0.2, "width": "auto" });
				} else if(imageWidth > 350 || imageHeight > 350){
					img.css({ "top": "-20%", "left": "-20%", "height": 120 + imageHeight * 0.2, "width": "auto" });
				} else {
					img.css({ "top": "-20%", "left": "0%", "height": 120 + imageHeight * 0.2, "width": "auto" });
				}
			} else if(imageWidth > 200 && imageHeight > 125 && imageHeight >= imageWidth) {
				img.css({ "top": "-50%", "left": "-20%", "height": "auto", "width": 200 + imageWidth * 0.2 });
			} else if(imageWidth < 200 && imageHeight > 125) {
				img.css({ "top": "-50%", "left": "0", "height": 120 + imageHeight * 0.5, "width": "auto", "margin-top": 0, "margin-bottom": 0, "margin-left": (200 - imageWidth) / 2 + 15, "margin-right": (200 - imageWidth) / 2 + 15 });
			} else if(imageWidth > 200 && imageHeight < 125) {
				img.css({ "top": "0", "left": "-50%", "height": "auto", "width": 200 + imageWidth * 0.5, "margin-top": (120 - imageHeight) / 2 + 5, "margin-bottom": (120 - imageHeight) / 2 + 5, "margin-left": 0, "margin-right": 0 });
			} else if(imageWidth < 200 && imageHeight < 125 && imageHeight <= imageWidth) {
				img.css({ "top": "0", "left": "-20%", "height": 120, "width": "auto" });
			} else if(imageWidth < 200 && imageHeight < 125 && imageHeight >= imageWidth) {
				img.css({ "top": "-20%", "left": "-20%", "height": "auto", "width": 200 });
			}
		}
	}

	// 配置分页基本参数
	$scope.paginationConf = {
		currentPage: 1,
		itemsPerPage: 20
	};
	$scope.changeImageSize = function(findex, index) {
		$scope.imgBigFlag = !$scope.imgBigFlag;
		if($scope.imgBigFlag) {
			$("#" + findex + "img" + index).height('auto');
			$("#" + findex + "img" + index).width('auto');
			$("#" + findex + "imgimg" + index).css({ "top": "0", "left": "0", "height": "auto", "width": "auto" });
		} else {
			$("#" + findex + "img" + index).height(123);
			$("#" + findex + "img" + index).width(200);
			$scope.setImgSize($("#" + findex + "imgimg" + index));
		}
	}

	$scope.init = function() {
		$("#postClass dd").click(function() {
			$("#postClass dd").removeClass('active');
			$(this).addClass('active');
		})
		$("#disTitle a").click(function() {
			$("#disTitle a").removeClass('active');
			$(this).addClass('active');
		})

		$('.emotion').qqFace({
			id: 'facebox',
			assign: 'textArea',
			path: 'qqFaceGif/' //表情存放的路径
		});
		


		//	 		var str = $("#saytext").val();
		//			$("#show").html(replace_em(str));
		//		 });
	}
	//初始化页面
	$scope.init();
	//请求海报数据	

	//最热门
	$scope.posterListHot = function(_type) {
		if(_type == 'html') {
			$scope.paginationConf.currentPage = 1;
			$scope.paginationConf.itemsPerPage = 20;
		}
		listType = 'HOT';
		$.ajax({
				type: "post",
				url: IP + '/adminPoster/posterList.do',
				async: true,
				data: {
					pageNum: $scope.paginationConf.currentPage,
					numPerPage: $scope.paginationConf.itemsPerPage,
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.postList = data.objectList;
						$scope.postTotal = data.total;
						$scope.paginationConf.totalItems = data.total;
					})
					for(var i = 0; i < $scope.postList.length; i++) {
						if($scope.postList[i].picList != null) {
							for(var j = 0; j < $scope.postList[i].picList.length; j++) {
								$scope.setImgSize($("#" + i + "imgimg" + j));
							}
						}
					}
				}
			})
	}
	$scope.posterListHot('html');
	//最新
	$scope.posterListNew = function(type) {
		if(type == 'html') {
			$scope.paginationConf.currentPage = 1;
			$scope.paginationConf.itemsPerPage = 20;
		}
		listType = 'NEW';
		$.ajax({
				type: "post",
				url: IP + '/adminPoster/newPoster.do',
				async: true,
				data: {
					pageNum: $scope.paginationConf.currentPage,
					numPerPage: $scope.paginationConf.itemsPerPage,
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.postList = data.objectList;
						$scope.postTotal = data.total;
						$scope.paginationConf.totalItems = data.total;
					})
					for(var i = 0; i < $scope.postList.length; i++) {
						if($scope.postList[i].picList != null) {
							for(var j = 0; j < $scope.postList[i].picList.length; j++) {
								$scope.setImgSize($("#" + i + "imgimg" + j));
							}
						}
					}
				}
			})

	}
	//精品帖
	$scope.fineList = function(type) {
		if(type == 'html') {
			$scope.paginationConf.currentPage = 1;
			$scope.paginationConf.itemsPerPage = 20;
		}
		listType = 'FINE';
		$.ajax({
				type: "post",
				url: IP + '/adminPoster/finePoster.do',
				async: true,
				data: {
					pageNum: $scope.paginationConf.currentPage,
					numPerPage: $scope.paginationConf.itemsPerPage,
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.postList = data.objectList;
						$scope.postTotal = data.total;
						$scope.paginationConf.totalItems = data.total;
					})
				}
			})
	}

	//搜索帖子内容
	$scope.serachContent = function() {
		$scope.paginationConf.currentPage = 1;
		$scope.paginationConf.itemsPerPage = 20;
		if(isNull($scope.serachBarContent)) {
			Toast("请先输入内容", 1000)
			return;
		}
		if(listType == 'FINE') {
			$scope.paginationConf.currentPage = 1;
			$scope.paginationConf.itemsPerPage = 20;
			$.ajax({
					type: "post",
					url: IP + '/adminPoster/finePoster.do',
					async: true,
					data: {
						pageNum: $scope.paginationConf.currentPage,
						numPerPage: $scope.paginationConf.itemsPerPage,
						title: $scope.serachBarContent
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						$scope.$apply(function() {
							$scope.postList = data.objectList;
							$scope.paginationConf.totalItems = data.total;
						})

					}
				})
		}
		if(listType == 'NEW') {
			$.ajax({
					type: "post",
					url: IP + '/adminPoster/newPoster.do',
					async: true,
					data: {
						pageNum: $scope.paginationConf.currentPage,
						numPerPage: $scope.paginationConf.itemsPerPage,
						title: $scope.serachBarContent
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						$scope.$apply(function() {
							$scope.postList = data.objectList;
							$scope.paginationConf.totalItems = data.total;
						})
					}
				})
		}
		if(listType == 'HOT') {
			$.ajax({
					type: "post",
					url: IP + '/adminPoster/posterList.do',
					async: true,
					data: {
						pageNum: $scope.paginationConf.currentPage,
						numPerPage: $scope.paginationConf.itemsPerPage,
						title: $scope.serachBarContent
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						$scope.$apply(function() {
							$scope.postList = data.objectList;
							$scope.paginationConf.totalItems = data.total;
						})
					}
				})
		}

	}
	//	serachContent serachContent

	/*上传贴子  */
	//上传图片
	var imgString = "";
	$("#associationImg").attr('action', IP + '/pic/upload.do');
	//发表帖子框上传图片
	var _imgnumber = 0;
	$('#associationImg').ajaxForm(function(data) {
		if(_imgnumber == 6) {
			return;
		}
		if(data.code == 1) {
			var book_img = data.fileId;
			imgString = imgString + book_img + ","
			var String = "<img src=" + data.message + ">";
			$("#img_first").after(String);
			_imgnumber++;
			if(_imgnumber == 6) {
				$("#img_first").remove();
			}
			$("#img_number").html(_imgnumber);

		} else {
			alert("封面大图片的上传服务器错啦")
		}
	});
	//选择类型
	$scope.themeType = 3;
	$scope.chooseType = function(type) {
		$scope.themeType = type;
	}
	//上传贴子
	$scope.insertPost = function() {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			return;
		}
		//
		if(isNull($scope.title, "请输入标题")) {
			return;
		}
		var nickNameString = getNickName($("#textArea").html());
		var str = $("#textArea").html();
		var content = str;
		$.ajax({
				type: "post",
				url: IP + '/adminPoster/insertPost.do',
				async: true,
				data: {
					themeContent: content,
					themePic: imgString,
					title: $scope.title,
					themeType: $scope.themeType,
					themeAutherId: userId,
					nickNameString: nickNameString
				}
			})
			.done(function(data) {

				if(data.flag == 1) {
					$window.location.reload();
				}
			})
	}
	//打开详情
	$scope.openDetail = function(id) {
		$window.location.href = "#/postDetail/" + id;
	}

	//帖子的举报
	var _reportId;
	$scope.fnReport = function() {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			return;
		}
		$scope.reportShow = !$scope.reportShow;
	}
	$scope.fnReportShow = function(id) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			return;
		}
		$scope.reportShow = !$scope.reportShow;
		$scope.reportID = id;
		_reportId = id;
	}
	//帖子的举报内容提交
	$scope.submitReport = function() {
		$.ajax({
				url: IP + '/common/insertReport.do',
				type: 'post',
				dataType: 'json',
				data: {
					userId: userId,
					content: $scope.handleContent,
					reportId: _reportId,
					reportType: 4

				},
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {　　
						$scope.fnReport();
					});
					$scope.handleContent = ""
					Toast("举报成功", 1000);
				}
			})
	}
	//发表帖子跳转
	$scope.anchorScroll = function() {
		$location.hash('book_comment')
		$anchorScroll();
	}
	//分页操作
	var reGetProducts = function() {
		if(listType == "HOT") {
			$scope.posterListHot('page')
		}
		if(listType == 'NEW') {
			$scope.posterListNew('page');
		}
		if(listType == 'FINE') {
			$scope.fineList('page');
		}
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage', reGetProducts);

})
/**
 * 输入数字限制  100字限制
 */
var textAreaNum = 0;

function OnInput(){
	var numb=$("#textArea").text().length;
	if(textAreaNum==0&&numb==16){
		numb=1;
	}
	textAreaNum++;
	$("#inputNumber").text(numb)
}

