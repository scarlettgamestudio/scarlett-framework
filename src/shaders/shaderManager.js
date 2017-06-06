import { isObjectAssigned } from "common/utils";

/**
 * ShaderManager class
 */
export default class ShaderManager {
  //#region Constructors

  /**
     * @param game
     * @constructor
     */
  constructor(game) {
    // private variables
    this._game = game;
    this._gl = this._game.getRenderContext().getContext();
    this._activeShader = null;
  }

  //#endregion

  //#region Methods

  unload() {}

  useShader(shader) {
    // is this the same shader that is being used?
    if (
      !isObjectAssigned(this._activeShader) ||
      this._activeShader.getUID() !== shader.getUID()
    ) {
      this._activeShader = shader;
      this._gl.useProgram(shader.getProgram());
    }
  }

  //#endregion
}
