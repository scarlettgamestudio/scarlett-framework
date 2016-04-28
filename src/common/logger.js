/**
 * Logger class
 */
var Logger = (function () {

    // private properties
    var _this = {};

    /**
     * @constructor
     */
    function Logger(params) {
        params = params || {};

        // public properties:


        // private properties:
        _this.context = params.context || "Default";
    }

    Logger.prototype.log = function(message) {
        console.log(_this.context + " | " + message);
    };

    Logger.prototype.warn = function(message) {
        console.warn(_this.context + " | " + message);
    };

    Logger.prototype.error = function(message) {
        console.error(_this.context + " | " + message);
    };

    Logger.prototype.unload = function () {
        _this = null;
    };

    return Logger;

})();

// General Debug Logger
var debug = new Logger("Debug");