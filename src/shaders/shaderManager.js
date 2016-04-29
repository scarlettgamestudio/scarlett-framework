/**
 * ShaderManager class
 */
var ShaderManager = (function () {

	// private properties
	var _this = {};

	/**
	 * @constructor
	 */
	function ShaderManager(game) {
		// private variables
		_this.game = game;
		_this.gl = _this.game.getRenderContext().getContext();
		_this.activeShader = null;
	}

	ShaderManager.prototype.unload = function () {
		_this = null;
	};
	
	ShaderManager.prototype.useShader = function(shader) {
		// is this the same shader that is being used?
		if(!isObjectAssigned(_this.activeShader) || _this.activeShader.getUID() !== shader.getUID()) {
			_this.activeShader = shader;
			_this.gl.useProgram(shader.getProgram());
		}
	};

	/**
	 * Static methods
	 */
	
	return ShaderManager;

})();