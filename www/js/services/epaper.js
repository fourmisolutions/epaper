app.factory('ePaperService', function($http, $q, Category, Categories, TodayShCategories, $cordovaPreferences, ShApiConstants, ApiEndpoint, CachePdfWorker) {
    var ePaperService = {};

    /** 
     * param "targetUrl": "http://.../..." excluding any request params starting with "?"
     * param "paramOptions": pre-defined options to construct the url params, e.g. { optionKey1 : optionValue1, optionKey2 : optionValue2 }
     * - Options:
     *   - appendCurrentDate: true|false
     *     - auto-append today's date to the url.
     */ 
    ePaperService.constructApiUrl = function(targetUrl, paramOptions) {

        // remove original baseUrl if present
        var baseUrlPattern = /^https?:\/\/[^\/:]+/i;
        var strippedTargetUrl = targetUrl.replace(baseUrlPattern, '');

        var paramArray = [];

        // append any pre-defined optional parameters
        if (paramOptions) {
            if (paramOptions.appendCurrentDate) {
                var today = new Date();
                paramArray.push('date=' + today.toISOString().substring(0, 10));
            }
        }

        var paramStr = '';
        if (paramArray.length > 0)
            paramStr = '?' + paramArray.join('&');

//      console.log(
//      'aPaperService.constructApiUrl(): ' 
//      + 'targetUrl=' + targetUrl + ', ' 
//      + 'strippedTargetUrl=' + strippedTargetUrl + ', '
//      + 'paramStr=' + paramStr);

        var result = ApiEndpoint.url + strippedTargetUrl + paramStr;

        //console.log('aPaperService.constructApiUrl(): result=' + result);

        return result;

    }

    //POST login
    ePaperService.login = function(username, password) {

        // get session token
        var getSessionToken = function() {
            var sessionTokenUrl = ShApiConstants.sessionTokenUrl;

            return $http.get(ePaperService.constructApiUrl(sessionTokenUrl), {cache:false});
        };

        var postLogin = function(username, password, sessionToken) {
            var loginUrl = ShApiConstants.loginUrl;

            return $http({
                method : 'post',
                url : ePaperService.constructApiUrl(loginUrl),
                headers : { 'X-CSRF-Token' : sessionToken },
                data : {'username' : username, 'password' : password},
                withCredentials: true
            });
        };

        // submit login request
        return getSessionToken().then(function(response){
            return postLogin(username, password, response.data);
        }, function(error){
            throw error;
        });
    };

    //POST logout
    ePaperService.logout = function(sessionToken) {
        var postLogout = function(sessionToken) {
            var logoutUrl = ShApiConstants.logoutUrl;

            return $http({
                method : 'post',
                url : ePaperService.constructApiUrl(logoutUrl),
                headers : { 'X-CSRF-Token' : sessionToken },
                data : {'1' : 1}
            });
        };

        // submit login request
        return postLogout(sessionToken);
    };

    //GET /news/breaking - online version
    var breakingApiUrl = ShApiConstants.breakingNewsListUrl;
    //no cache for breaking news
    ePaperService.getBreakingNews = function() {  
        return $http.get(ePaperService.constructApiUrl(breakingApiUrl), {cache:false}).then(function(response) {
            return response.data;
        });
    }

    //GET /news/categories - epaper
    var categoriesApiUrl = ShApiConstants.seehuaEpaperListUrl;
    ePaperService.getCategories = function() {
        return $http.get(ePaperService.constructApiUrl(categoriesApiUrl, {appendCurrentDate: true}), {cache:true}).then(function(response) {
            return new Categories(response.data);
        }, function(error){
            return undefined;
        });
    }
    ePaperService.getNews = function(categoryId, pageNo) {
        return ePaperService.getCategories().then(function(categories){
            return categories.getNews(categoryId, pageNo);
        });
    }

    //GET /news/categories - today seehua (todaySh)
    var todayShCategoriesApiUrl = ShApiConstants.seehuaTodayListUrl;
    ePaperService.getTodayShCategories = function() {
        return $http.get(ePaperService.constructApiUrl(todayShCategoriesApiUrl, {appendCurrentDate: true}), {cache:true}).then(function(response) {
            return new TodayShCategories(response.data);
        }, function(error){
            return undefined;
        });
    }

    ePaperService.getTodayShNews = function(categoryId) {
        return ePaperService.getTodayShCategories().then(function(categories){
            return categories.getNewsByCategoryId(categoryId);
        });
    }

    var registerPushNotificationUrl = ShApiConstants.pushNotificationUrl;
    ePaperService.registerPushNotification = function(token, platform) {
        var request = {
                token: token,
                type: platform
        }
        console.log("request", request);
        $http.post(ePaperService.constructApiUrl(registerPushNotificationUrl), request).then(function(response){
            console.log("register push notification", response);
            $cordovaPreferences.store('token', token).success(function(value) {
                console.log("store successfully", value);
            }).error(function(error) {
                console.log("failed", error);
            });
        }, function(error){
            console.log("fail to register push notification", error);
        });
    }

    ePaperService.getBreakingNewsCount = function() {
        if(localStorage.getItem("breakingNewsCount") == undefined) {
            localStorage.setItem("breakingNewsCount", 0);
        }
        return parseInt(localStorage.getItem("breakingNewsCount"));
    }

    ePaperService.setBreakingNewsCount = function(breakingNewsCount) {
        return localStorage.setItem("breakingNewsCount", breakingNewsCount);
    }

    ePaperService.clearCache = function() {
        var now = new Date();
        if(localStorage.getItem("lastUpdateDate") == undefined) {
            localStorage.setItem("lastUpdateDate", new Date());
        }
        var lastUpdateDate = new Date(Date.parse(localStorage.getItem("lastUpdateDate")));
        if(lastUpdateDate.getDate() != now.getDate() || lastUpdateDate.getMonth() != now.getMonth()) {
            if(window.cache != undefined) {
                window.cache.clear();
            }
            
            // clear Today Seehua pdf file urls cache
            ePaperService.todayShPdfHistory = [];
            
            localStorage.setItem("lastUpdateDate", now);
        }
    }
    
    // cache to store Today SeeHua pdf file urls which has been loaded previously
    ePaperService.todayShPdfHistory = [];
    
    // Attempt to push the provided pdf url into the history
    ePaperService.pushIntoTodayShPdfHistory = function(pdfUrl) {
        // Check if the provided pdf url is in the cache array
        var index = ePaperService.todayShPdfHistory.findIndex(function(item) { return item === pdfUrl; });
        if (index >= 0) {
            // If found, return false
            //console.log('found in cache pdfUrl=' + pdfUrl);
            return false;
        } else {
            // If not found, push into the cache, return true
            //console.log('not found in cache pdfUrl=' + pdfUrl);
            ePaperService.todayShPdfHistory.push(pdfUrl);
            return true;
        }
    };
    
    // Today Seehua: Pre-download PDF contents of news within the same category of current selected news
    ePaperService.preDownloadTodayShPdf = function (categoryId) {
        //console.log('preloading categoryId=' + categoryId);
        
        // get the list of news of the provided categoryId
        ePaperService.getTodayShNews(categoryId).then(function(newsList){
            // for each of the news in the list
            angular.forEach(newsList, function(news, key) {
                var pdfUrl = news.pdf;
                // attempt to push the pdf url into history
                if (ePaperService.pushIntoTodayShPdfHistory(pdfUrl)) {
                    // if push success, proceed to preload the pdf content
                    //console.log('proceed to preload content: ' + pdfUrl);
                    CachePdfWorker.startWork(pdfUrl);
                } else {
                    //console.log('skip preload content: ' + pdfUrl);
                }
            });
        });
        
    };
    
    return ePaperService;
});

