SetterDictionary.addRule("color", ["r", "g", "b", "a"]);

/**
 * Color Class
 * @param r
 * @param g
 * @param b
 * @param a
 * @constructor
 */
function Color(r, g, b, a) {
    // public properties:
    this.r = r || 0.0;
    this.g = g || 0.0;
    this.b = b || 0.0;
    this.a = a || 1.0;
}

/**
 *
 * @param r
 * @param g
 * @param b
 * @param a
 */
Color.prototype.set = function(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

/**
 * Compares the color object
 * @param obj
 * @returns {boolean}
 */
Color.prototype.equals = function (obj) {
    return (obj.r === this.r && obj.g === this.g && obj.b === this.b && obj.a === this.a);
};

/**
 * Compares the color object ignoring the alpha color
 * @param obj
 */
Color.prototype.equalsIgnoreAlpha = function (obj) {
    return (obj.r === this.r && obj.g === this.g && obj.b === this.b);
};

/**
 *
 */
Color.prototype.objectify = function () {
    return {
        r: this.r,
        g: this.g,
        b: this.b,
        a: this.a
    };
};

/**
 *
 * @param data
 */
Color.restore = function(data) {
    return new Color(data.r, data.g, data.b, data.a);
};

/**
 *
 * @returns {string}
 */
Color.prototype.toHex = function () {
    return Color.rgbToHex(this.r * 255, this.g * 255, this.b * 255);
};

/**
 *
 * @returns {*[]}
 */
Color.prototype.toArray = function () {
    return [this.r, this.g, this.b, this.a];
};

/**
 *
 * @returns {Float32Array}
 */
Color.prototype.toFloat32Array = function () {
    return new Float32Array([this.r, this.g, this.b, this.a]);
};

/**
 *
 */
Color.prototype.unload = function () {

};

// static functions

Color.rgbToHex = function(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

Color.fromRGBA = function (red, green, blue, alpha) {
    return new Color(red / 255.0, green / 255.0, blue / 255.0, alpha);
};

Color.fromRGB = function (red, green, blue) {
    return new Color(red / 255.0, green / 255.0, blue / 255.0, 1.0);
};

Color.random = function (alpha) {
    alpha = alpha || 1.0;
    return Color.fromRGBA(Math.random() * 255, Math.random() * 255, Math.random() * 255, alpha);
};

// static properties

Color.CornflowerBlue = Color.fromRGB(100.0, 149.0, 237.0);
Color.Scarlet = Color.fromRGB(255.0, 36.0, 0.0);
Color.Red = Color.fromRGB(255.0, 0.0, 0.0);
Color.Green = Color.fromRGB(0.0, 255.0, 0.0);
Color.Blue = Color.fromRGB(0.0, 0.0, 255.0);
Color.White = Color.fromRGB(255.0, 255.0, 255.0);
Color.Black = Color.fromRGB(0.0, 0.0, 0.0);
Color.Gray = Color.fromRGB(80.0, 80.0, 80.0);
Color.Nephritis = Color.fromRGB(39.0, 174.0, 96.0);
Color.Wisteria = Color.fromRGB(142.0, 68.0, 173.0);
Color.Amethyst = Color.fromRGB(155.0, 89.0, 182.0);
Color.Carrot = Color.fromRGB(230, 126, 34);
Color.Pumpkin = Color.fromRGB(211, 84, 0);
Color.Orange = Color.fromRGB(243, 156, 18);
Color.SunFlower = Color.fromRGB(241, 196, 15);
Color.Alizarin = Color.fromRGB(231, 76, 60);