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
