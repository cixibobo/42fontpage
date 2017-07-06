var bookId, volumeId, chapterId, chapterName, _isSubmit;
var _chapter_state;
var _setPrice = 0;
var isFreeRead = 0;
var nowPageNumber=1;
var app = angular.module('writeApp', []);
var book_img;
var book_smallImg;
var _bigImgId;			//大图片的id
var _smallImgId;			//小图片的id
var isOneSelf;//是否上线 0 1代表上架
var bookimgType=false;//用来区分是点击小图片还是大图片上传 1代表大图片，0代表小图片
app.controller('writeControl', function($scope, $http) {
	var chapterOldNumber=0; //默认原数字为0
	/**
	 *书本，卷，章节页数 
	 */
	var pageNum_zhang = 1;
	var pageNum_book = 1;
	var	pageNum_juan =1;
	/**
	 * 章节标志
	 * 用来判断用户是否已经点击章节
	 * 作点击发布按钮时的验证
	 */
	$scope.zhangFlag = false;

	/**
	 * 章节免费标志 
	 */
	$scope.isFree = true;

	/**
	 * 设置发布还是修改 
	 */
	$scope.pubAndFix = "发布";

	/**
	 * 初始化章节价格
	 * 若local存在值，则从local取值
	 */

	if(localStorage.chapterPrice) {
		$scope.preChapterPrice = parseInt(localStorage.chapterPrice);
	}

	/**
	 * 点击 是否免费
	 */
	$scope.setIsFreeC = function() {
		$scope.chapterPriceReadOnly = !$scope.chapterPriceReadOnly;
	}

	var bigImgUrl, smallImgUrl;
	var um = UM.getEditor('myEditor', {
		//这里可以选择自己需要的工具按钮名称,此处仅选择如下七个
		toolbar: [ 'bold', 'italic', 'emotion','image', 'undo',  'redo','fullscreen'],
		//focus时自动清空初始化时的内容
		autoClearinitialContent: true,
		//关闭字数统计
		wordCount: false,
		//关闭elementPath
		elementPathEnabled: false,
		//默认的编辑区域高度
		//          initialFrameHeight:300
		//更多其他参数，请参考umeditor.config.js中的配置项
	});

	/*保存提交审核*/
	$scope.saveToRecycle = function(sta) {
		if(!$scope.zhangFlag) {
			Toast("请选择章节", 1000);
			return;
		}
		if($scope.preChapterPrice == null || $scope.preChapterPrice == undefined || $scope.preChapterPrice.length == 0) {
			Toast("请输入此章价格", 1000);
			return;
		}
		if($scope.preChapterPrice < 0) {
			Toast("价格不能小于0", 1000);
			return;
		}
		if($scope.isFree) {
			$scope.preChapterPrice = 0;
			isFreeRead = 1;
		} else {
			isFreeRead = 0;
		}
		var data = um.getContent();
		 var count= um.getContent(false,false,true).length;
		 
		var chapterNumber = um.getContentTxt().replace(/\s/g, "").length;
		if($scope.pubAndFix=="修改" || sta==1) {
			$.ajax({
					type: "post",
					async: false,
					url: IP + '/createBook/newWriteAddChapterContent.do',
					data: {　　　　　　　　　　
						id: chapterId,
						isFreeRead: isFreeRead,
						chapterPrice: $scope.preChapterPrice,
						chapterNumber: chapterNumber,
						chapterOldNumber:chapterOldNumber,
						chapterContent: data,
						state:sta,
						bookId: bookId,
						//				volumeId: volumeId,
						chapterName: chapterName,
						isSubmit: _isSubmit　
					}
				})
				.fail(function(data) {
					console.log("Connection error");
				})
				.done(function(data) {
					if(data.flag==1){
						if(sta==1){
							Toast('保存成功啦', 2000);
						}else{
							Toast('修改成功啦', 2000);
						}
						um.setContent('');
					}
					
					/**
					 *存储作者设定的章节价格 
					 */
					localStorage.chapterPrice = $scope.preChapterPrice;
				})
		} else {
			console.log(_chapter_state)
			console.log(localStorage.chapterPrice)
			if(_chapter_state == 0) {
				Toast("已经提交过啦", 1000);
				return;
			}

			
			if(data.length <= 0) {
				Toast("章节内容不能为空~", 1000);
				return;
			}
				$.ajax({
					type: "post",
					async: false,
					url: IP + '/createBook/newWriteAddChapterContent.do',
					data: {　　　　　　　　　　
						bookId: bookId,
						volumeId: volumeId,
						"chapterContent": data,
						id: chapterId,
						userId: userId,
						chapterNumber: chapterNumber,
						chapterName: chapterName,
						chapterOldNumber:0,
						state:0,
						isFreeRead: isFreeRead,
						chapterPrice: $scope.preChapterPrice,
						isSubmit: _isSubmit　　　　　　　　
					}
				})
				.fail(function(data) {
					console.log("createBook/newWriteAddChapterContent.do+Connection error");
				})
				.done(function(data) {
					Toast('发布成功啦', 2000);
					um.setContent('');
					_chapter_state = 0;
					/**
					 *存储作者设定的章节价格 
					 */
					localStorage.chapterPrice = $scope.preChapterPrice;
				})
		}	
	}
	
	
	//	var bookId,volumeId,chapterId;
	$scope.zhangList = "";
	$scope.juanList = "";
	$scope.bookList = "";
	/*查询写的书籍列表*/
	$scope.queryBook = function(numPerPage,pageNum_b) {
		console.log(pageNum_book)
		$scope.zhangFlag = false;
		$.ajax({
				url: IP + '/createBook/queryMyWriteBook.do',
				type: 'POST',
				dataType: 'json',
				data: {
					authorId: userId,
					numPerPage: numPerPage,
					pageNum: pageNum_book
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					pageNum_book++;
					$scope.$apply(function() {
					if(data.objectList.length == 12) {
							$scope.book_more = true;
						} else {
							$scope.book_more = false;
						}

						if($scope.bookList && data.objectList.length > 0) {
							for(var i = 0; i < data.objectList.length; i++) {
								$scope.bookList.push(data.objectList[i])
							}
						} else {
							$scope.bookList = data.objectList;
						}
					});
					//设置图片高度
					$(".hold_books li").height($(".hold_books li").width()*(37/25))
				}
			})
			.fail(function() {
				console.log("error");
			})
	}
	$scope.queryBook(12, 1);
	//书本分页
	$scope.queryBookMore = function() {
		$scope.queryBook(12, pageNum_book);
	}
	//返回到首页
	$scope.returnToWin=function(){
		if(!isLogin()) {
			Toast("请先登陆", 1000);
			setCookie("previousURL", location.href);
			setTimeout("window.location.href='./LoginRegister/login.html'", 1000);
			return;
		}
		window.location.href="../index.html"
	}
	//屏幕改变事件
	window.onresize = function () {$("#myEditor").height($(window).height()-110);}
	//根据书ID 查找券

	$scope.queryJuan = function(book_Id, numPerPage, type, isSubmit,isSelf) {
		console.log(isSelf)
		isOneSelf=isSelf;
		bookId = book_Id;
		_isSubmit = isSubmit;
		//数据分页清空
		pageNum_juan=1;
		$scope.zhangFlag = false;
		$scope.addZhang = false;
		$scope.addJuan = false;
		if(type == 'book') {
			$scope.juanList = "";
			$scope.zhangList = "";
		}
		$.ajax({
				url: IP + '/createBook/queryVolume.do',
				type: 'POST',
				dataType: 'json',
				data: {
					bookId: bookId,
					numPerPage: numPerPage,
					pageNum: pageNum_juan
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function() {
						if(data.objectList.length == 12) {
							$scope.juan_more = true;
						} else {
							$scope.juan_more = false;
						}
					
						if($scope.juanList && data.objectList.length > 0) {
							for(var i = 0; i < data.objectList.length; i++) {
								$scope.juanList.push(data.objectList[i])
							}
						} else {
							$scope.juanList = data.objectList;
						}
					});
				}
			})
			.fail(function() {
				console.log("error");
			})
	}
	var loc = location.href;
	var idc = [];
	idc = loc.split("=");
	if(typeof(idc[1]) != 'undefined') {
		$scope.queryJuan(idc[1], 12, 'book', _isSubmit,isOneSelf)
	}

	//卷分页
	$scope.queryJuanMore = function() {
		pageNum_juan++;
		$scope.queryJuan(bookId, 12, 'more', _isSubmit,isOneSelf);
	}

/****
 * 新建书籍刷新
 */
	$scope.newBookRe=function(){
		if($scope.addBook&&$scope.btn_submit){
			$scope.addBook=false;
		}
		else{
			$scope.addBook=true;
		}
		$scope.bookName='';
		$scope.bookIntroduction='';
		$scope.classifyType='选择分类';
		_bookTypeCode='';
		_bigImgId='';
	
		$scope.btn_submit=true;
		$scope.btn_upDataBook=false;
		_smallImgId='';
		$("#bigImg").attr("src",'');
		$("#smallImg").attr("src",'');
		
		
	}


	/**
	 * 点击图书 
	 */

	$scope.queryJuan1 = function(booklist) {
		
		/**
		 * 初始化章节价格
		 * 若local存在值，则从local取值
		 * 若locak不存在,则设置书的默认值
		 */
		if(localStorage.chapterPrice) {
			$scope.preChapterPrice = parseInt(localStorage.chapterPrice);
		} else {
			if(booklist.chapterPrice >= 0) {
				$scope.preChapterPrice = booklist.chapterPrice;
			}
		}
     	/*****书本详情信息查询
     	 * booklist.id
     	 */
    
     	$scope.queryBookInfo(booklist.id);
     	$scope.addBook=true;
		//调用卷的查询
		  $scope.queryJuan(booklist.id, 12, 'book', booklist.isSubmit,booklist.isOnShelf);
	}
	/**
	 * 查询书的详情
	 *	id
	 */
	var _bookTypeCode; 		//修改书本详情时的书本类型code
	
	$scope.queryBookInfo=function(id){
		$scope.btn_submit=false;
		$scope.btn_upDataBook=true;
		$.ajax({
				url: IP + '/createBook/queryMyBookById.do',
				type: 'POST',
				dataType: 'json',
				data: {
					id: id,
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					$scope.$apply(function(){
						console.log(data)
						if(data.objectList){
							$scope.addBook=true;
							$scope.bookName=data.objectList[0].bookName;
							$scope.bookIntroduction=data.objectList[0].bookIntroduction;
							$scope.classifyType=data.objectList[0].bookTypes;
							_bookTypeCode=data.objectList[0].bookType[0].bookType;
							_bigImgId=data.objectList[0].bookImageId;
							_smallImgId=data.objectList[0].bookImageId2;
							$("#bigImg").attr("src",data.objectList[0].imageUrl);
							$("#smallImg").attr("src",data.objectList[0].bookImageUrlSmall)
						}
						
					})
				}
			})
	}
	//根据书ID ,券ID 查找章
	$scope.queryZhang = function(book_Id, volume_Id, numPerPage, type,isOne) {
		isOneSelf=isOne;
		bookId = book_Id;
		volumeId = volume_Id;
		$scope.zhangFlag = false;
		$scope.addZhang = false;
		$scope.addJuan = false;
		if(type == 'juan') {
			$scope.zhangList = '';
		}
		$.ajax({
				url: IP + '/createBook/queryChapterTou.do',
				type: 'POST',
				dataType: 'json',
				data: {
					bookId: bookId,
					volumeId: volumeId,
					numPerPage: numPerPage,
					pageNum: pageNum_zhang
				}
			})
			.done(function(data) {
				console.log(data)
				if(data.flag == 1) {
					if(data.objectList.length == 12) {
						$scope.zhang_more = true;
					} else {
						$scope.zhang_more = false;
					}
					$scope.$apply(function() {
						if($scope.zhangList && data.objectList.length > 0) {
							for(var i = 0; i < data.objectList.length; i++) {
								$scope.zhangList.push(data.objectList[i])
							}
						} else {
							$scope.zhangList = data.objectList;
						}
					})
				}
			})
			.fail(function() {
				console.log("error");
			})
	}
	//章节点击选择
	$scope.queryZhangClick=function(book_Id, volume_Id, numPerPage, type){
		$scope.queryZhang(book_Id, volume_Id, numPerPage, type,isOneSelf);
	}
	
	//章节分页
	$scope.queryZhangMore = function() {
		pageNum_zhang++;
		$scope.queryZhang(bookId, volumeId, 12, 'zhang',isOneSelf);
	}

	/*新建书的接口*/
	var _bookType;
	
	//大图片上传
	$("#fileInput").change(function(){
			setImagePreview('fileInput','image')
			$("#image").on("load", function() {        // 等待图片加载成功后，才进行图片的裁剪功能  
				bookimgType=1;
  				 newWriteConfig();
			}) 
			$scope.$apply(function(){
				$scope.show_screenshot=true;
			})
			
	})
	//小图片上传
	$("#fileInput2").change(function(){
		setImagePreview('fileInput2','image2')
		$("#image2").on("load", function() {// 等待图片加载成功后，才进行图片的裁剪功能
				bookimgType=0;
  				newWriteConfig2();
			})
		$scope.$apply(function(){
			$scope.show_screenshot2=true;
			})
		
	})
	


	//删除大封面图片
	$scope.deleteBigPic = function() {
		$.ajax({
				type: "post",
				url: IP + '/pic/deleteFile.do',
				dataType: 'json',
				data: {
					fileId: book_img
				}
			})
			.done(function(data) {
				if(data.code == 1) {
					$scope.$apply(function() {
						$("#bigImg").attr('src', '');
						book_img = "";
					})
				}
			})
	}
	//删除小图片
	$scope.deleteSmallPic=function(){
		$.ajax({
				type: "post",
				url: IP + '/pic/deleteFile.do',
				dataType: 'json',
				data: {
					fileId: book_smallImg
				}
			})
			.done(function(data) {
				if(data.code == 1) {
					$scope.$apply(function() {
						$("#smallImg").attr('src', '');
						book_smallImg = "";
					})
				}
			})
	}
	
	// 鼠标over事件出现叉号
	$scope.mouseOver = function() {
		if($("#bigImg").attr('src')) {
			$scope.bigCross = true;
		} else {
			$scope.bigCross = false;
		}
		if($("#smallImg").attr('src')) {
			$scope.smallCross = true;
		} else {
			$scope.smallCross = false;
		}
	}

	//鼠标leave事件移除叉号
	$scope.mouseLeave = function() {
			$scope.smallCross = false;
			$scope.bigCross = false;
		}

	//选择分类

	$scope.setClassify = function(id,name) {
		$scope.classifyModel = id;
		$scope.classifyType=name;
	}

	//新建图书
	$scope.chapterPrice = "";

	$scope.newBook = function() {
		if(isNull($scope.bookIntroduction, "请输入书籍简介")) {
			return;
		}

		if(isNull($scope.classifyModel, "请选择书本类型")) {
			return;
		}
//		if(isNull(book_img, "请选择大封面")) {
//			return;
//		}
		$scope.addBook = !$scope.addBook;
		
		$.ajax({
				url: IP + '/createBook/newWriteAddBook.do',
				type: 'POST',
				dataType: 'json',
				data: {
					bookName: $scope.bookName,
					bookIntroduction: $scope.bookIntroduction,
					authorId: userId,
					bookTypes: $scope.classifyModel,
					bookImageId: book_img,
					bookImageId2: book_smallImg
				}
			})
			.done(function(data) {
				if(data.flag = 1) {
					pageNum_book = 1;
					window.location.reload(true);
				} else {
					Toast("新建图书失败,请重新新建",1000)
				}
			})
			.fail(function() {
				console.log("error");
			})

	}

	/**
	 *新建劵 
	 */
	//点击新建券
	$scope.checkJuan = function() {
		if(isNull(bookId, "请先选择书")) {
			return;
		}
		$scope.zhangFlag = false;
		$scope.addJuan = !$scope.addJuan
	}

	//新建卷
	$scope.newJuan = function() {
		if(isNull($scope.juanName, "请输入卷名")) {
			return;
		}
		$scope.zhangFlag = false;
		$scope.addJuan = !$scope.addJuan;
		$.ajax({
				url: IP + '/createBook/newWriteAddVolume.do',
				type: 'POST',
				dataType: 'json',
				data: {
					bookId: bookId,
					volumeName: $scope.juanName,
					volumeCode: '123'
				}
			})
			.done(function(data) {
				if(data.flag == 1) {
					pageNum_juan=1;
					console.log("success");
					$scope.juanName = "";
					$scope.queryJuan(bookId, 12, 'book', _isSubmit,isOneSelf);
				}
			})
	}

	//	获取图书分类
	$.ajax({
			url: IP + '/distribute/bookDistribute.do',
			type: 'POST',
			dataType: 'json',
			data: {
				bookId: bookId,
				volumeName: $scope.juanName,
				volumeCode: '123'
			}
		})
		.done(function(data) {
			if(data.flag == 1) {
				$scope.classifyList = data.objectList;
			}
		})

	/**
	 * 章节选择
	 */
	//点击章节
	$scope.checkZhang = function() {
		if(isNull(volumeId, "请先选择卷")) {
			return;
		}
		$scope.addJuan = false;
		$scope.addZhang = !$scope.addZhang;
	}
	/**
	 *修改增加 
	 */
	//更新书籍信息
	$scope.upDataBook=function(){
		var bookCodeId =_bookTypeCode; 
		var smPicId=_smallImgId; 
		var bigPicId=_bigImgId;
		if($scope.classifyModel){
			bookCodeId=$scope.classifyModel;
		}
		if(book_img){
			bigPicId=book_img;
		}
		if(book_smallImg){
			smPicId=book_smallImg
		}
		console.log($scope.bookName+"!"+$scope.bookIntroduction+"!"+bigPicId+"!"+smPicId+"!"+bookCodeId)
		$.ajax({
			type:"post",
			url:IP + '/bookConsumer/updatebookInfo.do',
			data:{
				id:bookId,
				bookName:$scope.bookName,
				bookIntroduction:$scope.bookIntroduction,
				bookImageId:bigPicId,
				bookImageId2:smPicId,
				bookTypes:bookCodeId
			}
		})
		.done(function(data){
			if(data.flag==1){
				if(data.objectList){
					$scope.$apply(function(){
						//修改成功后
					     window.location.reload(true);
					})
				}
			}
			else{
				console.log(data.message);
			}
		})
	}
	//--------------------------------------------------------修改增加 ----------------------------------------------
	//------------删除卷－－－－－－－－－－－－－－－－－－－－－－
	$scope.deleteJuanId=function(_juanid){
		$scope.deleteJuanDialog=true;
		volumeId=_juanid;
	}
	$scope.deleteJuan=function(){
		$.ajax({
			type:"post",
			url:IP + '/createBook/deleteVolumnById.do',
			data:{
				volumnId:volumeId,
			}
		})
		.done(function(data){
			if(data.flag==1){
					$scope.$apply(function(){
						$scope.queryJuan(bookId,12,'book',_isSubmit,isOneSelf);
						$scope.queryZhang(bookId, volumeId, 12, 'juan',isOneSelf);
						$scope.deleteJuanDialog=false;
					})
			}
			else{
				console.log(data.message);
			}
		})
	}
	//------------修改卷－－－－－－－－－－－－－－－－－－－－－－
	$scope.conf = [];
	//卷的修改图标显示
	$scope.modifyJuanShow =function(index){
		$scope['modifyJuan'+index]=true;
		if(isOneSelf==1){
			$scope['deleteJuan'+index]=false;
		}
		else{
			$scope['deleteJuan'+index]=true;
		}
	}
	//卷的修改图标隐藏
	$scope.modifyJuanhide = function(index){
		$scope['modifyJuan'+index]=false;
		$scope['deleteJuan'+index]=false;
	}
	//卷input框的显示
	$scope.modifyJuanInput =function(index){
		$scope['modifyJuanInput'+index]=!$scope['modifyJuanInput'+index];
	}
	//修改卷
	$scope.upDateJuan=function(bookId,juanId,index,oldname){
		var value;
		console.log("修改卷"+bookId+"修改卷"+juanId+"index"+index);
		if(!$scope.conf[index]){
			value=oldname;
		}
		else{
			value=$scope.conf[index];
		}
		$.ajax({
			type:"post",
			url:IP + '/bookConsumer/updatevolumeName.do',
			data:{
				bookId:bookId,
				id:juanId,
				volumeName:value
			}
		})
		.done(function(data){
			if(data.flag==1){
				if(data.objectList){
					$scope.queryJuan(bookId,12,'book',_isSubmit,isOneSelf);
					$scope["modifyJuanInput"+index]=false;
					
				}
			}
			else{
				console.log(data.message);
			}
		})
	}
	//-------------删除章名-----------------------------
	 $scope.deleteZhangId=function(id){
	 	$scope.deleteZhangDialog=true;
		chapterId=id;
	 }
	 $scope.deleteZhang=function(){
	 	$.ajax({
			type:"post",
			url:IP + '/createBook/deleteChapterById.do',
			data:{
				chapterId:chapterId,
			}
		})
		.done(function(data){
			if(data.flag==1){
					$scope.$apply(function(){
						$scope.queryZhang(bookId, volumeId, 12, 'juan',isOneSelf);
						$scope.deleteZhangDialog=false;
					})
			}
			else{
				console.log(data.message);
			}
		})
	 }
	//------------修改章名－－－－－－－－－－－－－－－－－－－－－－
	$scope.confzhang = [];
	//章名的修改图标显示
	$scope.modifyZhangShow =function(index){
		$scope['modifyZhang'+index]=true;
		if(isOneSelf==1){
			
			$scope['deleteZhang'+index]=false;
		}
		else{
			$scope['deleteZhang'+index]=true;
		}
		
	}
	//章名的修改图标隐藏
	$scope.modifyZhanghide=function(index){
		$scope['modifyZhang'+index]=false;
		$scope['deleteZhang'+index]=false;
	}
	//章名input框的显示
	$scope.modifyZhangInput=function(index){
		$scope['modifyZhangInput'+index]=!$scope['modifyZhangInput'+index];
	}
	$scope.upDateZhang=function(id,index,oldname){
		var value;
		if(!$scope.confzhang[index]){
			value=oldname;
		}
		else{
			value=$scope.confzhang[index];
		}
		$.ajax({
			type:"post",
			url:IP + '/bookConsumer/updatechapterName.do',
			data:{
				bookId:bookId,
				volumeId:volumeId,
				id:id,
				chapterName:value
			}
		})
		.done(function(data){
			if(data.flag==1){
				if(data.objectList){
					$scope.queryZhang(bookId, volumeId, 12, 'juan',isOneSelf);
					$scope["modifyZhangInput"+index]=false;
					
				}
			}
			else{
				console.log(data.message);
			}
		})
	}

	//---------------------------------------------------------－－－－－－－－－－－－－－－－－－－－－－
	//新建章
	$scope.newZhang = function() {
			if(isNull($scope.zhangName, "请输入章节名")) {
				return;
			}
			$scope.addZhang = !$scope.addZhang;
			//			if($scope.isFreeRead) {
			//				$scope.isFreeRead = 1;
			//			} else {
			//				$scope.isFreeRead = 0;
			//			}
			$.ajax({
					url: IP + '/createBook/newWriteAddChapter.do',
					type: 'POST',
					dataType: 'json',
					data: {
						bookId: bookId,
						volumeId: volumeId,
						chapterName: $scope.zhangName
							//						isFreeRead: $scope.isFreeRead
					}
				})
				.done(function(data) {
					if(data.flag == 1) {
						pageNum_zhang=1;
						$scope.zhangName = "";
						$scope.queryZhang(bookId, volumeId, 12, 'juan',isOneSelf);
					}
					console.log("success");
				});
		}
		//显示章节内容
	$scope.setZhangID = function(id, name) {
			um.setContent('');
			chapterId = id;
			console.log(id)
			$scope.chapterName = name;
			chapterName = name;
			$scope.zhangFlag = true;
			$scope.addZhang = false;
			$scope.addJuan = false;
			$.ajax({
					url: IP + '/createBook/queryChapterTou.do',
					type: 'POST',
					dataType: 'json',
					data: {
						id: chapterId
					}
				})
				.done(function(data) {
					console.log(data+"YY908");
					
					if(data.flag == 1) {
						if(data.objectList[0] != null) {
							if(data.objectList[0].chapterContent != null) {
								um.setContent(data.objectList[0].chapterContent);
							}
							console.log(data.objectList[0].state + "章内容");
							
							_chapter_state = data.objectList[0].state;
							if(data.objectList[0].state == 0) {
								$scope.$apply(function() {
									$scope.pubAndFix = "修改";
									$scope.preChapterPrice = data.objectList[0].chapterPrice;
									chapterOldNumber=data.objectList[0].chapterNumber;
									if(data.objectList[0].chapterPrice == 0) {
										$scope.isFree = true;
										$scope.chapterPriceReadOnly=true;
									} else {
										$scope.isFree = false;
										$scope.chapterPriceReadOnly=false;
									}
								})
							} else {
								um.setEnabled();
								$scope.$apply(function() {
									$scope.pubAndFix = "发布";
								})
							}
						} else {
							um.setContent('欢迎参加42文库');
						}

					}
					console.log("success");
				})
				.fail(function() {
					console.log("error");
				})
		}
	//全屏事件
	um.ready(function(){
		var flag=true;
		$(".edui-btn-fullscreen").click(function(){
			$("#myEditor").height($(window).height()-110);
			if(flag){
				if($("#mainArea").hasClass('main')){
					$("#mainArea").removeClass('main')
				}
				$("#mainArea").addClass('allScreen');
				flag=!flag;
			}
			else{
				if($("#mainArea").hasClass('allScreen')){
					$("#mainArea").removeClass('allScreen')
				}
				$("#mainArea").addClass('main');
				flag=!flag;
			}
				
			})
		$("#myEditor").height($(window).height()-110);
	});
	
});
//ng-repeat的结束时间指令设计
app.directive('repeatFinish', function() {
	return {
		link: function(scope, element, attr) {
			if(scope.$last == true) {
				//分类点击效果
				$("#classifylist li").click(function() {
						$("#classifylist li").removeClass('active');
						$(this).addClass('active')
					})
					//书本点击效果
				$("#bookListClick a").click(function() {
						$("#bookListClick a").removeClass('activebook');
						$(this).addClass('activebook');
					})
					//卷点击效果
				$("#juanListCheck li .juanid").click(function() {
						$("#juanListCheck li").removeClass('active');
						$(this).parent().addClass('active');
					})
					//章点击效果
				$("#zhanglistCheck li .zhangid").click(function() {
					$("#zhanglistCheck li").removeClass('active');
					$(this).parent().addClass('active');
				})
			}

		}
	}
})

function setPrice() {
	_setPrice++;
}

function setImagePreview(fileId,images) {
        var docObj=document.getElementById(fileId);
        var imgObjPreview=document.getElementById(images);
                if(docObj.files && docObj.files[0]){
                        //火狐下，直接设img属性
                        imgObjPreview.style.display = 'block';
                        imgObjPreview.style.width = '300px';
                        //imgObjPreview.src = docObj.files[0].getAsDataURL();
		
      			//火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式  
       			 imgObjPreview.src = window.URL.createObjectURL(docObj.files[0]);

                }else{
                        //IE下，使用滤镜
                        docObj.select();
                        var imgSrc = document.selection.createRange().text;
                        var localImagId = document.getElementById("localImag");
                        //必须设置初始大小
                        localImagId.style.width = "300px";
                        //图片异常的捕捉，防止用户修改后缀来伪造图片
				try{
                                localImagId.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                                localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
                        }catch(e){
                                console.log("您上传的图片格式不正确，请重新选择!");
                                return false;
                        }
                        imgObjPreview.style.display = 'none';
                        document.selection.empty();
                }
                return true;
        }
