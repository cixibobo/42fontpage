var app = angular.module("netServiceApp", []);
var sdk;
var nowUid;
var isKefu;

var headUrl = userInfo.headUrl;
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
app.controller("netServiceC", function($scope, $window) {
	if(userInfo.identity == 2) {
		var id = userId + "cs";
	} else {
		var id = userId + "";
	}

	$scope.nickShow = function(nick) {
	}

	nowUid = id;
	var touidInit = "";
	$scope.changeUid = function(firend) {
			$scope.userNick = firend.nickName;
			nowUid = firend.accountId;
			if(userInfo.identity == 2) {
				isKefu = firend.accountId + "";
			} else {
				isKefu = firend.accountId + "cs";
			}
			WKIT.switchTouid({
				touid: isKefu,
				toAvatar: firend.headUrl
			});
			sdk.Chat.setReadState({
				touid: isKefu,
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
		//	$scope.changeUid = function(firend) {
		//			if(touidInit == userId + "") {
		//				return;
		//			}
		//			$scope.userNick = firend.nickName;
		//			nowUid = firend.accountId;
		//			WKIT.switchTouid({
		//				touid: firend.accountId + "cs",
		//				toAvatar: firend.headUrl
		//			});
		//			sdk.Chat.setReadState({
		//				touid: firend.accountId + "cs",
		//				timestamp: Math.floor((3000 + new Date()) / 1000),
		//				success: function(data) {
		//					$scope.$apply(function() {
		//						firend.noRead = 0;
		//					});
		//				},
		//				error: function(error) {
		//					console.log(error)
		//				}
		//			});
		//		}
	if(userInfo.identity == 2) {
		$scope.firendList = [];
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
						appkey: appkeycs,
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
											//											if(typeof(idc[1]) == 'undefined') {
											$scope.changeUid($scope.firendList[0]);
											//											} else {
											//												var atList = false;
											//												$scope.firendList.forEach(function(item) {
											//													console.log(item.accountId + " " + idc[1])
											//													if(item.accountId == idc[1]) {
											//														$scope.changeUid(item);
											//														console.log("有人" + item)
											//														atList = true;
											//													}
											//												});
											//												if(!atList) {
											//													$.ajax({
											//															url: IP + '/userInfoDetail/queryUserInfoDetail.do',
											//															type: 'POST',
											//															dataType: 'json',
											//															async: false,
											//															data: {
											//																id: idc[1]
											//															}
											//														})
											//														.done(function(data) {
											//															console.log("没，添加", data)
											//															if(data.flag == 1) {
											//																var leng = $scope.firendList.length;
											//																$scope.firendList[leng] = data.objectList[0];
											//																$scope.firendList[leng].lastMsg = "暂无消息";
											//																$scope.changeUid($scope.firendList[leng]);
											//															} else {
											//																console.log("查询用户信息失败")
											//															}
											//														})
											//														.fail(function() {
											//															console.log("error");
											//														})
											//														.always(function() {
											//															console.log("complete");
											//														});
											//												}
											//											}

										}
										console.log($scope.firendList);
										$scope.firendList = $scope.firendList;
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
					console.log("查询失败")
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
				}
			})
			.fail(function() {
				console.log("error");
				设置localstorage
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

	} else {

		$.ajax({
				url: IP + '/userInfoDetail/queryUserService.do',
				type: 'POST',
				dataType: 'json',
				async: true
			})
			.done(function(data1) {
				console.log("用户信息111111111", data1.objectList)

				if(data1.flag == 1) {
					if(data1.objectList == null || data1.objectList.length == 0) {

						$scope.userNick = "暂无客服";
						touidInit = chatDefaultUid;
					} else {

						$scope.firendList = data1.objectList;
						for(var i = 0; i < $scope.firendList.length; i++) {
							if($scope.firendList[i].headUrl == undefined) {
								$scope.firendList[i].headUrl = headUserServiceImg;
							}
							//						$scope.firendList[i].headUrl = headUserServiceImg;
							$scope.firendList[i].lastMsg = "暂无消息";
							$scope.firendList[i].noRead = 0;
						}
						console.log($scope.firendList)
						touidInit = data1.objectList[0].accountId + "cs";
					}
					$scope.$apply(function() {
							$scope.firendList = $scope.firendList;
						})
						//初始化im
					WKIT.init({
						uid: id,
						appkey: appkeycs,
						credential: 'The42Novels',
						touid: touidInit,
						avatar: headUrl,
						toAvatar: headUserServiceImg,
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
												if(it.accountId + "cs" == s) {
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
							if($scope.firendList == null || $scope.firendList == undefined || $scope.firendList.length == 0) {

							} else {
								$scope.$apply(function() {
									$scope.userNick = $scope.firendList[0].nickName;
								})
							}

							$scope.firendList.forEach(function(it) {

								sdk.Chat.getHistory({
									touid: it.accountId + "cs",
									nextkey: '',
									count: 1,
									success: function(data) {
										console.log("sssssss", data)
										$scope.firendList.forEach(function(it) {
											if(data.data.msgs == null || data.data.msgs == undefined || data.data.msgs.length == 0) {
												it.lastMsg = "暂无消息";
											} else {
												if(data.data.msgs[0].to.substring(8) == it.accountId + "cs") {
													if(data.data.msgs == null || data.data.msgs == undefined || data.data.msgs.length == 0) {
														it.lastMsg = "暂无消息";
													} else if(data.data.msgs[0].type == 1) {
														it.lastMsg = '';
													} else if(data.data.msgs[0].msg.split("/:")[1] == null || data.data.msgs[0].msg.split("/:")[1] == undefined) {
														it.lastMsg = data.data.msgs[0].msg;
													} else {
														it.lastMsg = '';
													}
												}
											}
										})
										$scope.$apply(function() {
											$scope.firendList = $scope.firendList;
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
									},
									error: function(error) {
										console.log('获取历史消息失败', error);
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

							});

						}

					});
				} else {
					console.log("查客服列表失败")
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
		$scope.firendList = [

		]
	}
});