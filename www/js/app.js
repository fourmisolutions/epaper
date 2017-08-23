// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

(function(){
    var app = angular.module('epaper', ['ionic', 'epaper.controllers','epaper.breakingNewsControllers', 'epaper.todayShControllers', 'tabSlideBox', 'gesture-pdf', 'ngCordova', 'ngCookies'])
    
    app.run(function($ionicPlatform, $rootScope, $window, $location, $ionicViewSwitcher, $ionicHistory, $ionicLoading, $ionicPopup, $cordovaNetwork, $cordovaPushV5, $cordovaPush, ePaperService,  $cordovaPreferences, GaConstants) {
        $ionicPlatform.ready(function() {
            
        	$rootScope.goBackState = function(){
                $ionicViewSwitcher.nextDirection('back');
                $ionicHistory.goBack();
            }
            
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);                
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            var showOffline = true;
            if(window.cordova) {
                $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                    showOffline = true;
                });
                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                    if(showOffline) {
                        $ionicPopup.confirm({
                            title: "Internet is not working",
                            content: "Internet is not working on your device. Reconnect and reload the app again to browse."
                        });
                        showOffline = false;
                    }
                });
            }
            
            if(window.cordova) {
                var options = {
                    android: {
                      senderID: "167400319609",
                      icon: "ic_stat_seehua",
                      iconColor: "red"
                    },
                    ios: {
                      alert: "true",
                      badge: "true",
                      sound: "true"
                    },
                    windows: {}
                };

                // initialize
                $cordovaPushV5.initialize(options).then(function(result) {
                    // start listening for new notifications
                    $cordovaPushV5.onNotification();
                    // start listening for errors
                    $cordovaPushV5.onError();

                    // register to get registrationId
                    //we will only register if there is no existing token keep in preference.
                    $cordovaPreferences.fetch('token')
                      .success(function(token) {
                        //console.log("token", token);
                        if(token == undefined || token === "") {
                            $cordovaPushV5.register().then(function(registrationId) {
                                var currentPlatform = ionic.Platform.platform();
                                var deviceId = window.device.uuid;
                                ePaperService.registerPushNotification(registrationId, currentPlatform);
                            }, function(err){
                            });
                        }
                      })
                      .error(function(error) {
                          //console.log("fail to fetch token", error);
                      })
                    
                });
                 // triggered every time notification received
                $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data){
                    ePaperService.setBreakingNewsCount(ePaperService.getBreakingNewsCount() + 1);
                    $rootScope.$broadcast('onBreakingNewsUpdate');
                });

                // triggered every time error occurs
                $rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e){
                });
            }
            //trying to clear cache 
            ePaperService.clearCache();
            
            // ComScore SDK v5.X
            ComScorePlugin.initClient("24608202", "82a44e8c84c174abac3cfdbcb2050ced");
        	
            // Google Analytics
    		if (typeof window.ga !== 'undefined') {
    			window.ga.startTrackerWithId(GaConstants.trackingId, GaConstants.dispatchInterval);
    		} else {
    			//console.log("Google Analytics is not available");
    		}
            
        });
    })
    
    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'MenuCtrl'
            })
            
			.state('app.home', {
                url: '/home',
				views: {
                    'menuContent': {
                        templateUrl: 'templates/home.html'
                    }
                }                
            })
            
			.state('app.home-epaper', {
                url: '/home-epaper',
				views: {
                    'menuContent': {
                        templateUrl: 'templates/home-epaper.html'
                    }
                }                
            })
            
			.state('app.home-todaysh', {
                url: '/home-todaysh',
				views: {
                    'menuContent': {
                        templateUrl: 'templates/home-todaysh.html'
                    }
                }                
            })
            
            .state('app.tabs', {
                url: '/tabs/:categoryId', //version 1.1
                views: {
                    'menuContent': {
                        templateUrl: 'templates/tabs.html',
                        controller: 'TabsCtrl'
                    }
                },
                resolve : {
                    categories : function(ePaperService, $q) {
                        return ePaperService.getCategories();
                    }
                }
            })

            .state('app.detail', {
                url: '/detail/:categoryId/:pageNo',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'templates/detailpdf.html',
                        controller: 'PdfCtrl',
                    }
                },
                resolve: {
                    news: function(ePaperService, $stateParams) {
                        return  ePaperService.getNews($stateParams.categoryId, $stateParams.pageNo);
                    }
                }
            })

            .state('app.detailwithbreaking', {
                url: '/detailwithbreaking/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/detailwithbreaking.html'
                    }
                }
            })

            .state('app.news', {
                url: '/news/',
                params: {news: null},
                views: {
                    'menuContent': {
                        templateUrl: 'templates/breakingnewsdetail.html'
                    }
                }
            })

            .state('app.breakingnewslist', {
                url: '/breakingnewslist',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/breakingnews.html'
                    }
                }
            })

            .state('app.todayseehualist', {
                url: '/todayseehualist/:categoryId',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/todayseehua.html'
                    }
                }
            })

            .state('app.todayseehua', {
                url: '/todayseehua/:categoryId/:index',
                params: {news: null},
                views: {
                    'menuContent': {
                        templateUrl: 'templates/todayseehuadetail.html'
                    }
                }
            })
            
            .state('app.login', {
                url: '/login?redirectUrl',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'
                    }
                },
                cache: false
            })

            ;
			
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });
}());
