var app = angular.module('epaper.controllers', []);

app.controller("TabsCtrl", ['$rootScope', "$scope", "$state", "$stateParams", "$q", "$location", "$window", 'Categories', '$timeout', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', 'ePaperService', 'ConnectivityMonitor',
    function($rootScope, $scope, $state, $stateParams, $q, $location, $window, Categories, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, ePaperService, ConnectivityMonitor){
        
		//ConnectivityMonitor.isOnline();	
	
		const pageSize = 4; 
        $scope.pdf_number = 0;
        $scope.pdf_thumbnail = [];	
        $scope.currentPage = 0;
        $scope.pageSize = 4;
        $scope.categories = [];
        $scope.menus = [];	
		$scope.tabs = [];
        $scope.images = [];		
		
		if($window.localStorage.getItem("pdf_thumbnail") == null) //does not exist in localstorage
		{		
			//Check network status - ON/OFF
			
			//Offline: Network is off
			//Check localstorage version (date) - UPDATE/OUTDATE			
								
			//If UPDATE - load from localstorage
			
			//If OUTDATE - alert message to TURN ON network, then show OFFLINE ERROR SCREEN
			
			//Online: Network is ON
			$scope.getNewsPDF = function() {
				ePaperService.getNewsPDF()
					.then(function(response) {
						$scope.pdf_thumbnail = response;
						//$window.localStorage.clear();
						$window.localStorage.setItem("pdf_thumbnail",JSON.stringify(response));
					}, function (error) {
						$scope.status = 'Unable to load breaking news pdf: ' + error.message;
					});
					
				ePaperService.getCategories().then(function(categories){
					$scope.categories = categories;

					for(var j=0;j < categories.getTotal();j++)
					{
						var category = categories.getCategory(j);
						for(var pageNo = 0 ; pageNo < category.getNoOfPages(pageSize); pageNo++)
						{
							var categoryPageNo = categories.getPageNo(j, pageNo, pageSize);
							var tab = {id: categoryPageNo, "category": category.categoryId, "text": category.categoryId + category.getStart(pageNo, pageSize) + "-" + category.categoryId + category.getEnd(pageNo, pageSize)};
							$scope.tabs.push(tab);
							tab["href"] = "#/app/tabs/" + (categories.getPageNo(j, pageNo, pageSize)+1);
							$scope.menus.push(tab);
							$scope.images[categoryPageNo] = [];
							for( i = 0; i < pageSize; i++) {
								var news = category.getNews(pageNo * pageSize + i);
								if(news != undefined) {
									$scope.images[categoryPageNo].push(news);
								}
							}
						}
					}
				});
			}
			$scope.getNewsPDF();
		}
		else //exist in localstorage
		{
			//Check localstorage version (date) - UPDATE/OUTDATE
			
			//IF OUTDATE
		    //ONLINE: Network is ON - reload from api
			//OFFLINE: Network is off - load from localstorage, alert message: outdated version
					
			
			
			
			//If UPDATE
			$scope.pdf_thumbnail = JSON.parse($window.localStorage.getItem("pdf_thumbnail"));
			$scope.categories = Categories.build(JSON.parse($window.localStorage.getItem("pdf_thumbnail")));

            for(var j=0;j < $scope.categories.getTotal();j++)
			{
                var category = $scope.categories.getCategory(j);
				for(var pageNo = 0 ; pageNo < category.getNoOfPages(pageSize); pageNo++)
				{
                    var categoryPageNo = $scope.categories.getPageNo(j, pageNo, pageSize);
                    var tab = {id: categoryPageNo, "category": category.categoryId, "text": category.categoryId + category.getStart(pageNo, pageSize) + "-" + category.categoryId + category.getEnd(pageNo, pageSize)};
					$scope.tabs.push(tab);
                    tab["href"] = "#/app/tabs/" + ($scope.categories.getPageNo(j, pageNo, pageSize)+1);
                    $scope.menus.push(tab);
                    $scope.images[categoryPageNo] = [];
                    for( i = 0; i < pageSize; i++) {
                        var news = category.getNews(pageNo * pageSize + i);
                        if(news != undefined) {
                            $scope.images[categoryPageNo].push(news);
                        }
                    }
				}
			}			
		
            $timeout(function(){
                $scope.$apply();
            });
		}		
		

		
		
		$scope.clickThumbnail = function(url) {
			console.log(url);
			$state.go('app.detail', {url: url});    
		};	



        $scope.onSlideMove = function(data){
            console.log(data);
            console.log("You have selected " + data.index + " tab");
        };	    	


        $scope.goTo = function(index){
            var handle = $ionicSlideBoxDelegate.$getByHandle('myTab');
            $ionicSlideBoxDelegate.slide(index)
        }
		
		$scope.loadBreakingNews = function() {
            $state.go("app.breakingnews");
        }   
		
		

    }
]);

app.controller('PdfCtrl', ['$scope', '$stateParams', '$ionicLoading',
    function($scope, $stateParams, $ionicLoading) {	
	
	//console.log($stateParams.url);
   
	var scope = $scope;
    var tCtrl = this;
	
	$ionicLoading.show({
		  template: '<ion-spinner></ion-spinner> News Loading...Be patient <br> It may take a while',
		  duration: 15000
		}).then(function(){
		   console.log("The loading indicator is now displayed");
		});

    this.onLoad = function (pag) {
		$ionicLoading.show({
		  template: '<ion-spinner></ion-spinner> Loading almost complete...',
		  duration: 5000
		}).then(function(){
		   console.log("The loading indicator is now displayed");
		});
    };

    this.onError = function (err) {
		$ionicLoading.hide().then(function(){
		   console.log("The loading indicator is now hidden");
		});
		
		$ionicLoading.hide();
    };

    this.onProgress = function (progress) {
    };

    this.onRenderPage = function (page) {
		$ionicLoading.hide().then(function(){
		   console.log("The loading indicator is now hidden");
		});
		
		$ionicLoading.hide();
    };

    $scope.options = {
        pdfUrl: $stateParams.url,
        onLoad: tCtrl.onLoad,
        onProgress: tCtrl.onProgress,
        onError: tCtrl.onError,
        onRenderPage: tCtrl.onRenderPage,
        httpHeaders: []
    };

    console.log(JSON.stringify(scope.options, null, 4));

}]);

app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

});


app.controller("MainCtrl", ['$rootScope', "$scope", "$stateParams", "$q", "$location", "$window", '$timeout', '$ionicScrollDelegate',
    function($rootScope, $scope, $stateParams, $q, $location, $window, $timeout, $ionicScrollDelegate) {
        $scope.scrollTo = function(target){
            $location.hash(target);   //set the location hash
            var handle = $ionicScrollDelegate.$getByHandle('myPageDelegate');
            handle.anchorScroll(true);  // 'true' for animation
        };
    }]);






/*app.controller('BreakingNewsController', function($scope, $stateParams) {
    $scope.title = "古晋肯雅兰年货市集 吸引160摊参与";
    $scope.description =
        "（本报古晋2日讯）华人农历新年跫音近，古晋区的年货市集预计将在农历新年的前2个星期开业。所谓'姜还是老的辣'，肯雅兰年货市集截至12月23日，已有160个摊位敲定参与"
        + "由古晋南市市政局承办的肯雅兰年货市集，将于1月14日至27日，假肯雅兰商业中心举行，获得商家的热烈支持。"
        + "该年货市集已成为古晋人的一部分，逢农历新年前，都会前往选购年货。印度街年市有23摊"
        + "另外，首次于古晋老街印度街主办的年货市集，则将于本月12日至16日，在印度街举行。";
    $scope.imageUrl = "img/test.jpg";
    $scope.id = $stateParams.id;

    var scope = $scope;
    var tCtrl = this;

    this.onLoad = function (pag) {
        console.log('Num pages: ' + pag);
    };

    this.onError = function (err) {
        console.error('Error: ' + JSON.stringify(err, null, 4));
    };

    this.onProgress = function (progress) {
        //console.log('Progress: ' + (progress.loaded/progress.total*100) + '%');
    };

    this.onRenderPage = function (page) {
        console.log('Page: ' + page);
    };

    scope.options = {
        pdfUrl: 'pdf/pdf.pdf',
        onLoad: tCtrl.onLoad,
        onProgress: tCtrl.onProgress,
        onError: tCtrl.onError,
        onRenderPage: tCtrl.onRenderPage
    };
    console.log(JSON.stringify(scope.options, null, 4));
});
*/

app.controller("DetailController", function($scope, $stateParams) {
    /*$scope.title = "古晋肯雅兰年货市集 吸引160摊参与";
    $scope.description =
        "（本报古晋2日讯）华人农历新年跫音近，古晋区的年货市集预计将在农历新年的前2个星期开业。所谓'姜还是老的辣'，肯雅兰年货市集截至12月23日，已有160个摊位敲定参与"
        + "由古晋南市市政局承办的肯雅兰年货市集，将于1月14日至27日，假肯雅兰商业中心举行，获得商家的热烈支持。"
        + "该年货市集已成为古晋人的一部分，逢农历新年前，都会前往选购年货。印度街年市有23摊"
        + "另外，首次于古晋老街印度街主办的年货市集，则将于本月12日至16日，在印度街举行。";
    $scope.imageUrl = "img/test.jpg";
	*/
    
	$scope.id = $stateParams.id;	
    
	var scope = $scope;
    var tCtrl = this;

    this.onLoad = function (pag) {
        console.log('Num pages: ' + pag);
    };

    this.onError = function (err) {
        console.error('Error: ' + JSON.stringify(err, null, 4));
    };

    this.onProgress = function (progress) {
        //console.log('Progress: ' + (progress.loaded/progress.total*100) + '%');
    };

    this.onRenderPage = function (page) {
        console.log('Page: ' + page);
    };

    scope.options = {
        pdfUrl: 'pdf/pdf' + $scope.id + '.pdf',
        onLoad: tCtrl.onLoad,
        onProgress: tCtrl.onProgress,
        onError: tCtrl.onError,
        onRenderPage: tCtrl.onRenderPage
    };
    console.log(JSON.stringify(scope.options, null, 4));
});


/*app.controller('BreakingNewsListController', ['$scope', 'ePaperService', '$http',
    function($scope, ePaperService, $http) {
    $scope.breaking_news_number = 5;
    $scope.news = [];

    $scope.getBreakingNews = function(){
        ePaperService.getBreakingNews()
            .then(function(response) {
                console.log(response.data);
                return $scope.news = response.data;
            }, function (error) {
                return $scope.status = 'Unable to load breaking news data: ' + error.message;
            });

        }

        $scope.getBreakingNews();

    var title = "";

    for(var i=1;i<=$scope.breaking_news_number; i++) {
        switch(i){
            case 1:
                title = "News abc";
                break;
            case 2:
                title = "没后悔这一段情　风水师出示录音证据指女说谎不爱他！";
                break;
            case 3:
                title = "丹登水灾情况恶化 灾民人数翻倍";
                break;
            case 4:
                title = "狗儿也能监测血糖！";
                break;
            case 5:
                title = "特朗普好友 　华裔富商擬选印尼总统";
                break;
            default:
                title = "特朗普好友 　华裔富商擬选印尼总统";
        }

        $scope.news.push({"id": i, "title": "Breaking News " + i + " " + title, "description": "Breaking News " + i});
    }
}]);
*/
