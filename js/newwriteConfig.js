function newWriteConfig() {

	'use strict';
	var book_smallImg;

	var console = window.console || {
		log: function() {}
	};
	var URL = window.URL || window.webkitURL;
	var $image = $('#image');
	var $download = $('#download');
	var $dataX = $('#dataX');
	var $dataY = $('#dataY');
	var $dataHeight = $('#dataHeight');
	var $dataWidth = $('#dataWidth');
	var $dataRotate = $('#dataRotate');
	var $dataScaleX = $('#dataScaleX');
	var $dataScaleY = $('#dataScaleY');
	var options = {
		viewMode: 1,
		aspectRatio: 53 / 74,
		checkImageOrigin: true,
		preview: '.img-preview',
		crop: function(e) {
			$dataX.val(Math.round(e.x));
			$dataY.val(Math.round(e.y));
			$dataRotate.val(e.rotate);
			$dataScaleX.val(e.scaleX);
			$dataScaleY.val(e.scaleY);
		}
	};

	var originalImageURL = $image.attr('src');
	var uploadedImageURL;

	//// Tooltip
	//$('[data-toggle="tooltip"]').tooltip();

	// Cropper

	$image.on({
		'build.cropper': function(e) {

			//console.log(e.type);
		},
		'built.cropper': function(e) {
			//console.log(e.type);
		},
		'cropstart.cropper': function(e) {
			//console.log(e.type, e.action);
		},
		'cropmove.cropper': function(e) {
			//console.log(e.type, e.action);
		},
		'cropend.cropper': function(e) {
			//console.log(e.type, e.action);
		},
		'crop.cropper': function(e) {
			//console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
		},
		'zoom.cropper': function(e) {
			//console.log(e.type, e.ratio);
		}
	}).cropper(options);

	// Buttons
	if(!$.isFunction(document.createElement('canvas').getContext)) {
		$('button[data-method="getCroppedCanvas"]').prop('disabled', true);
	}

	if(typeof document.createElement('cropper').style.transition === 'undefined') {
		$('button[data-method="rotate"]').prop('disabled', true);
		$('button[data-method="scale"]').prop('disabled', true);
	}

	// Download
	//if (typeof $download[0].download === 'undefined') {
	//  $download.addClass('disabled');
	//}

	// Options
	$('.docs-toggles').on('change', 'input', function() {
		var $this = $(this);
		var name = $this.attr('name');
		var type = $this.prop('type');
		var cropBoxData;
		var canvasData;
		if(!$image.data('cropper')) {
			return;
		}
		console.log('inputchange')
		if(type === 'checkbox') {
			options[name] = $this.prop('checked');
			cropBoxData = $image.cropper('getCropBoxData');
			canvasData = $image.cropper('getCanvasData');
			options.built = function() {
				$image.cropper('setCropBoxData', cropBoxData);
				$image.cropper('setCanvasData', canvasData);
			};
		} else if(type === 'radio') {
			options[name] = $this.val();
		}

		$image.cropper('destroy').cropper(options);
	});

	// Methods
	$('.docs-buttons').on('click', '[data-method]', function() {
		var $this = $(this);
		var data = $this.data();
		var $target;
		var result;
		// 	canvasData = $image.cropper('getCanvasData');

		if($this.prop('disabled') || $this.hasClass('disabled')) {
			return;
		}

		if($image.data('cropper') && data.method) {
			data = $.extend({}, data); // Clone a new one

			if(typeof data.target !== 'undefined') {
				$target = $(data.target);

				if(typeof data.option === 'undefined') {
					try {
						data.option = JSON.parse($target.val());
					} catch(e) {
						//console.log(e.message);
					}
				}
			}

			if(data.method === 'rotate') {
				$image.cropper('clear');
			}
			result = $image.cropper(data.method, data.option, data.secondOption);

			if(data.method === 'rotate') {
				$image.cropper('crop');
			}
			switch(data.method) {
				case 'scaleX':
				case 'scaleY':
					$(this).data('option', -data.option);
					break;

				case 'getCroppedCanvas':
					if(result) {
						if(bookimgType != 1) {
							return;
						}
						var _imgUrl = result.toDataURL();
						var blob = dataURLtoBlob(_imgUrl);
						console.log(blob)
						//使用ajax发送
						var fd = new FormData();
						fd.append("uploadFile", blob, "image.png");
						console.log(fd)
						$.ajax({
							url: IP + '/pic/upload.do',
							method: 'POST',
							processData: false, // 必须
							contentType: false, // 必须
							dataType: 'json',
							data: fd,
							success(data) {
								if(data) {
									if(_bigImgId) {
										if(_bigImgId != 1020 && _bigImgId != 1019) {
											//删除原图片
											$.ajax({
													type: "post",
													url: IP + '/pic/deleteFile.do',
													dataType: 'json',
													data: {
														fileId: _bigImgId
													}
												})
												.done(function(data) {
													if(data.code == 1) {
														_bigImgId = "";
													}
												})
										}
									}
									book_img = data.fileId;
									$('#bigImg').attr("src", result.toDataURL());
									console.log("上传大图片成功" + book_img)
								} else {
									Toast("上传大图片失败请，重新上传", 1000);
								}
							}
						});
					}

					break;

				case 'destroy':
					if(uploadedImageURL) {
						URL.revokeObjectURL(uploadedImageURL);
						uploadedImageURL = '';
						$image.attr('src', originalImageURL);
					}

					break;
			}

			if($.isPlainObject(result) && $target) {
				try {
					$target.val(JSON.stringify(result));
				} catch(e) {
					//console.log(e.message);
				}
			}

		}
	});

	// Keyboard
	$(document.body).on('keydown', function(e) {

		if(!$image.data('cropper') || this.scrollTop > 300) {
			return;
		}

		switch(e.which) {
			case 37:
				e.preventDefault();
				$image.cropper('move', -1, 0);
				break;

			case 38:
				e.preventDefault();
				$image.cropper('move', 0, -1);
				break;

			case 39:
				e.preventDefault();
				$image.cropper('move', 1, 0);
				break;

			case 40:
				e.preventDefault();
				$image.cropper('move', 0, 1);
				break;
		}

	});

	// Import image
	var $inputImage = $('#fileInput');
	$inputImage.change(function() {
		originalImageURL = $image.attr('src');
		$image.cropper(options);
		//			canvasData = $image.cropper('getCanvasData');

		var files = this.files;
		var file;

		if(!$image.data('cropper')) {
			return;
		}

		if(files && files.length) {
			file = files[0];

			if(/^image\/\w+$/.test(file.type)) {
				if(uploadedImageURL) {
					URL.revokeObjectURL(uploadedImageURL);
				}

				uploadedImageURL = URL.createObjectURL(file);
				$image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
				$inputImage.val('');
			} else {
				window.alert('Please choose an image file.');
			}
		}
	});
	//	} else {
	//		$inputImage.prop('disabled', true).parent().addClass('disabled');
	//	}

}

function newWriteConfig2() {
	'use strict';

	var console = window.console || {
		log: function() {}
	};
	var URL = window.URL || window.webkitURL;
	var $image = $('#image2');
	var $download = $('#download');
	var $dataX = $('#dataX');
	var $dataY = $('#dataY');
	var $dataHeight = $('#dataHeight');
	var $dataWidth = $('#dataWidth');
	var $dataRotate = $('#dataRotate');
	var $dataScaleX = $('#dataScaleX');
	var $dataScaleY = $('#dataScaleY');
	var options = {
		viewMode: 1,
		aspectRatio: 1 / 1,
		preview: '.img-preview2',
		crop: function(e) {
			$dataX.val(Math.round(e.x));
			$dataY.val(Math.round(e.y));
			$dataRotate.val(e.rotate);
			$dataScaleX.val(e.scaleX);
			$dataScaleY.val(e.scaleY);

		},
		autoCropArea: 0.5,
		cropBoxResizable: true, //是否允许拖动 改变裁剪框大小
	};
	var originalImageURL = $image.attr('src');
	var uploadedImageURL;

	//// Tooltip
	//$('[data-toggle="tooltip"]').tooltip();

	// Cropper
	$image.on({
		'build.cropper': function(e) {
			//console.log(e.type);
		},
		'built.cropper': function(e) {
			//console.log(e.type);
		},
		'cropstart.cropper': function(e) {
			//console.log(e.type, e.action);
		},
		'cropmove.cropper': function(e) {
			//console.log(e.type, e.action);
		},
		'cropend.cropper': function(e) {
			//console.log(e.type, e.action);
		},
		'crop.cropper': function(e) {
			//console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
		},
		'zoom.cropper': function(e) {
			//console.log(e.type, e.ratio);
		}
	}).cropper(options);

	// Buttons
	if(!$.isFunction(document.createElement('canvas').getContext)) {
		$('button[data-method="getCroppedCanvas"]').prop('disabled', true);
	}

	if(typeof document.createElement('cropper').style.transition === 'undefined') {
		$('button[data-method="rotate"]').prop('disabled', true);
		$('button[data-method="scale"]').prop('disabled', true);
	}

	// Download
	//if (typeof $download[0].download === 'undefined') {
	//  $download.addClass('disabled');
	//}

	// Options
	$('.docs-toggles').on('change', 'input', function() {
		var $this = $(this);
		var name = $this.attr('name');
		var type = $this.prop('type');
		var cropBoxData;
		var canvasData;

		if(!$image.data('cropper')) {
			return;
		}

		if(type === 'checkbox') {
			options[name] = $this.prop('checked');
			cropBoxData = $image.cropper('getCropBoxData');
			canvasData = $image.cropper('getCanvasData');
			options.built = function() {
				$image.cropper('setCropBoxData', cropBoxData);
				$image.cropper('setCanvasData', canvasData);
			};
		} else if(type === 'radio') {
			options[name] = $this.val();
		}

		$image.cropper('destroy').cropper(options);
	});
	// Methods
	$('.docs-buttons').on('click', '[data-method]', function() {
		var $this = $(this);
		var data = $this.data();
		var $target;
		var result;
		// 	canvasData = $image.cropper('getCanvasData');

		if($this.prop('disabled') || $this.hasClass('disabled')) {
			return;
		}

		if($image.data('cropper') && data.method) {
			data = $.extend({}, data); // Clone a new one

			if(typeof data.target !== 'undefined') {
				$target = $(data.target);

				if(typeof data.option === 'undefined') {
					try {
						data.option = JSON.parse($target.val());
					} catch(e) {
						//console.log(e.message);
					}
				}
			}

			if(data.method === 'rotate') {
				$image.cropper('clear');
			}
			result = $image.cropper(data.method, data.option, data.secondOption);

			if(data.method === 'rotate') {
				$image.cropper('crop');
			}
			switch(data.method) {
				case 'scaleX':
				case 'scaleY':
					$(this).data('option', -data.option);
					break;

				case 'getCroppedCanvas':
					if(result) {
						if(bookimgType != 0) {
							return;
						}
						var _imgUrlSmall = result.toDataURL();
						var blobsmall = dataURLtoBlob(_imgUrlSmall);
						//使用ajax发送
						console.log(blobsmall)
						var fdsmall = new FormData();
						fdsmall.append("uploadFile", blobsmall, "image.png");
						console.log(fdsmall)
						$.ajax({
							url: IP + '/pic/upload.do',
							method: 'POST',
							processData: false, // 必须
							contentType: false, // 必须
							dataType: 'json',
							data: fdsmall,
							success(data) {
								if(data.code == 1) {
									if(_smallImgId) {
										if(_bigImgId != 1020 && _bigImgId != 1019) {
											//删除原图片
											$.ajax({
													type: "post",
													url: IP + '/pic/deleteFile.do',
													dataType: 'json',
													data: {
														fileId: _smallImgId
													}
												})
												.done(function(data) {
													if(data.code == 1) {
														_smallImgId = "";
													}
												})
										}
									}
									book_smallImg = data.fileId;;
									$('#smallImg').attr("src", result.toDataURL());
									console.log("上传小图片成功" + book_smallImg)
								} else {
									Toast("上传失败请，重新上传", 1000);
								}
							}
						});
					}

					//上传到服务器

					break;

				case 'destroy':
					if(uploadedImageURL) {
						URL.revokeObjectURL(uploadedImageURL);
						uploadedImageURL = '';
						$image.attr('src', originalImageURL);
					}

					break;
			}

			if($.isPlainObject(result) && $target) {
				try {
					$target.val(JSON.stringify(result));
				} catch(e) {
					//console.log(e.message);
				}
			}

		}
	});

	// Keyboard
	$(document.body).on('keydown', function(e) {

		if(!$image.data('cropper') || this.scrollTop > 300) {
			return;
		}

		switch(e.which) {
			case 37:
				e.preventDefault();
				$image.cropper('move', -1, 0);
				break;

			case 38:
				e.preventDefault();
				$image.cropper('move', 0, -1);
				break;

			case 39:
				e.preventDefault();
				$image.cropper('move', 1, 0);
				break;

			case 40:
				e.preventDefault();
				$image.cropper('move', 0, 1);
				break;
		}

	});

	// Import image
	var $inputImage = $('#fileInput2');

	$inputImage.change(function() {
		originalImageURL = $image.attr('src');
		$image.cropper(options);
		//			canvasData = $image.cropper('getCanvasData');
		var files = this.files;
		var file;

		if(!$image.data('cropper')) {
			return;
		}

		if(files && files.length) {
			file = files[0];

			if(/^image\/\w+$/.test(file.type)) {
				if(uploadedImageURL) {
					URL.revokeObjectURL(uploadedImageURL);
				}

				uploadedImageURL = URL.createObjectURL(file);
				$image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
				$inputImage.val('');
			} else {
				window.alert('Please choose an image file.');
			}
		}
	});

}
/**
 * 修改个人信息
 */
function newWriteConfig3() {
	'use strict';

	var console = window.console || {
		log: function() {}
	};
	var URL = window.URL || window.webkitURL;
	var $image = $('#image2');
	var $download = $('#download');
	var $dataX = $('#dataX');
	var $dataY = $('#dataY');
	var $dataHeight = $('#dataHeight');
	var $dataWidth = $('#dataWidth');
	var $dataRotate = $('#dataRotate');
	var $dataScaleX = $('#dataScaleX');
	var $dataScaleY = $('#dataScaleY');
	var options = {
		aspectRatio: 1 / 1,
		preview: '.img-preview2',
		viewMode: 1,
		crop: function(e) {
			$dataX.val(Math.round(e.x));
			$dataY.val(Math.round(e.y));
			$dataRotate.val(e.rotate);
			$dataScaleX.val(e.scaleX);
			$dataScaleY.val(e.scaleY);
		}
	};
	var originalImageURL = $image.attr('src');
	var uploadedImageURL;

	//// Tooltip
	//$('[data-toggle="tooltip"]').tooltip();

	// Cropper
	$image.on({
		'build.cropper': function(e) {
			//console.log(e.type);
		},
		'built.cropper': function(e) {
			//console.log(e.type);
		},
		'cropstart.cropper': function(e) {
			//console.log(e.type, e.action);
		},
		'cropmove.cropper': function(e) {
			//console.log(e.type, e.action);
		},
		'cropend.cropper': function(e) {
			//console.log(e.type, e.action);
		},
		'crop.cropper': function(e) {
			//console.log(e.type, e.x, e.y, e.width, e.height, e.rotate, e.scaleX, e.scaleY);
		},
		'zoom.cropper': function(e) {
			//console.log(e.type, e.ratio);
		}
	}).cropper(options);

	// Buttons
	if(!$.isFunction(document.createElement('canvas').getContext)) {
		$('button[data-method="getCroppedCanvas"]').prop('disabled', true);
	}

	if(typeof document.createElement('cropper').style.transition === 'undefined') {
		$('button[data-method="rotate"]').prop('disabled', true);
		$('button[data-method="scale"]').prop('disabled', true);
	}

	// Download
	//if (typeof $download[0].download === 'undefined') {
	//  $download.addClass('disabled');
	//}

	// Options
	$('.docs-toggles').on('change', 'input', function() {
		var $this = $(this);
		var name = $this.attr('name');
		var type = $this.prop('type');
		var cropBoxData;
		var canvasData;

		if(!$image.data('cropper')) {
			return;
		}

		if(type === 'checkbox') {
			options[name] = $this.prop('checked');
			cropBoxData = $image.cropper('getCropBoxData');
			canvasData = $image.cropper('getCanvasData');
			options.built = function() {
				$image.cropper('setCropBoxData', cropBoxData);
				$image.cropper('setCanvasData', canvasData);
			};
		} else if(type === 'radio') {
			options[name] = $this.val();
		}

		$image.cropper('destroy').cropper(options);
	});

	// Methods
	$('.docs-buttons').on('click', '[data-method]', function() {
		var $this = $(this);
		var data = $this.data();
		var $target;
		var result;
		// 	canvasData = $image.cropper('getCanvasData');

		var book_smallImg;

		if($this.prop('disabled') || $this.hasClass('disabled')) {
			return;
		}

		if($image.data('cropper') && data.method) {
			data = $.extend({}, data); // Clone a new one

			if(typeof data.target !== 'undefined') {
				$target = $(data.target);

				if(typeof data.option === 'undefined') {
					try {
						data.option = JSON.parse($target.val());
					} catch(e) {
						//console.log(e.message);
					}
				}
			}

			if(data.method === 'rotate') {
				$image.cropper('clear');
			}
			result = $image.cropper(data.method, data.option, data.secondOption);

			if(data.method === 'rotate') {
				$image.cropper('crop');
			}
			switch(data.method) {
				case 'scaleX':
				case 'scaleY':
					$(this).data('option', -data.option);
					break;

				case 'getCroppedCanvas':
					if(result) {
						if(result) {
							var _imgUrlINFO = result.toDataURL();
							var blobINFO = dataURLtoBlob(_imgUrlINFO);
							//使用ajax发送
							var fdINFO = new FormData();
							fdINFO.append("uploadFile", blobINFO, "image.png");
							$.ajax({
								url: IP + '/pic/upload.do',
								method: 'POST',
								processData: false, // 必须
								contentType: false, // 必须
								dataType: 'json',
								data: fdINFO,
								success(data) {
									if(data.code == 1) {
										book_smallImg = data.fileId;
										var headUrl = data.message;
										$('#smallImg').attr("src", result.toDataURL());
										var headUrl = data.message;
										$.ajax({
												url: IP + '/userInfoDetail/fixUserInfoDetail.do',
												type: 'POST',
												dataType: 'json',
												data: {
													accountId: id,
													portrait: book_smallImg
												}
											})
											.done(function(data) {
												console.log(data)
												if(data.flag == 1) {
													Toast("头像修改成功啦~\(≧▽≦)/~", 2000);
													if(userInfo.portrait) {
														if(userInfo.portrait == 1019 || userInfo.portrait == 1020) {
															console.log("defaultP")
														} else {
															//删除原来的图片
															$.ajax({
																	url: IP + '/pic/deleteFile.do',
																	type: 'POST',
																	dataType: 'json',
																	data: {
																		fileId: userInfo.portrait
																	}
																})
																.done(function(data) {
																	if(data.code == 1) {
																		console.log("删除原图片成功")
																	} else {
																		console.log("删除原图片失败", data)
																	}
																})
														}
													}
													$.ajax({
															url: IP + '/userInfoDetail/queryUserInfoDetail.do',
															type: 'POST',
															dataType: 'json',
															data: {
																id: userId
															}
														})
														.done(function(data) {
															localStorage.userInfo = JSON.stringify(data.objectList[0]);
															setTimeout("  parent.location.reload(); ", 500);
														})

												} else {
													console.log("修改个人信息失败");
												}
											})
											.fail(function() {
												console.log("error");
											})
											.always(function() {
												console.log("complete");
											});
										console.log("上传小图片成功" + book_smallImg)
									} else {
										Toast("上传失败请，重新上传", 1000);
									}
								}
							});
						}
						//上传到服务器

					}

					break;

				case 'destroy':
					if(uploadedImageURL) {
						//						alert("!1")
						console.log(11)
						URL.revokeObjectURL(uploadedImageURL);
						uploadedImageURL = '';
						$image.attr('src', originalImageURL);
					}

					break;
			}

			if($.isPlainObject(result) && $target) {
				try {
					$target.val(JSON.stringify(result));
				} catch(e) {
					//console.log(e.message);
				}
			}

		}
	});

	// Keyboard
	$(document.body).on('keydown', function(e) {

		if(!$image.data('cropper') || this.scrollTop > 300) {
			return;
		}

		switch(e.which) {
			case 37:
				e.preventDefault();
				$image.cropper('move', -1, 0);
				break;

			case 38:
				e.preventDefault();
				$image.cropper('move', 0, -1);
				break;

			case 39:
				e.preventDefault();
				$image.cropper('move', 1, 0);
				break;

			case 40:
				e.preventDefault();
				$image.cropper('move', 0, 1);
				break;
		}

	});

	// Import image
	var $inputImage = $('#fileInput2');

	$inputImage.change(function() {
		originalImageURL = $image.attr('src');
		$image.cropper(options);
		//			canvasData = $image.cropper('getCanvasData');
		var files = this.files;
		var file;

		if(!$image.data('cropper')) {
			return;
		}

		if(files && files.length) {
			file = files[0];

			if(/^image\/\w+$/.test(file.type)) {
				if(uploadedImageURL) {
					URL.revokeObjectURL(uploadedImageURL);
				}

				uploadedImageURL = URL.createObjectURL(file);
				$image.cropper('destroy').attr('src', uploadedImageURL).cropper(options);
				$inputImage.val('');
			} else {
				window.alert('Please choose an image file.');
			}
		}
	});

}

function dataURItoBlob(base64Data) {
	var byteString;
	if(base64Data.split(',')[0].indexOf('base64') >= 0) {
		byteString = atob(base64Data.split(',')[1]);
	} else {
		byteString = unescape(base64Data.split(',')[1]);
	}

	var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
	var ia = new Uint8Array(byteString.length);
	for(var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	BlobNew = new Blob([ia], { type: mimeString });
	console.log(new Blob([ia], { type: mimeString }))
	return new Blob([ia], { type: mimeString });

}

function sumitImageFile(base64Codes) {
	var form = document.forms[0];

	var formData = new FormData(form); //这里连带form里的其他参数也一起提交了,如果不需要提交其他参数可以直接FormData无参数的构造函数

	//convertBase64UrlToBlob函数是将base64编码转换为Blob
	formData.append("uploadFile", convertBase64UrlToBlob(base64Codes)); //append函数的第一个参数是后台获取数据的参数名,和html标签的input的name属性功能相同

	setTimeout(console.log(formData), 10000)
	//ajax 提交form
	$.ajax({
		url: IP + '/pic/uploadBase64.do',
		type: "POST",
		data: formData,
		dataType: "json",
		processData: false, // 告诉jQuery不要去处理发送的数据
		contentType: false, // 告诉jQuery不要去设置Content-Type请求头

		success: function(data) {
			window.location.href = "${ctx}" + data;
		},
		xhr: function() { //在jquery函数中直接使用ajax的XMLHttpRequest对象
			var xhr = new XMLHttpRequest();

			xhr.upload.addEventListener("progress", function(evt) {
				if(evt.lengthComputable) {
					var percentComplete = Math.round(evt.loaded * 100 / evt.total);
					console.log("正在提交." + percentComplete.toString() + '%'); //在控制台打印上传进度
				}
			}, false);

			return xhr;
		}

	});
}

/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 *            用url方式表示的base64图片数据
 */
function convertBase64UrlToBlob(urlData) {

	var bytes = window.atob(urlData.split(',')[1]); //去掉url的头，并转换为byte

	//处理异常,将ascii码小于0的转换为大于0
	var ab = new ArrayBuffer(bytes.length);
	var ia = new Uint8Array(ab);
	for(var i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}

	return new Blob([ab], { type: 'image/png' });
}

function dataURLtoBlob(dataurl) {
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while(n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}