
//Google Analytics service
app.factory('GaService', function(ShApiConstants) {

    var service = {};

    service.trackView = function(viewTitle) {
        if (!ShApiConstants.useProxy 
                && typeof window.ga !== 'undefined') { 
            console.log('ga.trackView.viewTitle = ' + viewTitle);
            window.ga.trackView(viewTitle); 
        }
    }

    return service;

});
