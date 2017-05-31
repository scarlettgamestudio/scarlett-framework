/**
 *  Logger Class
 */
class Logger {

    //#region Fields

    private _context: string;

    //#endregion

    //#region Constructors

    constructor (params) {
        params = params || {};

        // private properties:
        this._context = params.context || "Default";
    }

    //#endregion

    //#region Methods

    log (message: string): void {
        console.log(this._context + " | " + message);
    }

    warn (message: string): void {
        console.warn(this._context + " | " + message);
    }

    error (message: string): void {
        console.error(this._context + " | " + message);
    }

    //#endregion

}

// General Debug Logger
export const Debug = new Logger("Debug");
