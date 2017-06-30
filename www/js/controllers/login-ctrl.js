angular.module('epaper.controllers')
.controller("LoginCtrl", ["$scope","$state","$ionicPopup", "$ionicHistory","$rootScope","User", 
	function($scope, $state, $ionicPopup, $ionicHistory, $rootScope,User){
        var backToPreviousPage = function() {
            //TODO - go to last page
            $state.go("app.home");
        }
        //TODO - should do it at state router
        if(User.isLoggedIn()) {
            backToPreviousPage();
        }
        // Perform the login action when the user submits the login form
        $scope.loginData = {}
		$scope.doLogin = function() {
            User.login($scope.loginData.username, $scope.loginData.password).then(function(response){
                $rootScope.$broadcast('postLogin');
                backToPreviousPage();
			}, function(error){
				
                backToPreviousPage();
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
