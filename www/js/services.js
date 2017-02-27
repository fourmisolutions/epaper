app.factory('ePaperService', function($http, $q) {

    var baseUrl = 'http://shetest.theborneopost.com';
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
    var breakingApiUrl = '/seehua_breaking_news.json';
    var breakingNews = []
    ePaperService.getBreakingNews = function() {
        
        var deferred = $q.defer();

        if(breakingNews.length > 0) {
            deferred.resolve(breakingNews);
        } else {
            return $http.get(baseUrl + breakingApiUrl)
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

    //GET /news/categories
    var categoriesApiUrl = '/news/categories';

    ePaperService.getCategories = function() {
        return $http.get(baseUrl + categoriesApiUrl)
            .then(function(response) {
                return response;
            });
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
	var newsPDFApiUrl = '/seehua_pdf.json';
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
    var newsThumbnailApiUrl = '/news/today/';

    ePaperService.getNewsThumbnail = function(category, pageNo) {
        return $http.get(baseUrl + newsThumbnailApiUrl + category + "/" + pageNo + "thumbnail.png")
            .then(function(response) {
                return response;
            });
    }

    return ePaperService;


});
