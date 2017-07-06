//尾部图片数据
app.controller("footerControll",function($scope, $http){
	$scope.footerShow=function(){
		$.ajax({
			type:"post",
			url: IP + '/homePage/bookCarousel.do',
			async:true,
			data:{
				imageLocation:1
			}			
		})
		.done(function(data){
			if(data.flag==1){
				$scope.$apply(function(){
					$scope.footerList=data.objectList;
				})
			}
		})	
		//微博图片位置
		$.ajax({
			type:"post",
			url: IP + '/homePage/bookCarousel.do',
			async:true,
			data:{
				imageLocation:2
			}			
		})
		.done(function(data){
			if(data.flag==1){
				$scope.$apply(function(){
					if(data.objectList[0]){
						$scope.QRcode=data.objectList[0].imageUrl;
					}
				})
			}
		})
	}
})
