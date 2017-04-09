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
        this.content = params.content || {
                scripts: []
            };

        this.ensureContentStructure();
    }

    //#endregion

    //#region Methods

	//#region Methods

    ensureContentStructure () {
	    this.content = this.content || {};

	    if (!this.content.hasOwnProperty("scripts")) {
		    this.content.scripts = [];
	    }
    }

    //#endregion

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