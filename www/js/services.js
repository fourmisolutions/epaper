
app.factory('TodayShCategory', function(ShApiConstants){
    
    function TodayShCategory(categoryId, data) {
        this.categoryId = categoryId;
        
        var arrayOfNews = [];
        angular.forEach(data, function(news, key) {
            if(news.category == categoryId) {
                arrayOfNews.push(news);
            }
        });
        
        this.news = arrayOfNews;
    }
    
    TodayShCategory.prototype.getTotal = function() {
        return this.news.length;
    }
    
    TodayShCategory.prototype.getNewsList = function() {
        return this.news;
    }
    
    TodayShCategory.prototype.getNews = function(index) {
        return this.news[index];
    }
    
    TodayShCategory.prototype.getCategoryDesc = function() {
        return ShApiConstants.chineseMenuDictionary[this.categoryId];
    }
    
    return TodayShCategory;
});

app.factory('Category', function(TodayShCategory){
     
    function Category(categoryId, data) {
        TodayShCategory.call(this, categoryId, data);
    }
    
    Category.prototype = Object.create(TodayShCategory.prototype);
    Category.prototype.constructor = Category;
    
    Category.prototype.getNewsStartFrom = function (currentPage, pageSize) {
        var start = currentPage * pageSize;
        var end = start + pageSize;
        return this.news.slice(start,end);
    };
    Category.prototype.getNoOfPages = function(pageSize) {
        return Math.ceil(this.getTotal()/pageSize);  
    }
    Category.prototype.getStart = function(pageNo, pageSize) {
        return pageNo * pageSize + 1;
    }
    Category.prototype.getEnd = function(pageNo, pageSize) {
        return this.getStart(pageNo, pageSize) + pageSize - 1;
    }
    Category.prototype.getNewsByPageNo = function(pageNo) {
        var news = this.getNews(pageNo);
        if(news != undefined && news.pagenumber == pageNo) {
            return news;
        }
        angular.forEach(this.news, function(data) {
            if(data.pagenumber == pageNo) {
                news = data;
            }
        });
        return news;
    }
    
    return Category;
});

app.factory('TodayShCategories', function(TodayShCategory, $filter){
    function TodayShCategories(data, catConstructor) {
        if (catConstructor === undefined)
            catConstructor = TodayShCategory;
        
        function getCategoryIds(data) {
            var categoriesIds = [];
            angular.forEach(data, function(news, key) {
                //not exists
                if(categoriesIds.indexOf(news.category) == -1) {
                    categoriesIds.push(news.category);
                }
            });
            return categoriesIds;
        }
        var categoryIds = getCategoryIds(data);
        var categories = [];
        angular.forEach(categoryIds, function(categoryId, key) {
            categories.push(new catConstructor(categoryId, data));
        });
        
        this.categories = $filter('orderBy')(categories, 'categoryId');
    }
    
    TodayShCategories.prototype.getTotal = function() {
        return this.categories.length;
    };
    TodayShCategories.prototype.getCategory = function(index) {
        return this.categories[index];
    }
    
    TodayShCategories.prototype.getTotalNews = function() {
        var total = 0;
        angular.forEach(this.categories, function(category) {
            total += category.getTotal();
        });
        return total;
    }
    
    TodayShCategories.prototype.getCategoryByCategoryId = function(categoryId) {
        var category;

        var index = this.categories.findIndex(function(item) { return item.categoryId === categoryId });
        if (index >= 0) {
            category = this.categories[index];
        } else {
            console.error('category not found for categoryId=' + categoryId);
        }

        return category;
    }
    
    TodayShCategories.prototype.getNewsByCategoryId = function(categoryId) {
        return this.getCategoryByCategoryId(categoryId).getNewsList();
    }
    
    return TodayShCategories;
});

app.factory('Categories', function(TodayShCategories, Category, $filter){
    
    function Categories(data) {
        TodayShCategories.call(this, data, Category);
    }
    
    Categories.prototype = Object.create(TodayShCategories.prototype);
    Categories.prototype.constructor = Categories;
    
    Categories.prototype.getNoOfPages = function(pageSize) {
        var total = 0;
        angular.forEach(this.categories, function(category) {
            total += category.getNoOfPages(pageSize);
        }); 
        return total;
    }
    Categories.prototype.getPageNo = function(categoryIndex, categoryPageNo, pageSize) {
        var index = 0;
        var pageNo = 0;
        for (i = 0; i < categoryIndex; i++) {
            var category = this.getCategory(i);
            var noOfPages = category.getNoOfPages(pageSize);
            pageNo += noOfPages;
        }
        pageNo += categoryPageNo;
        return pageNo;
    }
    Categories.prototype.getNews = function(categoryId, pageNo) {
        return this.getCategoryByCategoryId(categoryId).getNewsByPageNo(pageNo);
    }
    return Categories;
});

app.factory('ePaperService', function($http, $q, Category, Categories, TodayShCategories, $cordovaPreferences, ShApiConstants, ApiEndpoint) {
   	var ePaperService = {};

    // param "targetUrl": "http://.../..." excluding any request params starting with "?" 
    ePaperService.constructApiUrl = function(targetUrl) {
    	
    	// remove original baseUrl if present
    	var baseUrlPattern = /^https?:\/\/[^\/:]+/i;
    	var strippedTargetUrl = targetUrl.replace(baseUrlPattern, '');
    	//console.log('aPaperService.constructApiUrl(): targetUrl=' + targetUrl + ', strippedTargetUrl=' + strippedTargetUrl);
    	
    	var result = ApiEndpoint.url + strippedTargetUrl;
    	
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
            localStorage.setItem("lastUpdateDate", now);
        }
    }
    
    return ePaperService;
});

//Google Analytics service
app.factory('GaService', function(ShApiConstants) {
    
    var service = {};
    
    service.trackView = function(viewTitle) {
        if (!ShApiConstants.useProxy 
                && typeof window.ga !== 'undefined') { 
            console.log('ga.trackView.viewTitle = ' + viewTitle);
            window.ga.trackView(viewTitle); 
        }
    }
    
    return service;
    
})
