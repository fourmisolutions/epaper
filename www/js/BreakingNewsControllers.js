var app = angular.module('epaper.breakingNewsControllers', ['ionic']);

app.controller('BreakingNewsListController', ['$scope', 'ePaperService', '$state', '$window',
    function($scope, ePaperService, $state, $window) {

    $scope.breaking_news_number = 0;
    $scope.news = [];
	
	if($window.localStorage.getItem("breakingnews") == null) {
    $scope.getBreakingNews = function(){
        ePaperService.getBreakingNews()
            .then(function(response) {
                $scope.news = response;
				$window.localStorage.setItem("breakingnews",JSON.stringify(response));
            }, function (error) {
                $scope.status = 'Unable to load breaking news data: ' + error.message;
            });
        }
    $scope.getBreakingNews();
	}
	else
	{
		$scope.news = JSON.parse($window.localStorage.getItem("breakingnews"));
		console.log($scope.news);
	}
	
    $scope.clickBreakingNews = function(index) {
      $state.go('app.news', {news: $scope.news[index]});    
    };
}]);


app.controller('BreakingNewsController', ['$scope', '$stateParams', '$ionicLoading',
    function($scope, $stateParams, $ionicLoading) {

    var news = $stateParams.news;
    var tCtrl = this;

    this.onLoad = function (pag) {
		$ionicLoading.show({
		  template: '<ion-spinner></ion-spinner> News Loading...',
		  duration: 5000
		}).then(function(){
		   console.log("The loading indicator is now displayed");
		});
    };

    this.onError = function (err) {
		$ionicLoading.hide().then(function(){
		   console.log("The loading indicator is now hidden");
		});
		
		$ionicLoading.hide();
    };

    this.onProgress = function (progress) {
    };

    this.onRenderPage = function (page) {
		
    };

    $scope.title = news.title;
    $scope.description = news.description;
    $scope.imageUrl = news.imageURL;     
    $scope.pdfURL = news.pdfURL;
    $scope.options = {
        pdfUrl: news.pdfURL,
        onLoad: tCtrl.onLoad,
        onProgress: tCtrl.onProgress,
        onError: tCtrl.onError,
        onRenderPage: tCtrl.onRenderPage,
        httpHeaders: []
    };


}]);