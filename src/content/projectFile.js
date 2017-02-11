/**
 * Project File class
 */
class ProjectFile {
    /**
     *
     * @param params
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

    /**
     *
     * @param data
     * @returns {ProjectFile}
     */
    static restore(data) {
        return new ProjectFile(data);
    }
}