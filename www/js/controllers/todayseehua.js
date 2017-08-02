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

app.controller('TodayShController', ['$scope', '$stateParams', '$timeout', 'ePaperService', '$interval', 'ePaperService', 'GaService', 'GaConstants', 'ShApiConstants', '$cordovaFileTransfer', '$cordovaFileOpener2',
    function($scope, $stateParams, $timeout, ePaperService, $interval, ePaperService, GaService, GaConstants, ShApiConstants, $cordovaFileTransfer, $cordovaFileOpener2) {

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
    
    // show download button only if not run on browser
    $scope.allowOpen = false;
    if (!ShApiConstants.useProxy) {
        $scope.allowOpen = true; 
    }
    
    // Download and Open using device installed app
    // - works only in actual devices
    $scope.openPdf = function() {
        // download the target file
        var url = $scope.pdfUrl;
        
        var tempFileName = url.split('/').pop();
        //console.log('tempFileName=' + tempFileName);
        if (tempFileName.indexOf('?') >= 0) {
            tempFileName = tempFileName.substring(0, tempFileName.indexOf('?'));
            //console.log('tempFileName=' + tempFileName);
        }
        
        // tested on Android: unable to trigger native app if using cordova.file.cacheDirectory
        var targetPath = cordova.file.dataDirectory + tempFileName;
        var trustHosts = true;
        var options = {};

        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
        .then(function(result) {
            // Success!
            //console.log('Download success: ' + JSON.stringify(result));
            
            // open the downloaded file
            $cordovaFileOpener2.open(
                    targetPath, // You can also use a Cordova-style file uri: cdvfile://localhost/persistent/Download/starwars.pdf
                    'application/pdf', 
                    { 
                        error : function(e) { 
                            console.log('Error status: ' + e.status + ' - Error message: ' + e.message);
                        },
                        success : function () {
                            //console.log('file opened successfully');                
                        }
                    }
            );
            
        }, function(err) {
            // Error
            console.error('Download error: ' + JSON.stringify(err));
        }, function (progress) {
            $timeout(function () {
                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
            });
        });
    };

}]);