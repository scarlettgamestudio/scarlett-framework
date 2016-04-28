/**
 * Vector4 class for tri dimensional point references
 */
var Vector4 = (function () {

	// private properties
	var _this = {};

	/**
	 * @constructor
	 */
	function Vector4(x, y, z, w) {
		// public properties:
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = w || 0;

		// private properties:

	}

	Vector4.prototype.toJSON = function() {
		return JSON.stringify({
			x: this.x,
			y: this.y,
			z: this.z,
			w: this.w
		});
	};

	Vector4.prototype.unload = function () {
		_this = null;
	};

	return Vector4;

})();