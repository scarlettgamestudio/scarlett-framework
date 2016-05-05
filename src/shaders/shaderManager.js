/**
 * ShaderManager class
 */
/**
 * @constructor
 */
function ShaderManager(game) {
	// private variables
	this._game = game;
	this._gl = this._game.getRenderContext().getContext();
	this._activeShader = null;
}

ShaderManager.prototype.unload = function () {

};

ShaderManager.prototype.useShader = function(shader) {
	// is this the same shader that is being used?
	if(!isObjectAssigned(this._activeShader) || this._activeShader.getUID() !== shader.getUID()) {
		this._activeShader = shader;
		this._gl.useProgram(shader.getProgram());
	}
};
