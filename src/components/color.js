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

	Color.prototype.toArray = function() {
		return [this.r, this.g, this.b, this.a];
	};

	Color.prototype.toFloat32Array = function() {
		return new Float32Array([this.r, this.g, this.b, this.a]);
	};

	Color.prototype.unload = function () {
		_this = null;
	};

	Color.fromRGBA = function(red, green, blue, alpha) {
		return new Color({r: red / 255.0, g: green / 255.0, b: blue / 255.0, a: alpha});
	};

	Color.fromRGB = function(red, green, blue) {
		return new Color({r: red / 255.0, g: green / 255.0, b: blue / 255.0, a: 1.0});
	};

	/**
	 * Default colors
	 */
	Color.CornflowerBlue = Color.fromRGBA(100, 149, 237, 1.0);

	return Color;

})();