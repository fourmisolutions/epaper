app.factory('ePaperService', function($http, $q) {

    var baseUrl = 'http://shetest.theborneopost.com';
    var ePaperFactory = {};

    //POST login
    var loginApiUrl = '/login';
    var breakingNews = [];
    ePaperFactory.login = function() {
        return $http.post(baseUrl + loginApiUrl, data)
            .then(function(status, headers){
                console.log("Post successfully");
            },function (error) {
                console.log(error.message);
            });
    }


    //GET /news/breaking
    var breakingApiUrl = '/seehua_breaking_news.json';

    ePaperFactory.getBreakingNews = function() {
        
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
    
    ePaperFactory.getBreakingNewsById = function(id) {
        return ePaperFactory.getBreakingNews().then(function(breakingNews){
            return breakingNews[id];
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
