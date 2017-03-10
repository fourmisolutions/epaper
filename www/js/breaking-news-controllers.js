var app = angular.module('epaper.breakingNewsControllers', ['ionic']);

app.controller('BreakingNewsListController', ['$scope', 'ePaperService', '$state',
    function($scope, ePaperService, $state) {
    ePaperService.getBreakingNews().then(function(news) {
        $scope.news = news;
    }, function (error) {
    });
    
    $scope.clickBreakingNews = function(index) {
      $state.go('app.news', {news: $scope.news[index]});    
    };
}]);


app.controller('BreakingNewsController', ['$scope', '$stateParams', '$ionicLoading',
    function($scope, $stateParams, $ionicLoading) {
    
    $scope.pdfLoaded = false;
    
    var news = $stateParams.news;
    var tCtrl = this;

    this.onLoad = function (pag) {
        var element = document.getElementById("loading-spinner");
        element.parentNode.removeChild(element);
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
			//for(var i=1;i<imageURLs.length;i++)
			//$scope.imageURLs = imageURLs[i];		
	}
	else
	{
		$scope.imageUrl = news.imageUrl;
	}
	
	
    $scope.pdfURL = news.pdfURL;
    $scope.options = {
        pdfUrl: news.pdfURL,
        onLoad: tCtrl.onLoad,
        onProgress: tCtrl.onProgress,
        onError: tCtrl.onError,
        onPageRender: tCtrl.onPageRender,
        httpHeaders: [],
        pinchin: true
    };
}]);