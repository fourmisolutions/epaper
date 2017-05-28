angular.module('epaper.controllers')
.controller("MenuCtrl", ["$scope","ePaperService", "$ionicSlideBoxDelegate", "$rootScope", "$state", '$timeout','$interval', '$ionicPlatform',
	function($scope, ePaperService, $ionicSlideBoxDelegate, $rootScope, $state, $timeout, $interval, $ionicPlatform){
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
		ePaperService.getCategories().then(function(categories){
			//version 1.1		
            var tabs = [];
            for(var j=0;j < categories.getTotal();j++){
                var category = categories.getCategory(j);	
                var tab = {"categoryId": category.categoryId, "text": category.getCategoryDesc()};			
				tabs.push(tab);
            }
			$scope.tabs = tabs;
			//end of version 1.1
		});
		
		/*$scope.goTo = function(index){
			var handle = $ionicSlideBoxDelegate.$getByHandle('ThumbnailTab');
			$ionicSlideBoxDelegate.slide(index);
		}*/
		
		//version 1.1
		$scope.goTo = function(categoryId){
			//load tabs of the category
			$timeout(function() {
				$state.go("app.tabs", {"categoryId": categoryId});
				//$state.$apply();
            });
			
		};
		
		$ionicPlatform.ready(function() {
			$scope.$on("$ionicView.beforeEnter", function(){
	            ComScorePlugin.notifyScreenView("Daily News");
	        });
		});
		
}]);
