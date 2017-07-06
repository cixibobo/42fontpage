var app = angular.module("footerDetailApp", []);
app.controller("footerDetailC", ["$scope", "$http", function($scope, $http, $window, $location) {
	if(!isLogin()) {
		$scope.islogin = false;
	} else {
		$scope.islogin = true;
		$scope.headUrl = userInfo.headUrl;
	}

	$scope.changFrameTop1 = function(frame_src) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='../html/LoginRegister/login.html'", 1000);
			return;
		}
		window.open("../html/personCenter/sildebar.html?needUrl=" + frame_src, "_self");
	}

	if(localStorage.userInfo) {
		$scope.person_info = true;
		$.ajax({
				type: "post",
				url: IP + '/userMoney/queryMoney.do',
				async: true,
				data: {
					id: userId
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.personCenter = data.objectList[0];
					})
				}
			})
	}
	//系统消息
	$scope.searchMessage = function() {
		$.ajax({
				type: "post",
				url: IP + "/sysUserMessage/queryMessageCount.do",
				async: true,
				data: {
					userId: userId,
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						if(sessionStorage.getItem("sixinInfoNum")) {
							sixinInfoNum = parseInt(sessionStorage.getItem("sixinInfoNum"));
						}
						$scope.message_total = data.total + sixinInfoNum;
						$scope.message = data.objectList;
						$scope.message[4] = sixinInfoNum;
						if(data.total == 0 && sixinInfoNum == 0) {
							$scope.message_zero = false;
						} else {
							$scope.message_zero = true;
						}
					})
				} else {
					console.log('消息系统异常', data.flag)
				}
			})
	}

	//动态
	$scope.searchDynamic = function() {
		$scope.dynamicListShow = true;
		$.ajax({
				type: "post",
				url: IP + "/history/queryDynamicRecordList.do",
				async: true,
				data: {
					userId: userId,
					type: 1,
					pageNum: 1,
					numPerPage: 4
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.dyMessage = data.objectList;
						$scope.moreDongtai2 = false;
						$scope.moreDongtai3 = false;
						$scope.moreDongtai1 = false;
						if($scope.dyMessage == null || $scope.dyMessage.length == 0) {
							$scope.moreDongtai2 = true;
						} else if($scope.dyMessage.length <= 5) {
							$scope.moreDongtai3 = true;
						} else {
							$scope.moreDongtai1 = true;
						}
						console.log($scope.moreDongtai3)
					})
				} else {
					console.log('消息系统异常', data.flag)
				}
			})
	}

	$scope.signOut = function() {
		localStorage.removeItem('userInfo')
		setTimeout("window.location.href='../html/LoginRegister/login.html'", 10);
	}

	//收藏
	$scope.searchCollection = function() {
		$scope.collectListShow = true
		$.ajax({
				type: "post",
				url: IP + "/userBookShelf/queryCollection.do",
				async: true,
				data: {
					id: userId,
					pageNum: 1,
					numPerPage: 5
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.collectMesList = data.objectList;
					})
				} else {
					console.log('消息系统异常', data.flag)
				}
			})
	}
	//历史
	$scope.searchHistory = function() {
		$scope.historyListShow = true
		$.ajax({
				type: "post",
				url: IP + "/history/queryPersonHistory.do",
				async: true,
				data: {
					userId: userId,
					type: 2,
					pageNum: 1,
					numPerPage: 5
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.historyList = data.objectList;
					})
				} else {
					console.log('消息系统异常', data.flag)
				}
			})
	}
	$scope.searchMessage(); //系统消息
	//页面跳转选择
	$scope.returnToWin = function(url) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='../html/LoginRegister/login.html'", 1000);
			return;
		}
		window.open("../html/personCenter/" + url + ".html")
	}
	/**
	 * 导航部分跳转
	 * @param {Object} index
	 */
	$scope.jumpIndex = function(index) {
		switch(index) {
			case 1:
				window.open("../index.html#/homePage");
				break;
			case 2:
				window.open("../index.html#/classify");
				break;
			case 3:
				window.open("../index.html#/stapleHall");
				break;
			case 4:
				window.open("../index.html#/association");
				break;
		}
	}
	$.ajax({
			type: "post",
			url: IP + '/homePage/bookCarousel.do',
			async: true,
			data: {
				imageLocation: 4
			}
		})
		.done(function(data, status, headers, config) {
			if(data.flag == 1) {
				if(data.objectList[0]) {
					$scope.backgroudImg = {
						'background-image': 'url(' + data.objectList[0].imageUrl + ')'
					}
				}
			}
		})
	$scope.loginShow = true;
	$scope.person_info = false;
	if(localStorage.userInfo) {
		$scope.loginShow = false;
		$scope.person_info = true;
		$.ajax({
				type: "post",
				url: IP + '/userMoney/queryMoney.do',
				async: true,
				data: {
					id: userId
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.personCenter = data.objectList[0];
					})
				}
			})
	}
	//-----------------------导航条－－－－－－－－－－－－－－－－－－
	//系统消息
	$scope.searchMessage = function() {
		$.ajax({
				type: "post",
				url: IP + "/sysUserMessage/queryMessageCount.do",
				async: true,
				data: {
					userId: userId,
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						if(data.total == 0) {
							$scope.message_zero = false;
						} else {
							$scope.message_zero = true;
						}
						$scope.message_total = data.total;
						$scope.message = data.objectList;
					})
				} else {
					console.log('消息系统异常', data.flag)
				}
			})
	}
	//动态
	$scope.searchDynamic = function() {
		$scope.dynamicListShow = true;
		$.ajax({
				type: "post",
				url: IP + "/history/queryDynamicRecordList.do",
				async: true,
				data: {
					userId: userId,
					type: 1,
					pageNum: 1,
					numPerPage: 4
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.dyMessage = data.objectList;
						$scope.moreDongtai2 = false;
						$scope.moreDongtai3 = false;
						$scope.moreDongtai1 = false;
						if($scope.dyMessage.length == 0) {
							$scope.moreDongtai2 = true;
						} else if($scope.dyMessage.length <= 5) {
							$scope.moreDongtai3 = true;
						} else {
							$scope.moreDongtai1 = true;
						}
					})
				} else {
					console.log('消息系统异常', data.flag)
				}
			})
	}
	//收藏
	$scope.searchCollection = function() {
		$scope.collectListShow = true
		$.ajax({
				type: "post",
				url: IP + "/userBookShelf/queryCollection.do",
				async: true,
				data: {
					id: userId,
					pageNum: 1,
					numPerPage: 5
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.collectMesList = data.objectList;
					})
				} else {
					console.log('消息系统异常', data.flag)
				}
			})
	}
	//历史
	$scope.searchHistory = function() {
		$scope.historyListShow = true
		$.ajax({
				type: "post",
				url: IP + "/history/queryPersonHistory.do",
				async: true,
				data: {
					userId: userId,
					type: 2,
					pageNum: 1,
					numPerPage: 5
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.historyList = data.objectList;
					})
				} else {
					console.log('消息系统异常', data.flag)
				}
			})
	}
	$scope.searchMessage(); //系统消息
	//		$scope.searchDynamic();	//动态
	//－－－－－－－－－－－－－－end of 导航条－－－－－－－－－－－－－

	//页面跳转选择
	$scope.returnToWin = function(url) {
		if(isLogin()) {
			window.location.href = "./" + url + ".html";
			return;
		}
		Toast("请先登陆", 1000)
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
	}
	//退出账户
	$scope.signOut = function() {
		localStorage.removeItem('userInfo')
		setCookie("previousURL", location.href);
		window.location.href = "./LoginRegister/login.html";
	}
	/**
	 *搜索 
	 */
	//搜索内容

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

	$('#search').bind('keypress', function(event) {
		if(event.keyCode == "13") {
			//需要处理的事情
			var _classType = $scope.selectedCode;
			var search = {
				searchValue: $('#search').val()
			}
			var searchJson = JSON.stringify(search)
			var hrefsrc = window.location;
			var substr = "classify";
			sessionStorage.Search = searchJson;
			if((hrefsrc + "").indexOf(substr) >= 0) {
				window.location.reload();
			} else {
				window.location.href = "../index.html#/classify";
			}
		}
	});
	//选择类型
	//确认搜索
	$scope.searchClass = function() {
		var search = {
			searchValue: $('#search').val()
		}
		var searchJson = JSON.stringify(search)
		var hrefsrc = window.location;
		var substr = "classify";
		sessionStorage.Search = searchJson;
		if((hrefsrc + "").indexOf(substr) >= 0) {
			window.location.reload();
		} else {
			window.location.href = "../index.html#/classify";
		}
	}

	/**
	 * 此变量为左边菜单关于栏，若有需求，可动态请求
	 * 下标从1开始
	 */
	$scope.LeftNavAbout = [{
		li: "关于我们",
		index: 1
	}, {
		li: "联系我们",
		index: 2
	}, {
		li: "加入我们",
		index: 3
	}, {
		li: "公司信息",
		index: 4
	}, {
		li: "免责声明",
		index: 5
	}]

	/**
	 * 此变量为左边菜单投稿栏，若有需求，可动态请求
	 * 下标从1开始
	 */
	$scope.LeftNavTou = [{
		li: "签约制度",
		index: 1
	}, {
		li: "签约流程",
		index: 2
	}, {
		li: "创作之路",
		index: 3
	}, {
		li: "作者福利",
		index: 4
	}, {
		li: "投稿须知",
		index: 5
	}]

	/**
	 * 跳转到某一个具体的菜单
	 * @param {Object} index
	 * @param {Object} flag
	 * 	此参数为1，表示关于菜单栏
	 * 此参数为2，表示投稿菜单栏
	 */
	$scope.toLink = function(index, flag) {
		$scope.selected1 = 0;
		$scope.selected2 = 0;
		var i = index - 1;
		switch(flag) {
			case 1:
				$scope.selected1 = index;
				/**
				 * 若已经请求过数据，则将数据保存在变量中
				 * 否则，请求数据
				 */
				//				if($scope.contentInfo[i] != undefined) {
				//					$scope.contentInfoSign=$scope.contentInfo[i];
				//				} else {
				//					$scope.queryAboutData(index,1);
				//				}
				break;
			case 2:
				$scope.selected2 = index;
				i = i + $scope.LeftNavAbout.length;
				/**
				 * 若已经请求过数据，则将数据保存在变量中
				 * 否则，请求数据
				 */
				//				if($scope.contentInfo[i] != undefined) {
				//					var div=document.getElementById("content_info_id");
				//					var p = document.createElement("p");
				//					p.innerText=
				//					$scope.contentInfoSign=$scope.contentInfo[i];
				//				} else {
				//					$scope.queryAboutData(index,2);
				//				}
				break;
			default:
				break;
		}
		var div = document.getElementById("content_info_id");
		$("#content_info_id").empty();
		switch(i) {
			case 0:
				var p = document.createElement("p");
				p.innerHTML = "&nbsp;&nbsp&nbsp;&nbsp2016年八月成立的杭州漫国网络科技有限公司，是由一群热爱ACG文化的人组建而成。旗下的产品42文库，则是一个小说原创平台。为了打造更优质的文化内容，我们不断推陈出新以求更好的发展。"
				div.appendChild(p);
				$scope.titleContent = "关于我们";
				break;
			case 1:
				var p = document.createElement("p");
				p.innerHTML = "联系QQ：2806882566<br><br>联系邮箱：2806882566@qq.com<br><br>联系电话：0571-83537758<br><br>商务联系电话：15867526600<br><br>官方群：579448082<br><br>联系地址：杭州市 萧山区 民和路479号 国泰科技大厦 二单元 六楼 603室"
				div.appendChild(p);
				$scope.titleContent = "联系我们";
				break;
			case 2:
				var p = document.createElement("p");
				p.innerHTML = "如果想到之后42文库的工作环境，和更多趣事，欢迎联系我们~"
				div.appendChild(p);
				$scope.titleContent = "加入我们";
				break;
			case 3:
				var p = document.createElement("p");
				p.innerHTML = "&nbsp;&nbsp&nbsp;&nbsp2016年八月成立的杭州漫国网络科技有限公司，是由一群热爱ACG文化的人组建而成。旗下的产品42文库，则是一个小说原创平台。为了打造更优质的文化内容，我们不断推陈出新以求更好的发展。"
				div.appendChild(p);
				$scope.titleContent = "公司信息";
				break;
			case 4:
				var p = document.createElement("p");
				p.innerHTML = "&nbsp;&nbsp&nbsp;&nbsp;本应用提供的所有资料，均为网友私人收藏性质，未经原版权作者许可，任何人不得擅作它用！请在下载24小时内删除！为尊重作者版权，请购买原版作品，支持你喜欢的作者，谢谢！<br><br>&nbsp;&nbsp&nbsp;&nbsp本应用收录的各类资料，均为网友从网上搜集分享而来，其版权均归原作者及其网站所有，本应用虽力求保存原有的版权信息，但因很多资料经过多次转摘，已无法确定其真实来源，或者已将原有信息丢失，所以敬请原作者原谅。如果您对本站所载作品版权的归属存有异议，请立即通知我们，我们将在第一时间予以删除，同时向你表示歉意！<br><br>&nbsp;&nbsp&nbsp;&nbsp本应用仅转载网上已存在的资料，很难对这些资料的可用性，准确性或可靠性作出任何承诺与保证。不论何种情形，本应用都不对任何由于使用或无法使用本站提供的资料所造成的直接的和间接的损失负任何责任。"
				div.appendChild(p);
				$scope.titleContent = "免责声明";
				break;
			case 5:
				var p = document.createElement("p");
				p.innerHTML = "&nbsp;&nbsp&nbsp;&nbsp;签约需要在网站成为白金书籍。升降由编辑部的评语与投票综合评定来决定，并且由编辑部进行审核，不以人气为标准。<br><br>&nbsp;&nbsp&nbsp;&nbsp;会按照正常的用工合同工序和作者亲自线下洽谈。"
				div.appendChild(p);
				$scope.titleContent = "签约制度";
				break;
			case 6:
				var p = document.createElement("p");
				p.innerHTML = "&nbsp;&nbsp&nbsp;&nbsp;签约具体流程会在后续版本公布~"
				div.appendChild(p);
				$scope.titleContent = "签约流程";
				break;
			case 7:
				var p = document.createElement("p");
				p.innerHTML = "&nbsp;&nbsp&nbsp;&nbsp;点击首页投稿按钮，进入\“创作中心\”，填写书籍信息便可创建自己的书籍了。除此之外，并无太多可教给作者的了。<br><br>&nbsp;&nbsp&nbsp;&nbsp;至于创作的心态，我想就好好参读这段古文，以后自勉吧。<br><br>&nbsp;&nbsp&nbsp;&nbsp;夫道、德、仁、义、礼五者，一体也。<br><br>&nbsp;&nbsp&nbsp;&nbsp;道者，人之所蹈，使万物不知其所由。<br><br>&nbsp;&nbsp&nbsp;&nbsp;德者，人之所得，使万物各得其所欲。<br><br>&nbsp;&nbsp&nbsp;&nbsp;仁者，人之所亲，有慈慧恻隐之心，以遂其生存。<br><br>&nbsp;&nbsp&nbsp;&nbsp;义者，人之所宜，赏善罚恶，以立功立事。<br><br>&nbsp;&nbsp&nbsp;&nbsp;礼者，人之所履，夙兴夜寐，以成人伦之序。<br><br>&nbsp;&nbsp&nbsp;&nbsp;夫欲为人之本，不可无一焉。<br><br>&nbsp;&nbsp&nbsp;&nbsp;贤人君子，明于盛衰之道，通乎成败之数，审乎治乱之势，达乎去就之理。故潜居抱道以待其时。<br><br>&nbsp;&nbsp&nbsp;&nbsp;若时至而行，则能极人臣之位；<br><br>&nbsp;&nbsp&nbsp;&nbsp;得机而动，则能成绝代之功。如其不遇，没身而已。<br><br>&nbsp;&nbsp&nbsp;&nbsp;是以其道足高，而名重于后代。<br><br>&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;——《素书•原始章》"
				div.appendChild(p);
				$scope.titleContent = "创作之路";
				break;
			case 8:
				var p = document.createElement("p");
				p.innerHTML = "&nbsp;&nbsp&nbsp;&nbsp;1.定价权，网站会免去签约上架流程，直接将章节定价的权限交还给作者。<br><br>&nbsp;&nbsp&nbsp;&nbsp;2.收入分成的进一步让利。网站书籍分为四个等级，普通、驻站、白金、钻石（签约）。四个等级下，作者可得到的收入分成分别为60%、70%、80%、90%。除此之外，打赏收入所有等级一律按照70%给到作者。<br><br>&nbsp;&nbsp&nbsp;&nbsp;以上，为网站初始版本的基本福利也是42文库立站的基石。这些政策的精神永远不会废弃，只要在站内写书书籍的定价权，永远都在作者自己手中。&nbsp;&nbsp&nbsp;&nbsp;"
				div.appendChild(p);
				$scope.titleContent = "作者福利";
				break;
			case 9:
				var p = document.createElement("p");
				p.innerHTML = "&nbsp;&nbsp&nbsp;&nbsp;本站欢迎一切热爱故事之同好，前来投稿。<br><br>&nbsp;&nbsp&nbsp;&nbsp;现今各类小说网站兴起，各有千秋，书籍琳琅满目。无论观者，写者均在疯狂增长。无论网站或作者境遇好坏，进取之决心才是根本。<br><br>&nbsp;&nbsp&nbsp;&nbsp;作者明白的越来越多，书籍越来越多，处理创作者、作品和网站之间的关系只会更加难不会更加简单。在聪明的创作者面前，用老套的方法去处置，无论从商业还是研究的角度都无法长久立足。<br><br>&nbsp;&nbsp&nbsp;&nbsp;不断思考创作者、作品和网站三者的关系，在复杂的局势面前做到心中有数，才不会轻易失败。这不仅是做网站，也是一场修行。<br><br>&nbsp;&nbsp&nbsp;&nbsp;至此，42文库终于开放了。<br><br>&nbsp;&nbsp&nbsp;&nbsp;在经历了几个月，从简单构想到纸上谈兵再到技术开发最后完善细节的交战，这个42文库终于开放了。<br><br>&nbsp;&nbsp&nbsp;&nbsp;以文库为名，是希望它能像上世纪初的文库一样能推出更适合时代未来的技术应用产品。更方便更有效率的提供故事产品，不仅是我们的志向也是我们的行动。就像我欣赏的绝不是一两本小说，而是西方印刷技术本身一样。<br><br>&nbsp;&nbsp&nbsp;&nbsp;至此，我向各位宣布——<br><br>&nbsp;&nbsp&nbsp;&nbsp;为提现对创作者的尊重，本站决定将作品的自主定价权利交付给作者。作者不需要与本网站签约，书籍的定价权利将是网站免费提供给作者的基本功能。<br><br>&nbsp;&nbsp&nbsp;&nbsp;只要投书，作者本人即可对作品进行定价赚取赢得的收入。<br><br>&nbsp;&nbsp&nbsp;&nbsp;网站不会将回收创作者小说版权，作为网站运作的基础工作。而是将中心放在网站经济制度的建设和对作者更好的指导，提高创作者水平以便进步。用心写作，尊重他人，我们将给予最大限度的支持。<br><br>&nbsp;&nbsp&nbsp;&nbsp;42文库所给予的，是你们本就该有的。<br><br>&nbsp;&nbsp&nbsp;&nbsp;42文库所希望的，是大家一起争取的。<br><br>&nbsp;&nbsp&nbsp;&nbsp;"
				div.appendChild(p);
				$scope.titleContent = "投稿须知";
				break;
			default:
				break;
		}
	}

	/**
	 * 请求相应条目的数据
	 * @param {Object} index
	 * @param {Object} flag
	 */
	$scope.queryAboutData = function(index, flag) {
		var varFlag;
		switch(flag) {
			case 1:
				varFlag = index;
				break;
			case 2:
				varFlag = index + $scope.LeftNavAbout.length;
				break;
			default:
				varFlag = 0;
				break;
		}
		//请求数据
		$.ajax({
			type: "post",
			url: "",
			async: true,
			data: {

			}
		}).done(function(data) {
			$scope.contentInfo[varFlag - 1] = dat.objectList;
		})
	}
	var hp = ""

	//定义
	$scope.contentInfo = [
		"2016年八月成立的杭州漫国网络科技有限公司， 是由一群热爱ACG文化的人组建而成。旗下的产品42文库，则是一个小说原创平台。为了打造更优质的文化内容，我们不断推陈出新以求更好的发展。",
		"联系我们",
		"加入我们",
		"公司信息",
		"免责声明",
		"签约制度",
		"签约流程",
		"创作之路",
		"作者福利"
	];

	/**
	 * 设置左边菜单栏默认条目
	 * 解析地址
	 */
	var selectIndex = window.location.href.split("/");
	var index = parseInt(selectIndex[selectIndex.length - 1]);
	var flag = parseInt(selectIndex[selectIndex.length - 2]);
	if(index && flag) {
		$scope.toLink(index, flag);
	} else {
		$scope.toLink(1, 1);
	}
}]);

//尾部图片数据
app.controller("footerControll", function($scope, $http) {
	$scope.footerShow = function() {
		$.ajax({
				type: "post",
				url: IP + '/homePage/bookCarousel.do',
				async: true,
				data: {
					imageLocation: 1
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.footerList = data.objectList;
					})
				}
			})
		$.ajax({
				type: "post",
				url: IP + '/homePage/bookCarousel.do',
				async: true,
				data: {
					imageLocation: 2
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						$scope.QRcode = data.objectList[0].imageUrl;
					})
				}
			})
	}
})