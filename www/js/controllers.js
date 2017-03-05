var app = angular.module('epaper.controllers', []);
const pageSize = 4; 
function getTabs(categories) {
    var tabs = []
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
	console.log(tabs);
    return tabs;
}
app.controller("MenuCtrl", ["$scope","ePaperService", "$ionicSlideBoxDelegate", 
	function($scope, ePaperService, $ionicSlideBoxDelegate){
		ePaperService.getCategories().then(function(categories){
			console.log(categories);
			$scope.tabs = getTabs(categories);
			console.log($scope.tabs);		
			
		});
		
		$scope.goTo = function(index){
			console.log(index);
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

app.controller('PdfCtrl', ['$scope', '$stateParams', '$ionicLoading','ePaperService','news',
    function($scope, $stateParams, $ionicLoading, ePaperService, news) {	
	var scope = $scope;
    var tCtrl = this;
        

    this.onLoad = function (pag) {
		$ionicLoading.hide();
    };

    this.onError = function (err) {
    };

    this.onProgress = function (progress) {
        $ionicLoading.show({
		  template: '<ion-spinner></ion-spinner> News Loading...Be patient <br> It may take a while',
		  duration: 15000
		}).then(function(){
		   console.log("The loading indicator is now displayed");
		});
    };

    this.onPageRender = function (page) {
    };
    $scope.options = {};
    $scope.options = {
        pdfUrl: news.pdfURL,
        onLoad: tCtrl.onLoad,
        onProgress: tCtrl.onProgress,
        onError: tCtrl.onError,
        onPageRender: tCtrl.onPageRender,
        httpHeaders: [],
        pinchin: false
    };


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


app.controller("DetailController", function($scope, $stateParams) {
    
	$scope.id = $stateParams.id;	
    
	var scope = $scope;
    var tCtrl = this;

    this.onLoad = function (pag) {
    };

    this.onError = function (err) {
    };

    this.onProgress = function (progress) {
    };

    this.onRenderPage = function (page) {
    };

    scope.options = {
        pdfUrl: 'pdf/pdf' + $scope.id + '.pdf',
        onLoad: tCtrl.onLoad,
        onProgress: tCtrl.onProgress,
        onError: tCtrl.onError,
        onRenderPage: tCtrl.onRenderPage
    };
});