var app = angular.module('epaper.todayShControllers', ['ionic']);

app.controller('TodayShListController', ['$scope', 'ePaperService', '$state', '$rootScope', '$timeout','$interval',
    function($scope, ePaperService, $state, $rootScope, $timeout, $interval) {
        
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
	
        ePaperService.getTodayShNews().then(function(news) {
            $scope.news = news;
        }, function (error) {
        });
        
        $scope.clickTodayShNews = function(index) {
          $state.go('app.todayseehua', {news: $scope.news[index]});    
        };
}]);

app.controller('TodayShController', ['$scope', '$stateParams', '$timeout', 'ePaperService', '$interval',
    function($scope, $stateParams, $timeout, ePaperService, $interval) {
	
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
	
    var news = $stateParams.news;
    var tCtrl = this;

    this.onLoad = function (pag) {
    };

    this.onError = function (err) {
    };

    this.onProgress = function (progress) {
    };

    this.onPageRender = function (page) {
		
    };

    $scope.title = news.title;
    $scope.description = news.description;
	$scope.content = news.content;
	$scope.imageURLs = [];
	
	
	if (news.imageURL.indexOf(',') >= 0)
	{
		var imageURL_local = news.imageURL.split(',');
		$scope.imageUrl = imageURL_local[0]; 
		$scope.imageURLs = imageURL_local.slice(1,imageURL_local.length);

	}
	else
	{
		$scope.imageUrl = news.imageURL;
	}
	
    $timeout(function() {
        $scope.options = {
            pdfUrl: news.pdfURL,
            onLoad: tCtrl.onLoad,
            onProgress: tCtrl.onProgress,
            onError: tCtrl.onError,
            onPageRender: tCtrl.onPageRender,
            httpHeaders: [],
            pinchin: false
        };
    }, 1000);
    
}]);