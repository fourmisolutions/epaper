// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

(function(){
var app = angular.module('epaper', ['ionic', 'epaper.controllers', 'tabSlideBox', 'gesture-pdf'])

app.run(function($ionicPlatform, $rootScope, $location, $ionicViewSwitcher, $ionicHistory) {
  $ionicPlatform.ready(function() {

      $rootScope.$on("$locationChangeStart", function(event, next, current){
          $rootScope.error = null;
          console.log("Route change!!!", $location.path());
          var path = $location.path();
          console.log("App Loaded!!!");
      });

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
  });
})

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.thumbnail', {
    url: '/thumbnail',
    views: {
      'menuContent': {
        templateUrl: 'templates/thumbnail.html'
      }
    }
  })

      .state('app.tabs', {
          url: '/tabs',
          views: {
              'menuContent': {
                  templateUrl: 'templates/tabs.html'
              }
          }
      })


    .state('app.detail', {
        url: '/detail/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/detailpdf.html'
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
          url: '/news/:id',
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
      });

  /*.state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  */
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tabs');
});

    app.factory('ePaperService', function($http) {

        var baseUrl = 'http://localhost:8080';
        var ePaperFactory = {};

        //POST login
        var loginApiUrl = '/login';

        ePaperFactory.login = function() {
            return $http.post(baseUrl + loginApiUrl, data)
                .then(function(status, headers){
                    console.log("Post successfully");
                },function (error) {
                    console.log(error.message);
                });
        }


        //GET /news/breaking
        var breakingApiUrl = '/news/breaking';

        ePaperFactory.getBreakingNews = function() {
            return $http.get(baseUrl + breakingApiUrl)
                .then(function(response) {
                    return response;
                });
        }

        //GET /news/categories
        var categoriesApiUrl = '/news/categories';

        ePaperFactory.getCategories = function() {
            return $http.get(baseUrl + categoriesApiUrl)
                .then(function(response) {
                    return response;
                });
        }

        //GET /news/today/{category}/{pageNo}news.pdf
        var newsPDFApiUrl = '/news/today/';

        ePaperFactory.getNewsPDF = function(category, pageNo) {
            return $http.get(baseUrl + newsPDFApiUrl + category + "/" + pageNo + "news.pdf")
                .then(function(response) {
                    return response;
                });
        }

        //GET /news/today/{category}/{pageNo}thumbnail.png
        var newsThumbnailApiUrl = '/news/today/';

        ePaperFactory.getNewsThumbnail = function(category, pageNo) {
            return $http.get(baseUrl + newsThumbnailApiUrl + category + "/" + pageNo + "thumbnail.png")
                .then(function(response) {
                    return response;
                });
        }

        return ePaperFactory;


    });



}());
