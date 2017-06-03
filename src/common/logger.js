/**
 *  Logger Class
 */
export default class Logger {

    //#region Constructors

    constructor(params) {
        params = params || {};

        // private properties:
        this._context = params.context || "Default";
    }

    //#endregion

    //#region Methods

    log(message) {
        console.log(this._context + " | " + message);
    }

    warn(message) {
        console.warn(this._context + " | " + message);
    }

    error(message) {
        console.error(this._context + " | " + message);
    }

    //#endregion

}

// General Debug Logger
let debug = new Logger("Debug");