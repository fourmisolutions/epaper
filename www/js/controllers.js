var app = angular.module('epaper.controllers', []);
const pageSize = 4; 
function getTabs(categories) {
    var tabs = [];
    if(categories == undefined) {
        return;
    };
    for(var j=0;j < categories.getTotal();j++){
        var category = categories.getCategory(j);
        for(var pageNo = 0 ; pageNo < category.getNoOfPages(pageSize); pageNo++)
        {
            var categoryPageNo = categories.getPageNo(j, pageNo, pageSize);
            var news = category.getNewsStartFrom(pageNo, pageSize);
            var tab = {"categoryId": category.categoryId, "text": category.categoryId + category.getStart(pageNo, pageSize) + "-" + category.categoryId + category.getEnd(pageNo, pageSize), news: news};
            tabs.push(tab);
        }
		
    }
    return tabs;
}
app.controller("MenuCtrl", ["$scope","ePaperService", "$ionicSlideBoxDelegate", 
	function($scope, ePaperService, $ionicSlideBoxDelegate){
		ePaperService.getCategories().then(function(categories){
			$scope.tabs = getTabs(categories);
		});
		$scope.goTo = function(index){
			var handle = $ionicSlideBoxDelegate.$getByHandle('ThumbnailTab');
			$ionicSlideBoxDelegate.slide(index);
		}
}]);

app.controller("TabsCtrl", ['$scope','$state','categories', '$ionicScrollDelegate',
    function( $scope, $state, categories, $ionicScrollDelegate){
        $scope.tabs = getTabs(categories);
        $scope.clickThumbnail = function(categoryId, pageNo) {
            $state.go('app.detail', {categoryId: categoryId, pageNo:pageNo});    
        };
        $scope.goTo = function(index){
            console.log(index);
            var handle = $ionicSlideBoxDelegate.$getByHandle('ThumbnailTab');
            $ionicSlideBoxDelegate.slide(index)
        }
        $scope.loadBreakingNews = function() {
            $state.go("app.breakingnews");
        }
        

    }
]);

app.controller('PdfCtrl', ['$scope', '$stateParams', '$ionicLoading','ePaperService','news','$ionicPopup','$timeout',
    function($scope, $stateParams, $ionicLoading, ePaperService, news, $ionicPopup, $timeout) {	
	var scope = $scope;
    var tCtrl = this;
    this.onLoad = function (pag) {
		$ionicLoading.hide();
    };

    this.onError = function (err) {
		$ionicLoading.hide();
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
            pdfUrl: news.pdfURL,
            onLoad: tCtrl.onLoad,
            onProgress: tCtrl.onProgress,
            onError: tCtrl.onError,
            onPageRender: tCtrl.onPageRender,
            httpHeaders: [],
            pinchin: false
        };
    }, 500);


}]);
app.controller("AppCtrl", ["$scope", 
	function($scope){

		
}]);


app.controller("MainCtrl", ['$rootScope', "$scope", "$stateParams", "$q", "$location", "$window", '$timeout', '$ionicScrollDelegate',
    function($rootScope, $scope, $stateParams, $q, $location, $window, $timeout, $ionicScrollDelegate) {
        $scope.scrollTo = function(target){
            $location.hash(target);   //set the location hash
            var handle = $ionicScrollDelegate.$getByHandle('myPageDelegate');
            handle.anchorScroll(true);  // 'true' for animation
        };
    }]);
