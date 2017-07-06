var app = angular.module('write', []);
app.controller('writeControl', function($scope){
	/*统计字数*/
	var count=0
	$scope.wordCount =function(){
		var wordNumber= document.getElementById('content').innerText.length;		
		$scope.wordNumber=wordNumber;
	}
	/*新建书名，封面*/
	$scope.saveBook=function(){
		var bookName  	= $scope.bookName;
		var bookProfile = $scope.bookProfile;
		var bookPic 	= $scope.bookPic;
		$scope.addBook=!$scope.addBook;
	}
	/*新建券*/
	$scope.saveJuan=function(){
		var juanName = $scope.JuanName;
		$scope.addJuan=!$scope.addJuan;
	}
	/*新建章*/
	$scope.saveZhang=function(){
		var zhangName=$scope.zhangName;
		$scope.addZhang=!$scope.addZhang;
	}

	/*书的列表*/
	$scope.bookList=[
		{	"bookName":123,"id":1},
		{	"bookName":'哈哈哈',"id":2}
	
	]
	/*券的列表*/
	$scope.juanList=[
		{	"juanName":123,"id":1},
		{	"juanName":'哈哈哈',"id":2}
	
	]
	/*章的列表*/
	$scope.zhangList=[
		{	"zhangName":123,"id":1},
		{	"zhangName":'哈哈哈',"id":2}
	]
	/*显示对应的卷*/
	$scope.showJuan=function(bookId){
		$scope.bookCurrentId=bookId;
		console.log(bookId);
	}
	/*显示对应的章*/
	$scope.showZhang=function(juanId){
		$scope.juanCurrentId=juanId;
	}
	/*显示对应的内容*/
	$scope.showContent=function(zhangId){
		$scope.zhangCurrentId=zhangId;
	}

	$scope.test=function(){
		console.log($scope.content);
	}
})
