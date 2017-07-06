var app = angular.module("myApp",[]);     
app.controller("pagination_ctrl",function($scope,$http,$location){  
    //配置  
    $scope.count = 0;  
    $scope.p_pernum = 10;  
    //变量  
    $scope.p_current = 1;  
    $scope.p_all_page =100;  
    $scope.pages = [1,2,3,4,5,6,7];  
    //初始化第一页  
    
    //获取数据  
   
    //单选按钮选中  
    $scope.select= function(id){  
        alert(id);  
    }  
    //首页  
    $scope.p_index = function(){  
        $scope.load_page(1);  
    }  
    //尾页  
    $scope.p_last = function(){  
        $scope.load_page($scope.p_all_page);  
    }  
    //加载某一页  
    $scope.load_page = function(page){
    	alert(page)
    	$scope.p_current=page;
    };  
    //初始化页码  
    var reloadPno = function(){  
          $scope.pages=calculateIndexes($scope.p_current,$scope.p_all_page,8);  
        };  
//分页算法  
var calculateIndexes = function (current, length, displayLength) {  
   var indexes = [];  
   var start = Math.round(current - displayLength / 2);  
   var end = Math.round(current + displayLength / 2);  
    if (start <= 1) {  
        start = 1;  
        end = start + displayLength - 1;  
       if (end >= length - 1) {  
           end = length - 1;  
        }  
    }  
    if (end >= length - 1) {  
       end = length;  
        start = end - displayLength + 1;  
       if (start <= 1) {  
           start = 1;  
        }  
    }  
    for (var i = start; i <= end; i++) {  
        indexes.push(i);  
    }  
    return indexes;  
  };  
   
});  

