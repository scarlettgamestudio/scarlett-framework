/**
 * CallbackResponse Class
 */
export default class CallbackResponse {

    //#region Constructors

    private _success: boolean;
    private _data: any;

    constructor(params) {
        params = params || {};

        this._success = params.success;
        this._data = params.data || {};
    }

    //#endregion

    //#region Methods

    isSuccessful() {
        return this._success;
    }

    //#endregion

}