/**
 * Project File class
 */
class ProjectFile {

    //#region Constructors

    /**
     *
     * @param params
     * @constructor
     */
    constructor(params) {
        params = params || {};

        this.name = params.name || "New Project";
        this.settings = params.settings || {};
        this.editor = params.editor || {
                lastScene: null,
                layout: null
            };
        this.content = params.content || {};
    }

    //#endregion

    //#region Methods

    //#region Static Methods

    /**
     *
     * @param data
     * @returns {ProjectFile}
     */
    static restore(data) {
        return new ProjectFile(data);
    }

    //#endregion

    //#endregion

}