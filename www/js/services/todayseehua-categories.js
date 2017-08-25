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

        var index = this.categories.findIndex(function(item) { return item.categoryId === categoryId; });
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
