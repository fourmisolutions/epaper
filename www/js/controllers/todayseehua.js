var app = angular.module('epaper.todayShControllers', ['ionic']);

app.controller('TodayShListController', ['$scope', 'ePaperService', '$state', '$rootScope', '$timeout','$interval', '$stateParams', 
    function($scope, ePaperService, $state, $rootScope, $timeout, $interval, $stateParams) {

    ePaperService.getTodayShNews($stateParams.categoryId).then(function(news) {
        $scope.news = news;
    }, function (error) {
    });

    $scope.clickTodayShNews = function(index) {
        $state.go('app.todayseehua', 
                {news: $scope.news[index], categoryId: $stateParams.categoryId, index: index});
    };
}]);

app.controller('TodayShController', ['$scope', '$stateParams', '$timeout', 'ePaperService', '$interval', 'ePaperService', 'GaService', 'GaConstants',
    function($scope, $stateParams, $timeout, ePaperService, $interval, ePaperService, GaService, GaConstants) {

    $scope.$on("$ionicView.beforeEnter", function(event, data){
        GaService.trackView(GaConstants.scrnNameTodaySeeHua);
    });

    var news = $stateParams.news;
    var tCtrl = this;
    
    this.onLoad = function (pag) {
        // call service function to pre-download PDF contents of the same category
        // current design: process preload of the rest of the news pdf only after current selected news pdf is finished downloaded
        try { ePaperService.preDownloadTodayShPdf(news.category); }
        catch (err) { console.error('Error: ' + err); }
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
    if ($scope.pdfUrl) {
        ePaperService.pushIntoTodayShPdfHistory($scope.pdfUrl);
        
        $timeout(function() {
            $scope.options = {
                    pdfUrl: ePaperService.constructApiUrl($scope.pdfUrl),
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