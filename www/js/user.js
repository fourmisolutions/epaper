app.factory('User', function($http, $cookies, ePaperService, ShApiConstants, $q) {
        var localStorage = window.localStorage;
		var user = {}
        user.login = function(username, password) {
            return ePaperService.login(username, password).then(function(response){
                //console.log('MenuCtrl.doLogin(): data=' + JSON.stringify(response));
            
                // store credentials and returned data in local storage for subsequent api calls
                localStorage.setItem('shApiUsername', username);
                //console.log('username: ' + $scope.loginData.username);
                
                var passwordEnc = window.btoa(password);
                localStorage.setItem('shApiPassword', passwordEnc);
                //console.log('passwordEnc: ' + passwordEnc);
                
                localStorage.setItem('shApiSessionToken', response.data.token);
                //console.log('sessionToken: ' + response.data.token);
                
                localStorage.setItem('shApiSessionKey', response.data.session_name);
                //console.log('sessionKey: ' + response.data.session_name);
                
                localStorage.setItem('shApiSessionValue', response.data.sessid);
                //console.log('sessionValue: ' + response.data.sessid);
                $cookies.put(response.data.session_name, response.data.sessid,{path:'/'});
                sessionStorage.setItem('toRefreshShApiSession', 'N');
                return response;
            }, function(error){
                throw error;
            });
        }
        user.logout = function() {
            //console.log('Proceed logout ...');                
            var postLogoutProcess = function() {
                    // remove previously saved data in local storage
                    localStorage.removeItem('shApiUsername');
                    localStorage.removeItem('shApiPassword');
                    localStorage.removeItem('shApiSessionToken');
                    localStorage.removeItem('shApiSessionKey');
                    localStorage.removeItem('shApiSessionValue');
                    var cookies = $cookies.getAll();
                    angular.forEach(cookies, function (v, k) {
                        $cookies.remove(k);
                    });
                    
            };
            if (localStorage.getItem('shApiSessionToken') != undefined) {
                return ePaperService.logout(localStorage.getItem('shApiSessionToken')).then(function(response){
                    //console.log('MenuCtrl.confirmLogout(): response=' + JSON.stringify(response));
                    postLogoutProcess();
                    
                }, function(error){
                    
                    //console.log('MenuCtrl.confirmLogout(): error=' + JSON.stringify(error));
                    
                    // proceed to process logout even with api call error
                    postLogoutProcess();
                    
                });
            } else {//TODO - this doesn't seem a good implementation. refactor.
                var deffered = $q.defer();
                postLogoutProcess();
                deffered.reject('');
                return deffered.promise;
            }
            
        }
        user.isLoggedIn = function() {
            var loggedIn = localStorage.getItem('shApiUsername') != undefined;
            return loggedIn;
        }
        user.username = function() {
            return localStorage.getItem('shApiUsername');
        }
        user.refreshShApiSession = function() {
            if(!user.isLoggedIn() && sessionStorage.getItem('toRefreshShApiSession') != undefined) {
                return;
            }
            // verify if session cookies is still available
            // - if gone need to refresh session data based on localStorage values
            // - possible scenario: user closed the app intentionally or restart device
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
                    
                    sessionStorage.setItem('toRefreshShApiSession', 'N');
                    
                }, function(error){
                    
                    console.error('refreshShApiSession(): error=' + JSON.stringify(error));

                });
            
		};
        return user;
	});