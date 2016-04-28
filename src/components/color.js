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

	Color.FromRGBA = function(red, green, blue, alpha) {
		return new Color({r: red / 255.0, g: green / 255.0, b: blue / 255.0, a: alpha});
	};

	/**
	 * Default colors
	 */
	Color.CornflowerBlue = Color.FromRGBA(100, 149, 237, 1.0);

	return Color;

})();