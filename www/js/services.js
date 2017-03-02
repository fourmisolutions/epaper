app.filter('startFrom', function() {
    return function(input, start) {
        //console.log(input);
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.factory('Categories', function(Category){
    function Categories(categories) {
        this.categories = categories;
    }
    
    Categories.build = function(data) {
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
            categories.push(Category.build(categoryId, data));
        });
        return new Categories(categories);
    }
    
    Categories.prototype.getTotal = function() {
        return this.categories.length;
    };
    Categories.prototype.getCategory = function(index) {
        return this.categories[index];
    }
    
    Categories.prototype.getTotalNews = function() {
        var total = 0;
        angular.forEach(this.categories, function(category) {
            total += category.getTotal();
        });
        return total;
    }
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
    return Categories
});
<<<<<<< HEAD
=======

app.factory('Category', function(){
    function Category(categoryId, news) {
        this.categoryId = categoryId;
        this.news = news;
    }
    Category.build = function(categoryId, data) {
        var arrayOfNews = [];
        angular.forEach(data, function(news, key) {
            if(news.category == categoryId) {
                arrayOfNews.push(news);
            }
        });
        return new Category(categoryId, arrayOfNews);
    }
    
    Category.prototype.getNewsStartFrom = function (currentPage, pageSize) {
        console.log(currentPage, pageSize);
        var start = currentPage * pageSize;
        var end = start + pageSize;
        return this.news.slice(start,end);
    };
    Category.prototype.getTotal = function() {
        return this.news.length;
    }
    Category.prototype.getNoOfPages = function(pageSize) {
        return Math.ceil(this.getTotal()/pageSize);  
    }
    Category.prototype.getStart = function(pageNo, pageSize) {
        return pageNo * pageSize + 1;
    }
    Category.prototype.getEnd = function(pageNo, pageSize) {
        return this.getStart(pageNo, pageSize) + pageSize - 1;
    }
    Category.prototype.getNews = function(index) {
        return this.news[index];
    }
    return Category;
});


app.factory('ePaperService', function($http, $q, Category, Categories) {
>>>>>>> 8201eaeba3e4957125aa040502d5e4ff48b9fefa

app.factory('Category', function(){
    function Category(categoryId, news) {
        this.categoryId = categoryId;
        this.news = news;
    }
    Category.build = function(categoryId, data) {
        var arrayOfNews = [];
        angular.forEach(data, function(news, key) {
            if(news.category == categoryId) {
                arrayOfNews.push(news);
            }
        });
        return new Category(categoryId, arrayOfNews);
    }
    
    Category.prototype.getNewsStartFrom = function (currentPage, pageSize) {
        console.log(currentPage, pageSize);
        var start = currentPage * pageSize;
        var end = start + pageSize;
        return this.news.slice(start,end);
    };
    Category.prototype.getTotal = function() {
        return this.news.length;
    }
    Category.prototype.getNoOfPages = function(pageSize) {
        return Math.ceil(this.getTotal()/pageSize);  
    }
    Category.prototype.getStart = function(pageNo, pageSize) {
        return pageNo * pageSize + 1;
    }
    Category.prototype.getEnd = function(pageNo, pageSize) {
        return this.getStart(pageNo, pageSize) + pageSize - 1;
    }
    Category.prototype.getNews = function(index) {
        return this.news[index];
    }
    return Category;
});


app.factory('ePaperService', function($http, $q, Category, Categories, $window) {

    
    var ePaperService = {};

    //POST login
    var loginApiUrl = '/login';

    ePaperService.login = function() {
        return $http.post(baseUrl + loginApiUrl, data)
            .then(function(status, headers){
                console.log("Post successfully");
            },function (error) {
                console.log(error.message);
            });
    }


    //GET /news/breaking - online version
<<<<<<< HEAD
	var baseUrl = 'http://shetest.theborneopost.com';
    var breakingApiUrl = 'http://shetest.theborneopost.com/seehua_breaking_news.json';
=======
    var breakingApiUrl = '/seehua_breaking_news.json';
>>>>>>> 8201eaeba3e4957125aa040502d5e4ff48b9fefa
    var breakingNews = [];
    ePaperService.getBreakingNews = function() {
        var deferred = $q.defer();

        if(breakingNews.length > 0) {
            deferred.resolve(breakingNews);
        } else {
            return $http.get(breakingApiUrl)
                .then(function(response) {
                    var news = response.data;
                    breakingNews = news;
                    return breakingNews;
                });
        }
    }

    //GET /news/breaking - local version
    /*
	var breakingApiUrl = '../api/seehua_breaking_news.json';
    var breakingNews = [];
    ePaperService.getBreakingNews = function() {

        var deferred = $q.defer();

        if(breakingNews.length > 0) {
            deferred.resolve(breakingNews);
        } else {
            return $http.get(breakingApiUrl)
                .then(function(response) {
                    var news = response.data;
                    breakingNews = news;					
                    return breakingNews;
                });
        }
    }
	*/
    
    /*
    ePaperService.getBreakingNewsById = function(id) {
        return ePaperFactory.getBreakingNews().then(function(breakingNews){
            return breakingNews[id];
        });
    }
    */

<<<<<<< HEAD
    //GET /news/categories    
	var categoriesApiUrl = 'http://shetest.theborneopost.com/seehua_pdf.json';

    /*ePaperService.getCategories = function() {
        return $http.get(categoriesApiUrl).then(function(response) {
            return Categories.build(response.data);
        });
    }*/
	
	ePaperService.getCategories = function() {
        return Categories.build(JSON.parse($window.localStorage.getItem("pdf_thumbnail")));
=======
    //GET /news/categories
    var categoriesApiUrl = '/seehua_pdf.json';

    ePaperService.getCategories = function() {
        return $http.get(baseUrl + categoriesApiUrl).then(function(response) {
            return Categories.build(response.data);
        });
>>>>>>> 8201eaeba3e4957125aa040502d5e4ff48b9fefa
    }
	

    //GET /news/today/{category}/{pageNo}news.pdf -- local version
    
    /*var newsPDFApiUrl = '/news/today/';

    ePaperService.getNewsPDF = function(category, pageNo) {
        return $http.get(baseUrl + newsPDFApiUrl + category + "/" + pageNo + "news.pdf")
            .then(function(response) {
                return response;
            });
    }
	*/
    

    //GET /news/today/{category}/{pageNo}news.pdf --online version
	
    //var newsPDFApiUrl = '../api/seehua_pdf.json';
	var newsPDFApiUrl = 'http://shetest.theborneopost.com/seehua_pdf.json';
    var newsPdf = [];
    ePaperService.getNewsPDF = function() {

        var deferred = $q.defer();

        if(newsPdf.length > 0) {
            deferred.resolve(newsPdf);
        } else {
            return $http.get(baseUrl + newsPDFApiUrl)
                .then(function(response) {
                    //var newspdf = response.data;
                    newsPdf = response.data;
					console.log(newsPdf);
                    return newsPdf;
                });
        }
    }
	

    //GET /news/today/{category}/{pageNo}thumbnail.png
    /*
	var newsThumbnailApiUrl = '/news/today/';

    ePaperService.getNewsThumbnail = function(category, pageNo) {
        return $http.get(baseUrl + newsThumbnailApiUrl + category + "/" + pageNo + "thumbnail.png")
            .then(function(response) {
                return response;
            });
    }
	*/

    return ePaperService;


});

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
});
