function Logger(params) {
    params = params || {};

    // private properties:
    this._context = params.context || "Default";
}

// functions
Logger.prototype.log = function(message) {
    console.log(this._context + " | " + message);
};

Logger.prototype.warn = function(message) {
    console.warn(this._context + " | " + message);
};

Logger.prototype.error = function(message) {
    console.error(this._context + " | " + message);
};

// General Debug Logger
var debug = new Logger("Debug");