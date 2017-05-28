var app = angular.module('epaper.breakingNewsControllers', ['ionic']);

app.controller('BreakingNewsListController', ['$scope', 'ePaperService', '$state', '$rootScope', '$ionicPlatform',
    function($scope, ePaperService, $state, $rootScope, $ionicPlatform) {
        
        ePaperService.getBreakingNews().then(function(news) {
            $scope.news = news;
            $rootScope.$broadcast('onBreakingNewsUpdate');
            ePaperService.setBreakingNewsCount(0);
        }, function (error) {
        });
        
        $scope.clickBreakingNews = function(index) {
          $state.go('app.news', {news: $scope.news[index]});    
        };

        $ionicPlatform.ready(function() {
	        $scope.$on("$ionicView.beforeEnter", function(){
	            ComScorePlugin.notifyScreenView("Breaking News");
	        });
        });
}]);

app.controller('BreakingNewsController', ['$scope', '$stateParams', '$timeout', '$ionicPlatform',
    function($scope, $stateParams, $timeout, $ionicPlatform) {

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

    $ionicPlatform.ready(function() {
        $scope.$on("$ionicView.beforeEnter", function(){
            ComScorePlugin.notifyScreenView("Breaking News");
        });
    });
    
}]);