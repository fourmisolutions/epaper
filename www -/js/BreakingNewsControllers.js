var app = angular.module('epaper.breakingNewsControllers', []);

app.controller('BreakingNewsListController', ['$scope', 'ePaperService', '$state', function($scope, ePaperService, $state) {
    $scope.breaking_news_number = 0;
    $scope.news = [];
    $scope.getBreakingNews = function(){
        ePaperService.getBreakingNews()
            .then(function(news) {
                $scope.news = news;
            }, function (error) {
                $scope.status = 'Unable to load breaking news data: ' + error.message;
            });
        }
    $scope.getBreakingNews();
    $scope.clickBreakingNews = function(index) {
      $state.go('app.news', {news: $scope.news[index]});    
    };
}]);


app.controller('BreakingNewsController', function($scope, $stateParams) {
    var news = $stateParams.news;
    var tCtrl = this;

    this.onLoad = function (pag) {
    };

    this.onError = function (err) {
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
});