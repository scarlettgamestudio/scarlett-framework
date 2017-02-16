/**
 * Game Manager static class
 */
class GameManager {

    //#region Static Properties

    /**
     * The active render context
     * @type {renderContext}
     */
    static get renderContext() {
        return this._renderContext;
    }

    /**
     * The active render context
     * @type {renderContext}
     */
    static set renderContext(value) {
        this._renderContext = value;
    }

    static get activeScene() {
        return this._activeScene;
    }

    static set activeScene(value) {
        this._activeScene = value;
    }

    static get activeProject() {
        return this._activeProject;
    }

    static set activeProject(value) {
        this._activeProject = value;
    }

    static get activeGame() {
        return this._activeGame;
    }

    static set activeGame(value) {
        this._activeGame = value;
    }

    static get activeProjectPath() {
        return this._activeProjectPath;
    }

    static set activeProjectPath(value) {
        this._activeProjectPath = value;
    }

    //#endregion

    //#region Constructors

    constructor() {

    }

    //#endregion

}