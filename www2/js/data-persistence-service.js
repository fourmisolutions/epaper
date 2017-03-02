var app = angular.module('epaper.breakingNewsControllers', ['ngProgress']);

app.factory("DataPersistenceService", ["$cookies", function($cookies) {
    var data = [];

    return {
        setCookieData: function(data) {
            $cookies.put("pdfURL", data.pdfURL);
            $cookies.put("thumbnailURL", data.thumbnailURL);

        },
        getCookieData: function() {
            data.pdfURL = $cookies.get("pdfURL");
            data.thumbnailURL = $cookies.get("thumbnailURL");

            return data;
        },
        clearCookieData: function() {
            data = [];
            $cookies.remove("FullName");
        }
    }
}
]);