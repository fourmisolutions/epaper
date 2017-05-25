/*
 * SHE3: 
 * - This file only defines the base controller module.
 * - All other controllers is expected to extend from this base module and defined in individual .js file 
 *   under the folder /wwww/js/controllers/
 * - Example please refer to /wwww/js/controllers/epaper-menuctrl.js
 */

var app = angular.module('epaper.controllers', []);

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
