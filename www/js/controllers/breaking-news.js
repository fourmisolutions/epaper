var app = angular.module('epaper.breakingNewsControllers', ['ionic']);

app.controller('BreakingNewsListController', ['$scope', 'ePaperService', '$state', '$rootScope',
    function($scope, ePaperService, $state, $rootScope) {
        
        ePaperService.getBreakingNews().then(function(news) {
            $scope.news = news;
            $rootScope.$broadcast('onBreakingNewsUpdate');
            ePaperService.setBreakingNewsCount(0);
        }, function (error) {
        });
        
        $scope.clickBreakingNews = function(index) {
          $state.go('app.news', {news: $scope.news[index]});    
        };
}]);

app.controller('BreakingNewsController', ['$scope', '$stateParams', '$timeout', 'ePaperService', 'GaService', 'GaConstants',
	function($scope, $stateParams, $timeout, ePaperService, GaService, GaConstants) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		GaService.trackView(GaConstants.scrnNameBreakingNews);
	});
	
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
	$scope.description = news.summary;
	$scope.content = news.content;
	$scope.imageURLs = [];


	if (news.image.indexOf(',') >= 0)
	{
		var imageURL_local = news.image.split(',');
		$scope.imageUrl = imageURL_local[0]; 
		$scope.imageURLs = imageURL_local.slice(1,imageURL_local.length);

	}
	else
	{
		$scope.imageUrl = news.image;
	}

	$scope.pdfUrl = news.pdf;
	if (news.pdf) {
	    $timeout(function() {
    		$scope.options = {
    				pdfUrl: ePaperService.constructApiUrl(news.pdf),
    				onLoad: tCtrl.onLoad,
    				onProgress: tCtrl.onProgress,
    				onError: tCtrl.onError,
    				onPageRender: tCtrl.onPageRender,
    				httpHeaders: [],
    				pinchin: false
    		};
    	}, 1000);
	} else {
	    //console.log('news.pdf is undefined or empty');
	}

}]);