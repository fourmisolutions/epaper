// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

(function(){
var app = angular.module('epaper', ['ionic', 'epaper.controllers','epaper.breakingNewsControllers', 'tabSlideBox', 'gesture-pdf'])

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
      });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/tabs');
});
}());
