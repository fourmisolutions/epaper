angular.module('epaper.controllers')
.controller("MenuCtrl", ["$scope","ePaperService", "$ionicSlideBoxDelegate", "$rootScope", "$state", '$timeout','$interval', '$ionicModal', '$cookies', '$ionicPopup', 'ShApiConstants','User',
	function($scope, ePaperService, $ionicSlideBoxDelegate, $rootScope, $state, $timeout, $interval, $ionicModal, $cookies, $ionicPopup, ShApiConstants, User){
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
		
		var localStorage = window.localStorage;
		
		// Form data for the login modal
		$scope.loginData = {};
		
		$scope.isAuthenticated = User.isLoggedIn();
		$scope.currentUser = User.username();
		
        if($scope.isAuthenticated) {
            User.refreshShApiSession();
		} else {
            $scope.currentUser = '访客';
            if (ShApiConstants.useProxy) {
				$cookies.remove(localStorage.getItem('shApiSessionKey'), {path:'/'});
			}
        }
		// Open the login modal
		$scope.showLogin = function() {
            $state.go('app.login');
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

			confirmPopup.then(function(confirm) {
				if(confirm) {
					//console.log('Proceed logout ...');
                    var postLogoutProcess = function() {
                        $scope.currentUser = '访客';
                        $scope.isAuthenticated = false;
                        $state.go('app.home');
                    };
                    
                    User.logout().then(function(response){
                        //console.log('MenuCtrl.confirmLogout(): response=' + JSON.stringify(response));
                        postLogoutProcess();
                        
                    }, function(error){
                        
                        //console.log('MenuCtrl.confirmLogout(): error=' + JSON.stringify(error));
                        
                        // proceed to process logout even with api call error
                        postLogoutProcess();
                        
                    });
                    
                }
			});
		};
        
        $scope.$on('postLogin',function(){
            $timeout(function() {
                $scope.isAuthenticated = User.isLoggedIn();
                $scope.currentUser = User.username();
                $scope.$apply();
            });
        });

		$scope.switchModule = function(moduleStateName) {
			$state.go(moduleStateName);
		}
		
}]);
