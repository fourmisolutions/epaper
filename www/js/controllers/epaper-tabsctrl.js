const pageSize = 4; 

function getTabsByCategory(categories, cat) { //version 1.1
    var tabs = [];
    if(categories == undefined) {
        return;
    };	

    for(var j=0;j < categories.getTotal();j++){
        var category = categories.getCategory(j);
		
		if(category.categoryId == cat) {
		
			for(var pageNo = 0 ; pageNo < category.getNoOfPages(pageSize); pageNo++)
			{
				var categoryPageNo = categories.getPageNo(j, pageNo, pageSize);
				var news = category.getNewsStartFrom(pageNo, pageSize);
				//var tab = {"categoryId": category.categoryId, "text": category.categoryId + category.getStart(pageNo, pageSize) + "-" + category.categoryId + category.getEnd(pageNo, pageSize), news: news};
				//version 1.1
				var tab = {"categoryId": category.categoryId, "text": category.getCategoryDesc(), news: news, "pageIndex": category.getStart(pageNo, pageSize), "pageNoText": category.getStart(pageNo, pageSize) + "-" + category.getEnd(pageNo, pageSize)};			
				tabs.push(tab);
			}	
		}		
    }
	
    return tabs;
}

function getTabs(categories) { 
    var tabs = [];
    if(categories == undefined) {
        return;
    };	

    for(var j=0;j < categories.getTotal();j++){
        var category = categories.getCategory(j);	
		
			for(var pageNo = 0 ; pageNo < category.getNoOfPages(pageSize); pageNo++)
			{
				var categoryPageNo = categories.getPageNo(j, pageNo, pageSize);
				var news = category.getNewsStartFrom(pageNo, pageSize);
				//var tab = {"categoryId": category.categoryId, "text": category.categoryId + category.getStart(pageNo, pageSize) + "-" + category.categoryId + category.getEnd(pageNo, pageSize), news: news};
				//version 1.1
				var tab = {"categoryId": category.categoryId, "text": category.getCategoryDesc(), news: news};			
				tabs.push(tab);
			}	
			
    }
	
    return tabs;
}

angular.module('epaper.controllers')
.controller("TabsCtrl", ['$scope','$state', '$ionicScrollDelegate','$timeout','ePaperService','$interval', '$stateParams', 'categories', '$ionicSlideBoxDelegate',
    function( $scope, $state, $ionicScrollDelegate, $timeout, ePaperService, $interval, $stateParams, categories, $ionicSlideBoxDelegate){
        $scope.breakingNewsCount = ePaperService.getBreakingNewsCount();
        $scope.$on('onBreakingNewsUpdate',function(){
            $timeout(function() {
                $scope.breakingNewsCount = ePaperService.getBreakingNewsCount();
                $scope.$apply();
            });
        });
        $interval(function() {
            $scope.breakingNewsCount = ePaperService.getBreakingNewsCount();
        }, 10000);
        
		$scope.tabs = getTabsByCategory(categories, $stateParams.categoryId);		
	
		$scope.clickThumbnail = function(categoryId, pageNo) {
            $state.go('app.detail', {categoryId: categoryId, pageNo:pageNo});    
        };
        $scope.goTo = function(index){
            var handle = $ionicSlideBoxDelegate.$getByHandle('ThumbnailTab');
            $ionicSlideBoxDelegate.slide(index);
        }
        $scope.loadBreakingNews = function() {
            $state.go("app.breakingnews");
        }
        

    }
]);
