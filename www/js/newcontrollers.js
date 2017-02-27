
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
