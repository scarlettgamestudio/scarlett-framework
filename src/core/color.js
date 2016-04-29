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

    Color.prototype.toJSON = function () {
        return JSON.stringify({
            r: this.r,
            g: this.g,
            b: this.b,
            a: this.a
        });
    };

    Color.prototype.toArray = function () {
        return [this.r, this.g, this.b, this.a];
    };

    Color.prototype.toFloat32Array = function () {
        return new Float32Array([this.r, this.g, this.b, this.a]);
    };

    Color.prototype.unload = function () {
        _this = null;
    };

    Color.fromRGBA = function (red, green, blue, alpha) {
        return new Color({r: red / 255.0, g: green / 255.0, b: blue / 255.0, a: alpha});
    };

    Color.fromRGB = function (red, green, blue) {
        return new Color({r: red / 255.0, g: green / 255.0, b: blue / 255.0, a: 1.0});
    };

    /**
     * Default colors
     */
    Color.CornflowerBlue = Color.fromRGB(100.0, 149.0, 237.0);
    Color.Scarlet = Color.fromRGB(255.0, 36.0, 0.0);
    Color.Red = Color.fromRGB(255.0, 0.0, 0.0);
    Color.Green = Color.fromRGB(0.0, 255.0, 0.0);
    Color.Blue = Color.fromRGB(0.0, 0.0, 255.0);
    Color.White = Color.fromRGB(255.0, 255.0, 255.0);
    Color.Black = Color.fromRGB(0.0, 0.0, 0.0);

    return Color;

})();