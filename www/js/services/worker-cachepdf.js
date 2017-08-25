// Web Worker Service: 
// - Pre-download PDF file in the background to allow subsequent file requests of the same file to be served from disk cache
app.factory("CachePdfWorker", function(BaseWorker) {

    function workerFunction() {
        var self = this;
        self.onmessage = function(event) {
            //console.log('Called from main script: ' + event.data);
            var dataUrl = event.data;

            // web worker runs in a different global context than the main app context
            // hence only standard javascript available out-of-the-box
            // refer to: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Functions_and_classes_available_to_workers
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    //var response = JSON.parse(xmlhttp.responseText);
                    
                    // post back the resource url after completion
                    self.postMessage(event.data);
                }
            };
            xmlhttp.open('GET', dataUrl, true);
            xmlhttp.send();
        }
    }

    var service = {};

    var workerService = new BaseWorker(workerFunction);

    service.startWork = function(postData) {
        return workerService.startWork(postData);
    };

    service.stopWork = function() {
        workerService.stopWork();
    };

    return service;
});
