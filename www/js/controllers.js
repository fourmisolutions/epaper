var app = angular.module('epaper.controllers', []);

app.controller('PdfCtrl', function ($scope, $state) {
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


app.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})

/*app.controller("ThumbnailController", function($scope, $state) {

    $scope.no_of_pages = 3;
    $scope.no_of_images_per_page = 4;

    $scope.slide_pages = [];


    $scope.loadSlidePages = function(page) {
        for(var i=0;i<$scope.no_of_pages;i++)
        {
            $scope.slide_pages.push({id: i, title: "Page " + i});
        }


    }
    $scope.loadSlidePages();

    var Create2DArray = function(rows) {
        var arr = [];

        for (var i=0;i<rows;i++) {
            arr[i] = [];
        }

        return arr;
    }

    $scope.images = Create2DArray(3);

    $scope.loadImages = function(page){

        for(var i = 0; i < $scope.no_of_images_per_page; i++) {
            $scope.images[page.id].push({id: i, src: "thumbnails/A3.jpg", url:"#app/detail/"+i});
        }

    }

    $scope.swiperOptions = {
        effect: 'slide',
        initialSlide: 0,
        // Initialize a scope variable with the swiper
        onInit: function(swiper){
            $scope.swiper = swiper;
            $scope.pager = this.initialSlide
        },
        onSlideChangeEnd: function(swiper){
            console.log('The active index is ' + swiper.activeIndex);
            $scope.pager = swiper.activeIndex;
            //$state.go($state.current, {}, { reload: true });
        }
    };

});
*/

app.controller("MainCtrl", ['$rootScope', "$scope", "$stateParams", "$q", "$location", "$window", '$timeout', '$ionicScrollDelegate',
    function($rootScope, $scope, $stateParams, $q, $location, $window, $timeout, $ionicScrollDelegate) {
        $scope.scrollTo = function(target){
            $location.hash(target);   //set the location hash
            var handle = $ionicScrollDelegate.$getByHandle('myPageDelegate');
            handle.anchorScroll(true);  // 'true' for animation
        };
    }]);


app.controller("TabsCtrl", ['$rootScope', "$scope", "$stateParams", "$q", "$location", "$window", '$timeout', '$ionicSlideBoxDelegate', '$ionicScrollDelegate',
    function($rootScope, $scope, $stateParams, $q, $location, $window, $timeout, $ionicSlideBoxDelegate, $ionicScrollDelegate){

        $scope.no_of_A_tabs = 8;
        $scope.no_of_B_tabs = 5;
        $scope.no_of_images_per_tab = 4;

        $scope.tabs = [];

        $scope.loadSlideTabs = function(tab) {
            for(var i=0;i<$scope.no_of_A_tabs;i++)
            {
                var start = i*4+1;
                var end = start + 3;
                $scope.tabs.push({"id": i, "type": "A", "text": "A" + start + "-" + "A" + end, "description": "Tab " + (i+1)});
            }

            for(var i=$scope.no_of_A_tabs;i<$scope.no_of_B_tabs+$scope.no_of_A_tabs;i++)
            {
                var start = i*4+1 - $scope.no_of_A_tabs*4;
                var end = start + 3;
                $scope.tabs.push({"id": i, "type": "B", "text": "B" + start + "-" + "B" + end, "description": "Tab " + (i+1)});
            }


        }
        $scope.loadSlideTabs();

        $scope.onSlideMove = function(data){
            console.log("You have selected " + data.index + " tab");
        };

        var Create2DArray = function(rows) {
            var arr = [];

            for (var i=0;i<rows;i++) {
                arr[i] = [];
            }

            return arr;
        }

        $scope.images = Create2DArray(14); //14 tabs

        $scope.loadImages = function(tab, type){

            if(type == 'A')
            {
                var start = tab.id*$scope.no_of_images_per_tab+1;
                var end = start + 3;
            }
            else if(type == 'B')
            {
                var start = tab.id*$scope.no_of_images_per_tab+1 - $scope.no_of_A_tabs*4;
                var end = start + 3;
            }



            for(var i = start; i <= end; i++) {
                var detailurl = "#app/detail/";

                if(i <= 5){
                    detailurl = "#app/detailwithbreaking/";
                }
                else {
                    detailurl = "#app/detail/";
                }
                $scope.images[tab.id].push({id: i, label: type+i, src: "thumbnails/"+type+i+".jpg", url:detailurl+i});
            }

        }

        var loadBreakingNews = function() {
            $state.go("app.breakingnews");
        }

        $scope.no_of_A_tabs = 8;
        $scope.no_of_B_tabs = 5;
        //$scope.no_of_images_per_tab = 4;

        $scope.menus = [];

        $scope.loadMenu = function() {
            for(var i=0;i<$scope.no_of_A_tabs;i++)
            {
                var start = i*4+1;
                var end = start + 3;
                $scope.menus.push({"id": i, "type": "A", "text": "A" + start + "-" + "A" + end, "href": "#/app/tabs/" + (i+1)});
            }

            for(var i=$scope.no_of_A_tabs;i<$scope.no_of_B_tabs+$scope.no_of_A_tabs;i++)
            {
                var start = i*4+1 - $scope.no_of_A_tabs*4;
                var end = start + 3;
                $scope.menus.push({"id": i, "type": "B", "text": "B" + start + "-" + "B" + end, "href": "#/app/tabs/" + (i+1)});
            }
        }
        $scope.loadMenu();

        $scope.goTo = function(index){
            console.log(index);
            var handle = $ionicSlideBoxDelegate.$getByHandle('myTab');
            //$ionicSlideBoxDelegate.next();
            $ionicSlideBoxDelegate.slide(index)

        }

    }
]);

app.controller("MenuController", ['$rootScope', "$scope", "$stateParams", "$q", "$location", "$window", '$timeout', '$ionicScrollDelegate',
    function($rootScope, $scope, $stateParams, $q, $location, $window, $timeout, $ionicScrollDelegate){

        $scope.no_of_A_tabs = 8;
        $scope.no_of_B_tabs = 5;
        //$scope.no_of_images_per_tab = 4;

        $scope.menus = [];

        $scope.loadMenu = function() {
            for(var i=0;i<$scope.no_of_A_tabs;i++)
            {
                var start = i*4+1;
                var end = start + 3;
                $scope.menus.push({"id": i, "type": "A", "text": "A" + start + "-" + "A" + end, "href": "#/app/tabs/" + (i+1)});
            }

            for(var i=0;i<$scope.no_of_B_tabs;i++)
            {
                var start = i*4+1;
                var end = start + 3;
                $scope.menus.push({"id": i, "type": "B", "text": "B" + start + "-" + "B" + end, "href": "#/app/tabs/" + (i+1)});
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

app.controller("DetailController", function($scope, $stateParams) {
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
        pdfUrl: 'pdf/pdf' + $scope.id + '.pdf',
        onLoad: tCtrl.onLoad,
        onProgress: tCtrl.onProgress,
        onError: tCtrl.onError,
        onRenderPage: tCtrl.onRenderPage
    };
    console.log(JSON.stringify(scope.options, null, 4));
});
