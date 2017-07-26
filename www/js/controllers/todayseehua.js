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

app.controller('TodayShController', ['$scope', '$stateParams', '$timeout', 'ePaperService', '$interval', 'ePaperService', 'GaService', 'GaConstants', '$cordovaSocialSharing',
    function($scope, $stateParams, $timeout, ePaperService, $interval, ePaperService, GaService, GaConstants, $cordovaSocialSharing) {
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		GaService.trackView(GaConstants.scrnNameTodaySeeHua);
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
	
	$scope.images = news.image;
	
	
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
	
	
	$scope.shareAnywhere = function() {
        var message = $scope.description;
		var subject = $scope.description;
		var image =  $scope.images;
		var link = 'http://www.test.com';
		//var link = "";	
		
		$cordovaSocialSharing
		.share(message, subject, image, link) // Share via native share sheet
		.then(function(result) {
		  // Success!
		  console.log("Sharing success.");
		}, function(err) {
		  // An error occured. Show a message to the user
		  console.log("Sharing fail.");
		});
	}
	
	
	
	/*$scope.shareViaFacebook = function() {	
		var message = $scope.description;
		var image =  $scope.images;
		var link = 'http://www.test.com';
		//var link = "";		
	
		$cordovaSocialSharing
		.shareViaFacebook(message, image, link)
		.then(function(result) {
		  // Success!
		  console.log("Facebook sharing success.");
		}, function(err) {
		  // An error occurred. Show a message to the user
		  console.log("Facebook sharing failure.");
		});
		
		$cordovaSocialSharing
		.canShareVia("Facebook", message, image, link)
		.then(function(result) {
		  // Success!
		  console.log("Facebook sharing success.");
		}, function(err) {
		  // An error occurred. Show a message to the user
		  console.log("Facebook sharing failure.");
		});
		
		
	}*/
	
	/*$scope.shareViaWhatsapp = function() {	
		var message = $scope.description;
		var image =  $scope.images;
		var link = 'http://www.test.com';
		//var link = "";
		
		$cordovaSocialSharing
		.shareViaWhatsApp(message, image, link)
		.then(function(result) {
		  // Success!
		  console.log("Whatsapp sharing success.");
		}, function(err) {
		  // An error occurred. Show a message to the user
		  console.log("Whatsapp sharing failure.");
		});
	}
		
	$scope.shareViaTwitter = function() {	
		var message = $scope.description;
		var image =  $scope.images;
		var link = 'http://www.test.com';
		//var link = "";
		
		$cordovaSocialSharing
		.shareViaTwitter(message, image, link)
		.then(function(result) {
		  // Success!
		  console.log("Twitter sharing success.");
		}, function(err) {
		  // An error occurred. Show a message to the user
		  console.log("Twitter sharing failure.");
		});		
		
	}*/
    
}]);