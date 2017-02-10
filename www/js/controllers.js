angular.module('starter.controllers', [])

.controller('PdfCtrl', function ($scope, $state) {
    var scope = $scope;
    var tCtrl = this;

    this.onLoad = function (pag) {
        console.log('Num pages: ' + pag);
    };

    this.onError = function (err) {
        console.error('Error: ' + JSON.stringify(err, null, 4));
    };

    this.onProgress = function (progress) {
        //console.log('Progress: ' + (progress.loaded/progress.total*100) + '%');
    };

    this.onRenderPage = function (page) {
        console.log('Page: ' + page);
    };

    scope.options = {
        pdfUrl: 'pdf/pdf.pdf',
        onLoad: tCtrl.onLoad,
        onProgress: tCtrl.onProgress,
        onError: tCtrl.onError,
        onRenderPage: tCtrl.onRenderPage
    };
    console.log(JSON.stringify(scope.options, null, 4));
});