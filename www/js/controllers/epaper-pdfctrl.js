angular.module('epaper.controllers')
.controller('PdfCtrl', ['$scope', '$stateParams', '$ionicLoading','ePaperService','$ionicPopup','$timeout', 'GaService', 'GaConstants', '$ionicPopup', '$state','$ionicHistory','User', 
    function($scope, $stateParams, $ionicLoading, ePaperService, $ionicPopup, $timeout, GaService, GaConstants, $ionicPopup, $state, $ionicHistory, User) {	
	//TODO - Should do at router
    if(!User.isLoggedIn()) {    
        $ionicPopup.alert({
            title: '会员区域',
            content: '<h3 style="text-align: center">会员请先登入</h3>'
        });
        var redirectUrl = $ionicHistory.currentView().url;
        $ionicHistory.currentView($ionicHistory.backView());
        $state.go('app.login', {'redirectUrl': redirectUrl}, {location: 'replace'});
        return;
    }
    
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		GaService.trackView(GaConstants.scrnNameSeeHuaEpaper);
	});
	
	var news = {};
	ePaperService.getNews($stateParams.categoryId, $stateParams.pageNo).then(function(result) { 
	    news = result; 
    }, function(reason) { 
        console.error('Error: ' + reason); 
    });
	
    var tCtrl = this;
    tCtrl.onLoad = function (pag) {
		$ionicLoading.hide();
    };

    tCtrl.onError = function (err) {
        $ionicLoading.hide();
        
        var alertPopup;
        
        // handle access control status codes returned from api server
        // - status: 403 Forbidden
        if (err.status === 403) {
            alertPopup = $ionicPopup.alert({
                title: '会员区域',
                content: '<h3 style="text-align: center">会员请先登入</h3>'
            });
            
        } else {
            console.error('Error: ' + JSON.stringify(err));
            
            // unhandled error status
//            alertPopup = $ionicPopup.alert({
//                title: 'Unexpected Error',
//                content: err.message
//            });
        }
        
		if (alertPopup != undefined) {
            // go back previous screen
    		alertPopup.then(function(res) { $state.go('app.tabs', {categoryId : news.category}); });
		}
    };
    var total = 1.2 * 1024 * 1024; //always assume 1.2 mb for the pdf
    tCtrl.onProgress = function (progress) {
        var percentage = Math.floor(progress.loaded/total * 100);
        if(percentage >= 100) {
            percentage = 99;
        }
        $ionicLoading.show({
		  template: '<ion-spinner></ion-spinner><span>Loading ' + percentage + '%</span>'
		});
    };
    tCtrl.onPageRender = function (page) {
    };
    
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
    }, 500);


}]);

