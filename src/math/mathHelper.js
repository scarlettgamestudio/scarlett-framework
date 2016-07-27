/**
 * Math helper utility class
 * @constructor
 */
var MathHelper = function () {};

/**
 * Clamp a value between a min and max value
 * @param value
 * @param min
 * @param max
 */
MathHelper.clamp = function (value, min, max) {
    return (value < min ? min : value > max ? max : value);
};