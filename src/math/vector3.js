/**
 * Vector3 class for tri dimensional point references
 */
var Vector3 = (function () {

	// private properties
	var _this = {};

	/**
	 * @constructor
	 */
	function Vector3(x, y, z) {
		// public properties:
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;

		// private properties:

	}

	Vector3.prototype.toJSON = function() {
		return JSON.stringify({
			x: this.x,
			y: this.y,
			z: this.z
		});
	};

	Vector3.prototype.unload = function () {
		_this = null;
	};

	return Vector3;

})();