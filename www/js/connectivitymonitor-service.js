var app = angular.module('epaper.controllers', ['ionic', 'ngCordova']);

app.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork){
 
  return {
    isOnline: function(){
      if(ionic.Platform.isWebView()){
        return $cordovaNetwork.isOnline();    
      } else {
        return navigator.onLine;
      }
    },
    isOffline: function(){
      if(ionic.Platform.isWebView()){
        return !$cordovaNetwork.isOnline();    
      } else {
        return !navigator.onLine;
      }
    },
    startWatching: function(){
        if(ionic.Platform.isWebView()){
 
          $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
            console.log("went online");
			alert("went online");
          });
 
          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            console.log("went offline");
			alert("went offline");
          });
 
        }
        else {
 
          window.addEventListener("online", function(e) {
            console.log("went online");
			alert("went online");
          }, false);    
 
          window.addEventListener("offline", function(e) {
            console.log("went offline");
			alert("went offline");
          }, false);  
        }       
    }
  }
})