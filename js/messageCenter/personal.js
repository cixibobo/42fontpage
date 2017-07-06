var app = angular.module("personalApp", []);
var sdk;
var nowUid;

//设置localstorage备份
if(localStorage.userInfo) {
	console.log("localStorage 备份");
	var userInfoB = localStorage.userInfo;
	var userNameB = localStorage.userName;
	var passwordB = localStorage.password;
	var userAccountB = localStorage.userAccount;
} else {
	console.log("localStorage 备份为空");
}
app.controller("personalC", function($scope, $window) {
	if(!isLogin()) {
		Toast("请先登陆", 1000);
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='../LoginRegister/login.html'", 1000);
		return;
	}
	sessionStorage.setItem("sixinInfoNum", 0);

	$scope.changFrameTop1 = function(frame_src) {
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='../LoginRegister/login.html'", 1000);
			return;
		}
		$window.open("../personCenter/sildebar.html?needUrl=" + frame_src, "_self");
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
					})
				} else {
					console.log('消息系统异常', data.flag)
				}
			})
	}

	$scope.signOut = function() {
		localStorage.removeItem('userInfo')
		setTimeout("window.location.href='../LoginRegister/login.html'", 10);
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

	var id = userId + "";
	console.log(id + " ")
	$scope.firendList = [];
	if(userId == null || userId == undefined) {
		Toast("请先登录哦~", 1000);
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='../LoginRegister/login.js'", 1000);
		return;
	}

	//页面跳转选择
	$scope.returnToWin = function(url) {
		if(isLogin()) {
			window.open("../" + url + ".html", "_self")
				//window.location.href = "./html/" + url + ".html";
			return;
		}
		//				Toast("请先登陆", 1000);
		setCookie("previousURL", location.href);
		setTimeout("window.location.href='./html/LoginRegister/login.html'", 1000);
	}

	$scope.headUrl = userInfo.headUrl;
	$scope.changFrameTop = function(frame_src) {
		$window.location.href = CurrentIp + "/html/personCenter/sildebar.html?needUrl=" + "mybookshelf";
	}
	window.onresize = function() {
		$(".content_list_side").css('left', $(".main_content").offset().left);
	}
	$(".content_list_side").css('left', $(".main_content").offset().left);
	/**
	 * 导航部分跳转
	 * @param {Object} index
	 */
	$scope.jumpIndex = function(index) {
		switch(index) {
			case 1:
				$window.open("../../index.html#/homePage");
				break;
			case 2:
				$window.open("../../index.html#/classify");
				break;
			case 3:
				$window.open("../../index.html#/stapleHall");
				break;
			case 4:
				$window.open("../../index.html#/association");
				break;
		}
	}

	/**
	 * 顶部消息导航
	 */
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
					if(data.flag == 1) {
						$scope.$apply(function() {
							if(data.objectList[0]) {
								$scope.dyMessage = data.objectList;
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

	/**
	 * 搜索书籍
	 * @param {Object} e
	 */
	$scope.searchBook = function(e) {
		var keycode = window.event ? e.keyCode : e.which;
		if(keycode == 13) {
			console.log($scope.searchMain)
			$scope.searchClass();
		}
	};
	//分类搜素
	$scope.searchClass = function() {
		var search = {
			searchValue: $scope.searchMain
		}
		var searchJson = JSON.stringify(search)
		var hrefsrc = window.location;
		var substr = "classify";
		sessionStorage.Search = searchJson;
		sessionStorage.setItem("first", 1);
		window.location.href = "../../index.html#/classify";
	}

	nowUid = id;
	var loc = location.href;
	var idc = [];
	idc = loc.split("=");
	if(typeof(idc[1]) == 'undefined') {

	} else {

	}
	$scope.changeUid = function(firend) {
		$scope.userNick = firend.nickName;
		nowUid = firend.accountId;
		WKIT.switchTouid({
			touid: firend.accountId + "",
			toAvatar: firend.headUrl
		});
		sdk.Chat.setReadState({
			touid: firend.accountId + "",
			timestamp: Math.floor((3000 + new Date()) / 1000),
			success: function(data) {
				$scope.$apply(function() {
					firend.noRead = 0;
				});
			},
			error: function(error) {
				console.log(error)
			}
		});
		if(userInfoB != undefined) {
			console.log("设置localStorage ");
			localStorage.userInfo = userInfoB;
			localStorage.userName = userNameB;
			localStorage.password = passwordB;
			localStorage.userAccount = userAccountB;
		} else {
			console.log("localStorage 还存在");
		}
	}
	$.ajax({
			url: IP + '/userInfoDetail/queryUserInfoDetail.do',
			type: 'POST',
			dataType: 'json',
			async: true,
			data: {
				id: userId
			}
		})
		.done(function(data) {
			console.log("用户信息", data)
				//			$scope.firendList = data.objectList[0];
			if(data.flag == 1) {
				WKIT.init({
					uid: id,
					appkey: appkey,
					credential: 'The42Novels',
					touid: id,
					avatar: data.objectList[0].headUrl,
					toAvatar: data.objectList[0].headUrl,
					container: document.getElementById('Im'),
					width: 745,
					height: 645,
					sendBtn: true,
					theme: 'yellow',
					hideLoginSuccess: true,
					onMsgSent: function(data) {
						if(userInfoB != undefined) {
							console.log("设置localStorage ");
							localStorage.userInfo = userInfoB;
							localStorage.userName = userNameB;
							localStorage.password = passwordB;
							localStorage.userAccount = userAccountB;
						} else {
							console.log("localStorage 还存在");
						}
					},
					onMsgReceived: function(data) {
						if(userInfoB != undefined) {
							console.log("设置localStorage ");
							localStorage.userInfo = userInfoB;
							localStorage.userName = userNameB;
							localStorage.password = passwordB;
							localStorage.userAccount = userAccountB;
						} else {
							console.log("localStorage 还存在");
						}
					},
					onUploaderSuccess: function(data) {
						if(userInfoB != undefined) {
							console.log("设置localStorage ");
							localStorage.userInfo = userInfoB;
							localStorage.userName = userNameB;
							localStorage.password = passwordB;
							localStorage.userAccount = userAccountB;
						} else {
							console.log("localStorage 还存在");
						}
					},
					onUploaderError: function(data) {
						if(userInfoB != undefined) {
							console.log("设置localStorage ");
							localStorage.userInfo = userInfoB;
							localStorage.userName = userNameB;
							localStorage.password = passwordB;
							localStorage.userAccount = userAccountB;
						} else {
							console.log("localStorage 还存在");
						}
					},
					onLoginSuccess: function(data) {
						console.log('login success', data);
						sdk = WKIT.Conn.sdk;
						var recentTribe = [];
						var Event = sdk.Event;
						sdk.Base.getRecentContact({
							count: 15,
							success: function(data) {
								console.log(data);
								data = data.data;
								var list = data.cnts,
									type = '';
								var i = 0;
								list.forEach(function(item) {
									console.log(item.uid.substring(8))
									$.ajax({
											url: IP + '/userInfoDetail/queryUserInfoDetail.do',
											type: 'POST',
											dataType: 'json',
											async: false,
											data: {
												id: item.uid.substring(8)
											}
										})
										.done(function(data1) {
											console.log("用户信息", data1)
											if(data1.objectList == null) {

											} else if(data1.objectList[0].accountId == userId) {

											} else {
												if(data1.objectList != null && data1.objectList.length != 0) {
													console.log("xiaoxi", (item.msg[0])[1].split("http://interface.im.taobao.com")[1])
													$scope.firendList[i] = data1.objectList[0];
													if(item.type == 2) {
														$scope.firendList[i].lastMsg = '[语音]';
													} else if(item.type == 1) {
														$scope.firendList[i].lastMsg = '[图片]';
													} else if((item.msg[0])[1].split("http://interface.im.taobao.com")[1] != null) {
														$scope.firendList[i].lastMsg = '';
													} else if((item.msg[0])[1].split("/:")[1] == null || (item.msg[0])[1].split("/:")[1] == undefined) {
														$scope.firendList[i].lastMsg = (item.msg[0])[1];
													} else {
														$scope.firendList[i].lastMsg = '';
													}
													i++;
												} else {
													console.log("查询用户信息失败")
												}
											}
										})
										.fail(function() {
											console.log("error");
										})
										.always(function() {
											console.log("complete");
											if(userInfoB != undefined) {
												console.log("设置localStorage ");
												localStorage.userInfo = userInfoB;
												localStorage.userName = userNameB;
												localStorage.password = passwordB;
												localStorage.userAccount = userAccountB;
											} else {
												console.log("localStorage 还存在");
											}
										});
								});

								$scope.$apply(function() {
									//若没有最近联系人
									if(list.length == 0) {
										if(typeof(idc[1]) != 'undefined') {
											$.ajax({
													url: IP + '/userInfoDetail/queryUserInfoDetail.do',
													type: 'POST',
													dataType: 'json',
													async: false,
													data: {
														id: idc[1]
													}
												})
												.done(function(data) {
													if(data.flag == 1) {
														$scope.firendList[0] = data.objectList[0];
														$scope.firendList[0].lastMsg = "暂无消息";
														$scope.changeUid($scope.firendList[0]);
													} else {
														console.log("查询用户信息失败")
													}
												})
												.fail(function() {
													console.log("error");
												})
												.always(function() {
													console.log("complete");
													if(userInfoB != undefined) {
														console.log("设置localStorage ");
														localStorage.userInfo = userInfoB;
														localStorage.userName = userNameB;
														localStorage.password = passwordB;
														localStorage.userAccount = userAccountB;
													} else {
														console.log("localStorage 还存在");
													}
												});
										}
										//若没有聊天记录
										//设置默认聊天人，不回复
										else {
											WKIT.switchTouid({
												touid: chatDefaultUid,
												toAvatar: chatDefaultHeadImg
											});
										}
									} else {
										if(typeof(idc[1]) == 'undefined') {
											$scope.changeUid($scope.firendList[0]);
										} else {
											var atList = false;
											$scope.firendList.forEach(function(item) {
												console.log(item.accountId + " " + idc[1])
												if(item.accountId == idc[1]) {
													$scope.changeUid(item);
													console.log("有人" + item)
													atList = true;
												}
											});
											if(!atList) {
												$.ajax({
														url: IP + '/userInfoDetail/queryUserInfoDetail.do',
														type: 'POST',
														dataType: 'json',
														async: false,
														data: {
															id: idc[1]
														}
													})
													.done(function(data) {
														console.log("没，添加", data)
														if(data.flag == 1) {
															var leng = $scope.firendList.length;
															$scope.firendList[leng] = data.objectList[0];
															$scope.firendList[leng].lastMsg = "暂无消息";
															$scope.changeUid($scope.firendList[leng]);
														} else {
															console.log("查询用户信息失败")
														}
													})
													.fail(function() {
														console.log("error");
													})
													.always(function() {
														console.log("complete");
														if(userInfoB != undefined) {
															console.log("设置localStorage ");
															localStorage.userInfo = userInfoB;
															localStorage.userName = userNameB;
															localStorage.password = passwordB;
															localStorage.userAccount = userAccountB;
														} else {
															console.log("localStorage 还存在");
														}
													});
											}
										}

									}
									console.log($scope.firendList);
									$scope.firendList = $scope.firendList;
									if(userInfoB != undefined) {
										console.log("设置localStorage ");
										localStorage.userInfo = userInfoB;
										localStorage.userName = userNameB;
										localStorage.password = passwordB;
										localStorage.userAccount = userAccountB;
									} else {
										console.log("localStorage 还存在");
									}
								}); //apply

								Event.on('CHAT.MSG_RECEIVED', function(data) {
									var ls = data.data;
									var uid = ls.msgs[0].from.substring(8);
									console.log("uid 的值为" + uid);
									$scope.firendList.forEach(function(it) {
										if(it.accountId == uid) {
											if(nowUid != uid) {
												console.log(uid);
												$scope.$apply(function() {
													it.noRead += 1;
													if(it.noRead == 0) {
														it.noreadshow = false;
													} else if(it.noRead > 99) {
														it.noRead = "99+";
														t.noreadshow = true;
													} else {
														it.noreadshow = true;
													}
												});
												console.log(it.noRead);
											}
											$scope.$apply(function() {
												it.lastMsg = ls.msgs[0].msg;
											});
										}
									});
								});

								sdk.Base.getUnreadMsgCount({
									count: 10,
									success: function(data) {
										console.log(data);
										var list = data.data;
										list.forEach(function(item) {
											if(item.contact.substring(0, 8) === 'chntribe') {
												recentTribe.push(item);
											} else {
												var s = item.contact.substring(8);
												console.log(3333);
												console.log($scope.firendList.length);
												$scope.firendList.forEach(function(it) {
													if(it.accountId == s) {
														console.log("iiiiiiii");
														$scope.$apply(function() {
															it.noRead = item.msgCount;
															if(it.noRead == 0) {
																it.noreadshow = false;
															} else if(it.noRead > 99) {
																it.noRead = "99+";
																t.noreadshow = true;
															} else {
																it.noreadshow = true;
															}
														})
														console.log(it.noRead);
													}
												});
												console.log(item.contact.substring(8) + '在' + new Date(parseInt(item.timestamp) * 1000) + ',');
												console.log('给我发了' + item.msgCount + '条消息，最后一条消息是在' + new Date(parseInt(item.lastmsgTime) * 1000) + '发的');
											}
										});
										if(userInfoB != undefined) {
											console.log("设置localStorage ");
											localStorage.userInfo = userInfoB;
											localStorage.userName = userNameB;
											localStorage.password = passwordB;
											localStorage.userAccount = userAccountB;
										} else {
											console.log("localStorage 还存在");
										}
										recentTribe.length && console.log('最近给我发消息的群', recentTribe);
									},
									error: function(error) {
										console.log('获取未读消息的条数失败', error);
									}
								});
							},
							error: function(error) {
								console.log('获取最近联系人及最后一条消息内容失败', error);
							}
						});

						console.log(JSON.parse(userInfoB))
						console.log(JSON.parse(localStorage.userInfo))
						if(userInfoB != undefined) {
							console.log("设置localStorage ");
							localStorage.userInfo = userInfoB;
							localStorage.userName = userNameB;
							localStorage.password = passwordB;
							localStorage.userAccount = userAccountB;
						} else {
							console.log("localStorage 还存在");
						}

					}

				});
			} else {
				if(userInfoB != undefined) {
					console.log("设置localStorage ");
					localStorage.userInfo = userInfoB;
					localStorage.userName = userNameB;
					localStorage.password = passwordB;
					localStorage.userAccount = userAccountB;
				} else {
					console.log("localStorage 还存在");
				}
			}
		})
		.fail(function() {
			console.log("error");
			//设置localstorage
			if(userInfoB != undefined) {
				console.log("设置localStorage ");
				localStorage.userInfo = userInfoB;
				localStorage.userName = userNameB;
				localStorage.password = passwordB;
				localStorage.userAccount = userAccountB;
			} else {
				console.log("localStorage 还存在");
			}
		})
		.always(function() {
			console.log("complete");
			//设置localstorage
			console.log(JSON.parse(userInfoB))
			console.log(JSON.parse(localStorage.userInfo))
			if(userInfoB != undefined) {
				console.log("设置localStorage ");
				localStorage.userInfo = userInfoB;
				localStorage.userName = userNameB;
				localStorage.password = passwordB;
				localStorage.userAccount = userAccountB;
			} else {
				console.log("localStorage 还存在");
			}
		});

});