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
    Categories.prototype.getCategoryByCategoryId = function(categoryId) {
        var category;
        angular.forEach(this.categories, function(data) {
            if(data.categoryId == categoryId) {
                category = data;
            }
        });
        return category;
    }
    Categories.prototype.getNews = function(categoryId, pageNo) {
        return this.getCategoryByCategoryId(categoryId).getNewsByPageNo(pageNo);
    }
    return Categories
});

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
    
    Category.prototype.getNewsByPageNo = function(pageNo) {
        var news = this.getNews(pageNo);
        if(news != undefined && news.pageNo == pageNo) {
            return news;
        }
        angular.forEach(this.news, function(data) {
            if(data.pageNo == pageNo) {
                news = data;
            }
        });
        return news;
    }
    return Category;
});

app.factory('ePaperService', function($http, $q, Category, Categories) {
   	var baseUrl = 'http://shetest.theborneopost.com';
    var ePaperService = {};
    //POST login
    var loginApiUrl = '/login';
    ePaperService.login = function() {
        return $http.post(baseUrl + loginApiUrl, data)
            .then(function(status, headers){
            },function (error) {
            });
    }


    //GET /news/breaking - online version
    var breakingApiUrl = '/seehua_breaking_news.json';
    //no cache for breaking news
    ePaperService.getBreakingNews = function() {  
	     return $http.get(baseUrl + breakingApiUrl, {cache:false}).then(function(response) {
            return response.data;
        });
    }

    //GET /news/categories    
    var today = new Date();//this is to get once a day
	var categoriesApiUrl = '/seehua_pdf.json?date=' + today.toISOString().substring(0, 10);;
    ePaperService.getCategories = function() {
        return $http.get(baseUrl + categoriesApiUrl, {cache:true}).then(function(response) {
            return Categories.build(response.data);
        }, function(error){
            return undefined;
        });
    }
    ePaperService.getNews = function(categoryId, pageNo) {
        return ePaperService.getCategories().then(function(categories){
           return categories.getNews(categoryId, pageNo);
        });
    }
	return ePaperService;
});
