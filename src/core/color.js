SetterDictionary.addRule("color", ["r", "g", "b", "a"]);

/**
 * Color Class
 * Sets Colors' values using either default ([0-1] or RGBA ([0-255] and alpha as [0-1]) format
 * @param {number} r red value ([0-1] vs [0-255])
 * @param {number} g green value ([0-1] vs [0-255])
 * @param {number} b blue value ([0-1] vs [0-255])
 * @param {number} a alpha value ([0-1])
 * @param {boolean} asRGBA whether it should consider the first 3 arguments to be in RGBA format
 * @constructor
 */
function Color(r, g, b, a, asRGBA) {

    // default values (public)
    this.r = 0.0;
    this.g = 0.0;
    this.b = 0.0;
    this.a = 1.0;

    // set the properties with the given values
    this.setSpecial(r, g, b, a, asRGBA);
}

/**
 * Clones the color object, returning a copy of it
 * @returns {Color} copy of the color
 */
Color.prototype.clone = function() {
   return new Color(this.r, this.g, this.b, this.a, false);
};

/**
 * Sets Colors' values using either default ([0-1] or RGBA ([0-255] and alpha as [0-1]) format
 * @param {number} r red value ([0-1] vs [0-255])
 * @param {number} g green value ([0-1] vs [0-255])
 * @param {number} b blue value ([0-1] vs [0-255])
 * @param {number} a alpha value ([0-1])
 * @param {boolean} asRGBA whether it should consider the first 3 arguments to be in RGBA format
 */
Color.prototype.setSpecial = function (r, g, b, a, asRGBA) {

    // default values
    var currentColor = this;
    var maxRange = 1.0;

    // change current color and max range if chosen format is set to RGBA
    if (asRGBA === true){
        currentColor = this.toRGBA();
        maxRange = 255.0;
    }

    // validate type and fall back to current color when needed
    r = isNumber(r) ? r : currentColor.r;
    g = isNumber(g) ? g : currentColor.g;
    b = isNumber(b) ? b : currentColor.b;
    a = isNumber(a) ? a : currentColor.a;

    // make sure the values are in the range
    this.r = MathHelper.clamp(r, 0.0, maxRange) / maxRange;
    this.g = MathHelper.clamp(g, 0.0, maxRange) / maxRange;
    this.b = MathHelper.clamp(b, 0.0, maxRange) / maxRange;
    this.a = MathHelper.clamp(a, 0.0, 1.0);
};

/**
 * Sets Colors' values using default format ([0-1], [0-1], [0-1], [0-1])
 * @param {number} r red value [0-1]
 * @param {number} g green value [0-1]
 * @param {number} b blue value [0-1]
 * @param {number} a alpha value [0-1]
 */
Color.prototype.set = function(r, g, b, a) {
    this.setSpecial(r, g, b, a, false);
};

/**
 * Sets Colors' values using a RGBA format ([0-255], [0-255], [0-255], [0-1] format)
 * @param {number} r red value [0-255]
 * @param {number} g green value [0-255]
 * @param {number} b blue value [0-255]
 * @param {number} a alpha value [0-1]
 */
Color.prototype.setAsRGBA = function(r, g, b, a) {
    this.setSpecial(r, g, b, a, true);
};

/**
 * Compares the color object ignoring the alpha color
 * @param {{r: number, g: number, b: number}} obj an object with red, green and blue values
 * @returns {boolean|null} whether the objects are equal or null if an invalid argument was provided
 */
Color.prototype.equalsIgnoreAlpha = function (obj) {

    // validate argument before testing
    if (!isNumber(obj.r) || !isNumber(obj.g) || !isNumber(obj.b)){
        return null;
    }

    return (obj.r === this.r && obj.g === this.g && obj.b === this.b);
};

/**
 * Compares the color object
 * @param {{r: number, g: number, b: number, a: number}} obj an object with red, green, blue and alpha values
 * @returns {boolean|null} whether the objects are equal or null if an invalid argument was provided
 */
Color.prototype.equals = function (obj) {

    // validate argument before testing
    if (!isNumber(obj.a)){
        return null;
    }

    return (this.equalsIgnoreAlpha(obj) && obj.a === this.a);
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
    return new Color(data.r, data.g, data.b, data.a, false);
};

/**
 * Converts Color format ([0-1], [0-1], [0-1], [0-1]) back to RGBA ([0-255], [0-255], [0-255], [0-1])
 * @returns {{r: number, g: number, b: number, a: number}} object with color in rgba format
 */
Color.prototype.toRGBA = function () {
    return {
        r: this.r * 255,
        g: this.g * 255,
        b: this.b * 255,
        a: this.a
    };
};

/**
 * Converts the color to hexadecimal format, returning it
 * @returns {string} hexadecimal string
 */
Color.prototype.toHex = function () {
    // convert back to RGBA format
    var rgba = this.toRGBA();
    // convert to Hex
    return Color.rgbToHex(rgba.r, rgba.g, rgba.b);
};

/**
 * Converts the color to an array, returning it
 * @returns {Array} array containing rgba values [r,g,b,a]
 */
Color.prototype.toArray = function () {
    return [this.r, this.g, this.b, this.a];
};

/**
 * Converts the color to a Float32Array, returning it
 * @returns {Float32Array} array containing rgba values [r,g,b,a]
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

/**
 * Attempts to create and retrieve a Color object given RGBA values
 * @param {number} red red value [0-255]
 * @param {number} green red value [0-255]
 * @param {number} blue red value [0-255]
 * @param {number} alpha red value [0-1]
 * @returns {Color|null} Color object if valid or null if invalid
 */
Color.fromRGBA = function (red, green, blue, alpha) {

    // no need to go further if arguments are invalid
    if (!isNumber(red) || !isNumber(green) || !isNumber(blue) || !isNumber(alpha)){
        return null;
    }

    return new Color(red, green, blue, alpha, true);
};

/**
 * Attempts to create and retrieve a Color object given a hexadecimal value
 * @param {string} hex hexadecimal color
 * @returns {Color|null} Color object if valid or null if invalid
 */
Color.fromHex = function (hex) {

    // no need to go further if argument is invalid
    if (!isString(hex)){
        return null;
    }

    // convert to RGBA
    var rgba = Color.hexToRGBA(hex);

    if (!rgba){
        return null;
    }

    return Color.fromRGBA(rgba.r, rgba.g, rgba.b, rgba.a);
};

Color.fromRGB = function (red, green, blue) {
    return Color.fromRGBA(red, green, blue, 1.0);
};

Color.random = function (alpha) {
    alpha = !isNumber(alpha) ? 1.0 : alpha;
    return Color.fromRGBA(Math.random() * 255, Math.random() * 255, Math.random() * 255, alpha);
};

/*
    Based on http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */

/**
 * Attempts to convert the given red, green and blue values to hexadecimal format
 * @param {number} r red value [0-255]
 * @param {number} g green value [0-255]
 * @param {number} b blue value [0-255]
 * @returns {string} hexadecimal string or an empty string if invalid arguments were provided
 */
Color.rgbToHex = function(r, g, b) {

    if (!isNumber(r) || !isNumber(g) || !isNumber(b)){
        return "";
    }

    r = MathHelper.clamp(r, 0, 255);
    g = MathHelper.clamp(g, 0, 255);
    b = MathHelper.clamp(b, 0, 255);

    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Converts the given hexadecimal string to RGBA format ([0-255], [0-255], [0-255], [0-1])
 * @param {string} hex hexadecimal string
 * @returns {{r: number, g: number, b: number, a: number}|null} an object with rgba values or null if invalid
 */
Color.hexToRGBA = function (hex) {
    // Expand shorthand form (e.g. "03F", "03F8" to full form (e.g. "0033FF", "0033FF88")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])([a-f\d]?)$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b, a) {
        return r + r + g + g + b + b + a + a;
    });

    // the last 2 digits (referent to alpha) are optional
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
    return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
            // convert value to 0-1
            a: result[4] != 'undefined' ? parseInt(result[4], 16) / 255 : 1
        } : null;
};

/*
    #####################
 */

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
