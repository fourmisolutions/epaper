var app = angular.module('epaper.controllers', []);
const pageSize = 4; 
function getTabsByCategory(categories, cat) { //version 1.1
    var tabs = [];
    if(categories == undefined) {
        return;
    };	

    for(var j=0;j < categories.getTotal();j++){
        var category = categories.getCategory(j);
		
		if(category.categoryId == cat) {
		
			for(var pageNo = 0 ; pageNo < category.getNoOfPages(pageSize); pageNo++)
			{
				var categoryPageNo = categories.getPageNo(j, pageNo, pageSize);
				var news = category.getNewsStartFrom(pageNo, pageSize);
				//var tab = {"categoryId": category.categoryId, "text": category.categoryId + category.getStart(pageNo, pageSize) + "-" + category.categoryId + category.getEnd(pageNo, pageSize), news: news};
				//version 1.1
				var tab = {"categoryId": category.categoryId, "text": category.categoryId, news: news, "pageNoText": category.getStart(pageNo, pageSize) + "-" + category.getEnd(pageNo, pageSize)};			
				tabs.push(tab);
			}	
		}		
    }
	
    return tabs;
}

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
				//var tab = {"categoryId": category.categoryId, "text": category.categoryId + category.getStart(pageNo, pageSize) + "-" + category.categoryId + category.getEnd(pageNo, pageSize), news: news};
				//version 1.1
				var tab = {"categoryId": category.categoryId, "text": category.categoryId, news: news};			
				tabs.push(tab);
			}	
			
    }
	
    return tabs;
}


app.controller("MenuCtrl", ["$scope","ePaperService", "$ionicSlideBoxDelegate", "$rootScope", "$state", '$timeout',
	function($scope, ePaperService, $ionicSlideBoxDelegate, $rootScope, $state, $timeout){
		ePaperService.getCategories().then(function(categories){
			//version 1.1		
			var sorted = getTabs(categories).sort(function(a, b)
			{
			  var nA = a.text.toLowerCase();
			  var nB = b.text.toLowerCase();

			  if(nA < nB)
				return -1;
			  else if(nA > nB)
				return 1;
			 return 0;
			});
			
			var unique_category = [];
			
			for (var j = 0; j < sorted.length; j++){
			  unique_category.push(sorted[j].text);
			}
			
			Array.prototype.contains = function(v) {
				for(var i = 0; i < this.length; i++) {
					if(this[i] === v) return true;
				}
				return false;
			};

			Array.prototype.unique = function() {
				var arr = [];
				for(var i = 0; i < this.length; i++) {
					if(!arr.contains(this[i])) {
						arr.push(this[i]);
					}
				}
				return arr; 
			}
			unique_category = unique_category.unique();

			$scope.tabs = unique_category;
			//end of version 1.1
		});
		
		/*$scope.goTo = function(index){
			var handle = $ionicSlideBoxDelegate.$getByHandle('ThumbnailTab');
			$ionicSlideBoxDelegate.slide(index);
		}*/
		
		//version 1.1
		$scope.goTo = function(categoryId){
			//load tabs of the category
			$timeout(function() {
				$state.go("app.tabs", {"categoryId": categoryId});
				//$state.$apply();
            });
			
		}
		
}]);

app.controller("TabsCtrl", ['$scope','$state', '$ionicScrollDelegate','$timeout','ePaperService','$interval', '$stateParams', 'categories',
    function( $scope, $state, $ionicScrollDelegate, $timeout, ePaperService, $interval, $stateParams, categories){
        $scope.breakingNewsCount = ePaperService.getBreakingNewsCount();
        $scope.$on('onBreakingNewsUpdate',function(){
            $timeout(function() {
                $scope.breakingNewsCount = ePaperService.getBreakingNewsCount();
                $scope.$apply();
            });
        });
        $interval(function() {
            $scope.breakingNewsCount = ePaperService.getBreakingNewsCount();
        }, 10000);
        
		$scope.tabs = getTabsByCategory(categories, $stateParams.categoryId);
		
		//console.log($stateParams.categoryId);
		//$scope.tabs = getTabs(categories);        
		
		$scope.clickThumbnail = function(categoryId, pageNo) {
            $state.go('app.detail', {categoryId: categoryId, pageNo:pageNo});    
        };
        $scope.goTo = function(index){
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
