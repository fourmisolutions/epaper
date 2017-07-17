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
