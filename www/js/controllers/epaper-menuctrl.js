angular.module('epaper.controllers')
.controller("MenuCtrl", ["$scope","ePaperService", "$ionicSlideBoxDelegate", "$rootScope", "$state", '$timeout','$interval', '$ionicModal', '$cookies', '$ionicPopup', 'ShApiConstants',
	function($scope, ePaperService, $ionicSlideBoxDelegate, $rootScope, $state, $timeout, $interval, $ionicModal, $cookies, $ionicPopup, ShApiConstants){
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
		
        ePaperService.getCategories().then(function(categories){
			//version 1.1		
            var tabs = [];
            for(var j=0;j < categories.getTotal();j++){
                var category = categories.getCategory(j);	
                var tab = {"categoryId": category.categoryId, "text": category.getCategoryDesc()};			
				tabs.push(tab);
            }
			$scope.tabs = tabs;
			//end of version 1.1
		});
        
        ePaperService.getTodayShCategories().then(function(categories){
			var todayShTabs = [];
            for(var j=0;j < categories.getTotal();j++){
                var category = categories.getCategory(j);	
                var tab = {"categoryId": category.categoryId, "text": category.getCategoryDesc()};			
                todayShTabs.push(tab);
            }
			$scope.todayShTabs = todayShTabs;
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
			
		};
		
		$scope.goToTodaySh = function(categoryId){
			
			$timeout(function() {
				$state.go("app.todayseehualist", {"categoryId": categoryId});
				//$state.$apply();
            });
			
		};
		
		// Form data for the login modal
		$scope.loginData = {};
		
		$scope.isAuthenticated = true;
		$scope.currentUser = localStorage.getItem('shApiUsername');
		
		if ($scope.currentUser == undefined) {
			
			$scope.currentUser = '访客';
			$scope.isAuthenticated = false;
			
			if (ShApiConstants.useProxy) {
				$cookies.remove(localStorage.getItem('shApiSessionKey'), {path:'/'});
			}
			
		} else {
			
			// verify if session cookies is still available
			// - if gone need to refresh session data based on localStorage values
			// - possible scenario: user closed the app intentionally or restart device
			if (ShApiConstants.useProxy) {
				
				// for 'ionic serve', closing the browser tab/window will not remove the localStorage 
				// - new incognito window will start with new localStarage though
				if ($cookies.get(localStorage.getItem('shApiSessionKey')) == undefined) {
					$cookies.put(
							localStorage.getItem('shApiSessionKey'), localStorage.getItem('shApiSessionValue'), 
							{path:'/'});
				} 
				
			} else if (sessionStorage.getItem('toRefreshShApiSession') == undefined) {
				
				var refreshShApiSession = function() {
					
					ePaperService.login(
							localStorage.getItem('shApiUsername'), 
							window.atob(localStorage.getItem('shApiPassword'))).then(function(response){

						//console.log('refreshShApiSession(): data=' + JSON.stringify(response.data));
						
						// store refreshed data in local storage for subsequent api calls
						localStorage.setItem('shApiSessionToken', response.data.token);
						//console.log('sessionToken: ' + response.data.token);
						
						localStorage.setItem('shApiSessionKey', response.data.session_name);
						//console.log('sessionKey: ' + response.data.session_name);
						
						localStorage.setItem('shApiSessionValue', response.data.sessid);
						//console.log('sessionValue: ' + response.data.sessid);
						
						// store session cookies to be sent over to server for subsequent api calls
						if (ShApiConstants.useProxy) {
							$cookies.put(
									response.data.session_name, response.data.sessid, 
									{path:'/'});
						}
						
					}, function(error){
						
						//console.log('refreshShApiSession(): error=' + JSON.stringify(error));
						
						$ionicPopup.alert({
                            title: "User Login Error",
                            content: error.data
                        });
						
						// reset form data?
						//$scope.loginData = {};
					});
					
				};
				
				refreshShApiSession();
				
				sessionStorage.setItem('toRefreshShApiSession', 'N');
			}
			
		}
    
		// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/login.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.modal = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeLogin = function() {
			$scope.modal.hide();
		};

		// Open the login modal
		$scope.showLogin = function() {
			$scope.modal.show();
		};

		// Perform the login action when the user submits the login form
		$scope.doLogin = function() {
			
			ePaperService.login($scope.loginData.username, $scope.loginData.password).then(function(response){
				
				//console.log('MenuCtrl.doLogin(): data=' + JSON.stringify(response.data));
				
				// store credentials and returned data in local storage for subsequent api calls
				localStorage.setItem('shApiUsername', $scope.loginData.username);
				//console.log('username: ' + $scope.loginData.username);
				
				var passwordEnc = window.btoa($scope.loginData.password);
				localStorage.setItem('shApiPassword', passwordEnc);
				//console.log('passwordEnc: ' + passwordEnc);
				
				localStorage.setItem('shApiSessionToken', response.data.token);
				//console.log('sessionToken: ' + response.data.token);
				
				localStorage.setItem('shApiSessionKey', response.data.session_name);
				//console.log('sessionKey: ' + response.data.session_name);
				
				localStorage.setItem('shApiSessionValue', response.data.sessid);
				//console.log('sessionValue: ' + response.data.sessid);
				
				// store session cookies to be sent over to server for subsequent api calls
				if (ShApiConstants.useProxy) {
					$cookies.put(
							response.data.session_name, response.data.sessid, 
							{path:'/'});
				}
				
				$scope.currentUser = $scope.loginData.username;
				$scope.isAuthenticated = true;
				
				$scope.loginData = {};
				$scope.closeLogin();
				$state.go('app.home');
				
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
		
		// Confirm and perform logout action
		$scope.confirmLogout = function() {
			var confirmPopup = $ionicPopup.confirm({
				title: '会员退出',
				template: '<h3 align="center">您确定退出吗？<h3>',
				cancelText: '取消',
				cancelType: 'button-balanced',
				okText: '确定',
				okType: 'button-assertive'
			});

			confirmPopup.then(function(res) {
				if(res) {
					//console.log('Proceed logout ...');
					
					if (localStorage.getItem('shApiSessionToken') == undefined) {
						//console.log('MenuCtrl.confirmLogout: sessionToken unavailable');
					} else {
						
						var postLogoutProcess = function() {
							// remove session cookies
							if (ShApiConstants.useProxy) {
								$cookies.remove(localStorage.getItem('shApiSessionKey'), {path:'/'});
							}
							
							// remove previously saved data in local storage
							localStorage.removeItem('shApiUsername');
							localStorage.removeItem('shApiPassword');
							localStorage.removeItem('shApiSessionToken');
							localStorage.removeItem('shApiSessionKey');
							localStorage.removeItem('shApiSessionValue');
							
							$scope.currentUser = '访客';
							$scope.isAuthenticated = false;
							
							$state.go('app.home');
						};
						
						ePaperService.logout(localStorage.getItem('shApiSessionToken')).then(function(response){

							//console.log('MenuCtrl.confirmLogout(): response=' + JSON.stringify(response));
							postLogoutProcess();
							
						}, function(error){
							
							//console.log('MenuCtrl.confirmLogout(): error=' + JSON.stringify(error));
							
							// proceed to process logout even with api call error
							postLogoutProcess();
							
						});
						
					}
				} else {
					//console.log('Cancel logout');
				}
			});
		};

		$scope.switchModule = function(moduleStateName) {
			$state.go(moduleStateName);
		}
		
}]);
