/**
 * Color class
 */
var Color = (function () {

	// private properties
	var _this = {};

	/**
	 * @constructor
	 */
	function Color(params) {
		params = params || {};

		// public properties:
		this.r = params.r || 0.0;
		this.g = params.g || 0.0;
		this.b = params.b || 0.0;
		this.a = params.a || 1.0;

		// private properties:

	}

	Color.prototype.toJSON = function() {
		return JSON.stringify(this);
	};

	Color.prototype.unload = function () {
		_this = null;
	};

	return Color;

})();