/**
 * Vector2 class for bi dimensional point references
 */
var Vector2 = (function () {

	// private properties
	var _this = {};

	/**
	 * @constructor
	 */
	function Vector2(x, y) {
		// public properties:
		this.x = x || 0;
		this.y = y || 0;

		// private properties:

	}

	Vector2.prototype.toJSON = function() {
		return JSON.stringify({
			x: this.x,
			y: this.y
		});
	};

	Vector2.prototype.unload = function () {
		_this = null;
	};

	return Vector2;

})();