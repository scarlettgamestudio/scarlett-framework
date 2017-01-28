/**
 * Math helper utility class
 * @constructor
 */
var MathHelper = function () {};

/**
 * PI value
 * @type {number}
 */
MathHelper.PI = Math.PI;

/**
 * PI multiplied by two
 * @type {number}
 */
MathHelper.PI2 = MathHelper.PI * 2.0;

/**
 * PI multiplied by four
 * @type {number}
 */
MathHelper.PI4 = MathHelper.PI * 4.0;

/**
 * PI divided by two
 * @type {number}
 */
MathHelper.PIo2 = MathHelper.PI / 2.0;

/**
 * PI divided by four
 * @type {number}
 */
MathHelper.PIo4 = MathHelper.PI / 4.0;

/**
 * Clamp a value between a min and max value
 * @param value
 * @param min
 * @param max
 */
MathHelper.clamp = function (value, min, max) {
    return (value < min ? min : value > max ? max : value);
};

/**
 * Converts degree to radians
 * @param degrees
 */
MathHelper.degToRad = function (degrees) {
    return degrees * 0.0174532925;
};

/**
 * Converts radians to degrees
 * @param radians
 */
MathHelper.radToDeg = function(radians) {
    return radians * 57.295779513;
};