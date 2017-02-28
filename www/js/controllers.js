var app = angular.module('epaper.controllers', []);

app.controller("TabsCtrl", ['$rootScope', "$scope", "$state", "$stateParams", "$q", "$location", "$window", '$timeout', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', 'ePaperService',
    function($rootScope, $scope, $state, $stateParams, $q, $location, $window, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate, ePaperService){
        const no_of_images_per_tab = 4; //javascript const	
        $scope.pdf_number = 0;
        $scope.pdf_thumbnail = [];
		
		var k = 0;
		
		//$window.localstorage.clear();
        $scope.currentPage = 0;
        $scope.pageSize = 4;
        $scope.categories = [];
        $scope.menus = [];
        ePaperService.getCategories().then(function(categories){
            $scope.categories = categories;
            $scope.tabs = [];
            var pageSize = 4;
            $scope.images = [];
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
            $timeout(function(){
                $scope.$apply();
            });
            
        });
        
        if(!$window.localStorage.getItem("pdf_thumbnail"))
		{		
			
			$scope.getNewsPDF = function() {
				ePaperService.getNewsPDF()
					.then(function(response) {
						$scope.pdf_thumbnail = response;
						$window.localStorage.clear();						
						$window.localStorage.setItem("pdf_thumbnail",JSON.stringify(response));
					}, function (error) {
						$scope.status = 'Unable to load breaking news pdf: ' + error.message;
					});
			}
			$scope.getNewsPDF();
		}
		else
		{
			$scope.pdf_thumbnail = JSON.parse($window.localStorage.getItem("pdf_thumbnail"));
			console.log($scope.pdf_thumbnail);
		}		
		
		
		
		$scope.clickThumbnail = function(url) {
			console.log(url);
			$state.go('app.detail', {url: url});    
		};
		
		//Read the distinct categories from api
		var categories_temp = [];
		for(var i=0;i<$scope.pdf_thumbnail.length;i++)
		{
			categories_temp.push($scope.pdf_thumbnail[i].category);
		}
		
		
		
		//console.log(categories_temp);
		
		//$scope.categories = Array.from(new Set(categories_temp));
		
		//console.log($scope.categories);
		
		var category_count = [];					
			
        /*
		for(var j=0;j<$scope.categories.length;j++)
		{				
			var count = 0 ;	
			for(var i=0;i<$scope.pdf_thumbnail.length;i++)
			{
				
				if($scope.pdf_thumbnail[i].category == $scope.categories[j])
				{
					count++;					
				}						
				
			}
			category_count[$scope.categories[j]] = count;
			
		}
		*/
		
		
		category_count['off'] = 0;
		
	    //console.log(category_count);
		
		$scope.total_pages_by_category = [];
		$scope.no_of_tabs_by_category = [];
		var tabs_grand_total = 0;
		var cumulative_category_count = [];		
		var cumulative_count = 0;
		for(var i=0;i<$scope.categories.length;i++)
		{
			$scope.total_pages_by_category[$scope.categories[i]] = category_count[$scope.categories[i]];
			$scope.no_of_tabs_by_category[$scope.categories[i]] = Math.ceil($scope.total_pages_by_category[$scope.categories[i]]/no_of_images_per_tab);
			tabs_grand_total += Math.ceil($scope.total_pages_by_category[$scope.categories[i]]/no_of_images_per_tab);
			//cumulative_count += category_count[$scope.categories[i]]; 
			//cumulative_category_count[$scope.categories[i+1]] = cumulative_count;
		}

		//console.log($scope.total_pages_by_category);
		//console.log($scope.no_of_tabs_by_category);
		//console.log(tabs_grand_total);
		//console.log(cumulative_category_count);		


        //Load and initialize tabs
        $scope.tabs = [];
        
        $scope.loadSlideTabs = function() {			
			
            for(var j=0;j<$scope.categories.length;j++)
			{
				//var offset = 0;
				for(var i=0;i<$scope.no_of_tabs_by_category[$scope.categories[j]];i++)
				{
					//offset = cumulative_category_count[$scope.categories[j]];
					var start = i*4+1;
					var end = start + 3;
					//console.log($scope.no_of_tabs_by_category[$scope.categories[j]]);
					$scope.tabs.push({"id": i, "category": $scope.categories[j], "text": $scope.categories[j] + start + "-" + $scope.categories[j] + end, "description": "Tab " + (i+1)});
				}
			}
						

        }
        //$scope.loadSlideTabs();
		
		//console.log($scope.tabs);

        $scope.onSlideMove = function(data){
            console.log(data);
            console.log("You have selected " + data.index + " tab");
        };
        
        $scope.loadThumbnails = function(tab){ 
            var start = 0;
			var end = 0;		
            var pageSize = 4;
			for(var j=0;j<$scope.categories.getTotal();j++)
			{	
                var category = $scope.categories.getCategory(j);
				for(var i = 0 ;i< category.getTotal() ;i++)
				{
                    var news = category.getNews(i);
					$scope.images[tab.id].push({id: i, src: news.thumbnailURL, url: news.pdfURL});
                }
            }	
            
            $timeout(function(){
                $scope.$apply();
            });
        }

        var loadBreakingNews = function() {
            $state.go("app.breakingnews");
        }

        //Load and initialize menu
        $scope.menus = [];

        $scope.loadMenu = function() {
            
			for(var j=0;j<$scope.categories.length;j++)
			{			
				for(var i=0;i<$scope.no_of_tabs_by_category[$scope.categories[j]];i++)
				{
					var start = i*4+1;
					var end = start + 3;
					$scope.menus.push({"id": i, "category": $scope.categories[j], "text": $scope.categories[j] + start + "-" + $scope.categories[j] + end, "href": "#/app/tabs/" + (i+1)});
				}
			}

        }
        $scope.loadMenu();

        //-- end: Load and initialize menu
	


        $scope.goTo = function(index){
            var handle = $ionicSlideBoxDelegate.$getByHandle('myTab');
            $ionicSlideBoxDelegate.slide(index)
        }
		
		

    }
]);

app.controller('PdfCtrl', ['$scope', '$stateParams', '$ionicLoading',
    function($scope, $stateParams, $ionicLoading) {	
	
	//console.log($stateParams.url);
   
	var scope = $scope;
    var tCtrl = this;

    this.onLoad = function (pag) {
		$ionicLoading.show({
		  template: '<ion-spinner></ion-spinner> Loading...',
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




/*app.controller("MenuController", ['$rootScope', "$scope", "$stateParams", "$q", "$location", "$window", '$timeout', '$ionicScrollDelegate',
    function($rootScope, $scope, $stateParams, $q, $location, $window, $timeout, $ionicScrollDelegate){

        //Need to modularize this part of code to initialize the menu and navigation based on total no. of pages provided by server
        $scope.total_pages_A = 32; //To be read from api total
        $scope.total_pages_B = 4; //To be read from api total
        $scope.total_pages_N = 16; //To be read from api total
        $scope.total_pages_S = 12; //To be read from api total

        var no_of_images_per_tab = 4;
        //$scope.no_of_images_per_tab = 4;

        $scope.no_of_A_tabs = Math.ceil($scope.total_pages_A/no_of_images_per_tab);
        $scope.no_of_B_tabs = Math.ceil($scope.total_pages_B/no_of_images_per_tab);
        $scope.no_of_N_tabs = Math.ceil($scope.total_pages_N/no_of_images_per_tab);
        $scope.no_of_S_tabs = Math.ceil($scope.total_pages_S/no_of_images_per_tab);

        //--end of initialization codes

        $scope.menus = [];

        $scope.loadMenu = function() {
            for(var i=0;i<$scope.no_of_A_tabs;i++)
            {
                var start = i*4+1;
                var end = start + 3;
                $scope.menus.push({"id": i, "category": "A", "text": "A" + start + "-" + "A" + end, "href": "#/app/tabs/" + (i+1)});
            }

            for(var i=0;i<$scope.no_of_N_tabs;i++)
            {
                var start = i*4+1;
                var end = start + 3;
                $scope.menus.push({"id": i, "category": "N", "text": "N" + start + "-" + "N" + end, "href": "#/app/tabs/" + (i+1)});
            }

            for(var i=0;i<$scope.no_of_S_tabs;i++)
            {
                var start = i*4+1;
                var end = start + 3;
                $scope.menus.push({"id": i, "category": "S", "text": "S" + start + "-" + "S" + end, "href": "#/app/tabs/" + (i+1)});
            }

            for(var i=0;i<$scope.no_of_B_tabs;i++)
            {
                var start = i*4+1;
                var end = start + 3;
                $scope.menus.push({"id": i, "category": "B", "text": "B" + start + "-" + "B" + end, "href": "#/app/tabs/" + (i+1)});
            }
        }
        $scope.loadMenu();

        $scope.scrollTo = function(target){
            $location.hash(target);   //set the location hash
            var handle = $ionicScrollDelegate.$getByHandle('myPageDelegate');
            handle.anchorScroll(true);  // 'true' for animation
        };
    }
]);
*/

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
