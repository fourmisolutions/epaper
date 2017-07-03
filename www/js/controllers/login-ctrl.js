angular.module('epaper.controllers')
.controller("LoginCtrl", ["$scope","$state","$stateParams", "$location","$rootScope","User", 
	function($scope, $state, $stateParams, $location, $rootScope, User){
        var backToPreviousPage = function(redirectUrl) {
            if(redirectUrl == undefined) {
                $state.go("app.home");
            } else {
                $location.path(redirectUrl);
            }
        }
        
        //TODO - should do it at state router
        if(User.isLoggedIn()) {
            backToPreviousPage();
        }
        var redirectUrl = $stateParams.redirectUrl;
        // Perform the login action when the user submits the login form
        $scope.loginData = {}
		$scope.doLogin = function() {
            User.login($scope.loginData.username, $scope.loginData.password).then(function(response){
                $rootScope.$broadcast('postLogin');
                backToPreviousPage(redirectUrl);
			}, function(error){
				//console.log('MenuCtrl.doLogin(): error=' + JSON.stringify(error));
				
				$ionicPopup.alert({
                    title: "User Login Error",
                    content: error.data
                });
				
				// reset form data?
                //$scope.loginData = {};
			});
			
		};
    }
]);
