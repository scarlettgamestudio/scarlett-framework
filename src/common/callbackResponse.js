
/**
 * CallbackResponse class
 */
var CallbackResponse = (function () {

    /**
     * @constructor
     */
    function CallbackResponse(params) {
        params = params || {};

        this.success = params.success;
        this.data = params.data || {};
    }

    CallbackResponse.prototype.isSuccessful = function() {
      return this.success;
    };

    return CallbackResponse;

})();