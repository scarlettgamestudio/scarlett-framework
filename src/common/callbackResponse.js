/**
 * CallbackResponse Class
 */
export default class CallbackResponse {

    //#region Constructors

    constructor(params) {
        params = params || {};

        this.success = params.success;
        this.data = params.data || {};
    }

    //#endregion

    //#region Methods

    isSuccessful() {
        return this.success;
    }

    //#endregion

}