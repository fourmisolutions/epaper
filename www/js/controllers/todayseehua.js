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

app.controller('TodayShController', ['$scope', '$stateParams', '$timeout', 'ePaperService', '$interval', 'ePaperService', 'GaService', 'GaConstants','$cordovaSocialSharing',
    function($scope, $stateParams, $timeout, ePaperService, $interval, ePaperService, GaService, GaConstants, $cordovaSocialSharing) {

    $scope.$on("$ionicView.beforeEnter", function(event, data){
        GaService.trackView(GaConstants.scrnNameTodaySeeHua);
    });

    var news = $stateParams.news;
    var tCtrl = this;
    
    tCtrl.onLoad = function (pag) {
        //console.log('onLoad');
        
        // call service function to pre-download PDF contents of the same category
        // current design: process preload of the rest of the news pdf only after current selected news pdf is finished downloaded
        try { ePaperService.preDownloadTodayShPdf(news.category); }
        catch (err) { console.error('Error: ' + err); }
    };

    tCtrl.onError = function (err) {
        //console.log('onError');
    };

    tCtrl.onProgress = function (progress) {
        //console.log('onProgress');
    };

    tCtrl.onPageRender = function (page) {
        //console.log('onPageRender');
        $scope.$apply(tCtrl.showSpinner = false);
    };

    tCtrl.title = news.title;
    tCtrl.description = news.summary;
    tCtrl.content = news.content;
    tCtrl.imageURLs = [];
    tCtrl.images = news.image;
    
    if (news.image.indexOf(',') >= 0)
    {
        var imageURL_local = news.image.split(',');
        tCtrl.imageUrl = imageURL_local[0]; 
        tCtrl.imageURLs = imageURL_local.slice(1,imageURL_local.length);

    }
    else
    {
        tCtrl.imageUrl = news.image;
    }
    
    tCtrl.shareAnywhere = function() {
        var message = news.summary + "\n" + news.content;
		var subject = news.title;
		var image =  tCtrl.imageUrl;
		var link = news.pdf;
		//var link = "";	
		
		$cordovaSocialSharing
		.share(message, subject, image, link) // Share via native share sheet
		.then(function(result) {
		  // Success!
		  //console.log("Sharing success.");
		}, function(err) {
		  // An error occured. Show a message to the user
		  //console.log("Sharing fail.");
		});
	}

    tCtrl.pdfUrl = news.pdf;
    if (tCtrl.pdfUrl) {
        ePaperService.pushIntoTodayShPdfHistory(tCtrl.pdfUrl);
        
        $timeout(function() {
            tCtrl.options = {
                    pdfUrl: ePaperService.constructApiUrl(tCtrl.pdfUrl),
                    onLoad: tCtrl.onLoad,
                    onProgress: tCtrl.onProgress,
                    onError: tCtrl.onError,
                    onPageRender: tCtrl.onPageRender,
                    httpHeaders: [],
                    pinchin: false
            };
            
            $scope.$apply(tCtrl.showSpinner = true); 
            
        }, 1000);
    } else {
        //console.log('news.pdf is undefined or empty');
    }

}]);