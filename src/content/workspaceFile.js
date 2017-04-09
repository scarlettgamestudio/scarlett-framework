/**
 * Workspace File class
 */
class WorkspaceFile {

    //#region Constructors

    /**
     *
     * @param params
     * @constructor
     */
    constructor(params) {
        params = params || {};

        this.activeLayout = params.activeLayout || {};
    }

    //#endregion

    //#region Methods

    //#region Static Methods

    /**
     *
     * @param data
     * @returns {WorkspaceFile}
     */
    static restore(data) {
        return new WorkspaceFile(data);
    }

    //#endregion

    //#endregion

}