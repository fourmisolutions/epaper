//base worker
app.factory("BaseWorker", function($q) {

    function BaseWorker(workerFunction) {
        this.workerFunction = workerFunction;

        //this.worker;

        if (this.worker) {
            this.worker.terminate();
        }

        // convert the workerFunction to string
        var dataObj = '(' + this.workerFunction + ')();'; 
        // firefox adds user strict to any function which was blocking might block worker execution so knock it off
        var blob = new Blob([dataObj.replace('"use strict";', '')]); 

        var blobURL = (window.URL ? URL : webkitURL).createObjectURL(blob, {
            type: 'application/javascript; charset=utf-8'
        });

        this.worker = new Worker(blobURL);
        this.worker.onerror = function(error) {
            console.error('error.message=' + error.message);
        };
    }

    BaseWorker.prototype.startWork = function(postData) {
        var defer = $q.defer();

        this.worker.onmessage = function(e) {
            //console.log('Worker said: ', e.data);
            defer.notify(e.data);
        };
        this.worker.postMessage(postData); // Send data to our worker.
        return defer.promise;
    };

    BaseWorker.prototype.stopWork = function() {
        if (this.worker) {
            this.worker.terminate();
        }
    };

    return BaseWorker;
});
