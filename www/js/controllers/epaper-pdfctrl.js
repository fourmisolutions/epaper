angular.module('epaper.controllers')
.controller('PdfCtrl', ['$scope', '$stateParams', '$ionicLoading','ePaperService','news','$ionicPopup','$timeout', 'GaService', 'GaConstants', '$ionicPopup', '$state',
    function($scope, $stateParams, $ionicLoading, ePaperService, news, $ionicPopup, $timeout, GaService, GaConstants, $ionicPopup, $state) {	
	
	$scope.$on("$ionicView.beforeEnter", function(event, data){
		GaService.trackView(GaConstants.scrnNameSeeHuaEpaper);
	});
	
	var scope = $scope;
    var tCtrl = this;
    this.onLoad = function (pag) {
		$ionicLoading.hide();
    };

    this.onError = function (err) {
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
    this.onProgress = function (progress) {
        var percentage = Math.floor(progress.loaded/total * 100);
        if(percentage >= 100) {
            percentage = 99;
        }
        $ionicLoading.show({
		  template: '<ion-spinner></ion-spinner><span>Loading ' + percentage + '%</span>'
		});
    };
    this.onPageRender = function (page) {
    };
    
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
    }, 500);


}]);

