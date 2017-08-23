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

app.controller('BreakingNewsController', ['$scope', '$stateParams', '$timeout', 'ePaperService', 'GaService', 'GaConstants','$cordovaSocialSharing',
	function($scope, $stateParams, $timeout, ePaperService, GaService, GaConstants, $cordovaSocialSharing) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		GaService.trackView(GaConstants.scrnNameBreakingNews);
	});
	
	var news = $stateParams.news;
	var tCtrl = this;

	tCtrl.onLoad = function (pag) {
	};

	tCtrl.onError = function (err) {
	};

	tCtrl.onProgress = function (progress) {
	};

	tCtrl.onPageRender = function (page) {
        $scope.$apply(tCtrl.showSpinner = false);
	};

	tCtrl.title = news.title;
	tCtrl.description = news.summary;
	tCtrl.content = news.content;
	tCtrl.imageURLs = [];


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
	if (news.pdf) {
	    $timeout(function() {
    		tCtrl.options = {
    				pdfUrl: ePaperService.constructApiUrl(news.pdf),
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