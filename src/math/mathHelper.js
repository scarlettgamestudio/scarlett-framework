/**
 * Math Helper utility Class
 */
class MathHelper {

    //#region Static Properties

    /**
     * PI value
     * @type {number}
     */
    static get PI() {
        return Math.PI;
    }

    /**
     * PI multiplied by two
     * @type {number}
     */
    static get PI2() {
        return MathHelper.PI * 2.0;
    }

    /**
     * PI multiplied by four
     * @type {number}
     */
    static get PI4() {
        return MathHelper.PI * 4.0;
    }

    /**
     * PI divided by two
     * @type {number}
     */
    static get PIo2() {
        return MathHelper.PI / 2.0;
    }

    /**
     * PI divided by four
     * @type {number}
     */
    static get PIo4() {
        return MathHelper.PI / 4.0;
    }

    //#endregion

    //#region Constructors

    /**
     * @constructor
     */
    constructor() {

    }

    //#endregion

    //#region Methods

    //#region Static Methods

    /**
     * Clamp a value between a min and max value
     * @param value
     * @param min
     * @param max
     */
    static clamp(value, min, max) {
        return (value < min ? min : value > max ? max : value);
    }

    /**
     * Converts degree to radians
     * @param degrees
     */
    static degToRad(degrees) {
        return degrees * 0.0174532925;
    }

    /**
     * Converts radians to degrees
     * @param radians
     */
    static radToDeg(radians) {
        return radians * 57.295779513;
    }

    /**
     * Normalize a given raw value between the internal [minNormalized, maxNormalized]
     * @param {number} rawValue the value to normalize
     * @param {number} minRaw the minimum raw value
     * @param {number} maxRaw the maximum raw value
     * @param {number} minNormalized the minimum normalized value
     * @param {number} maxNormalized the maximum normalized value
     */
    static normalize(rawValue, minRaw, maxRaw, minNormalized, maxNormalized){
        let x = rawValue;
        let minX = minRaw;
        let maxX = maxRaw;
        let a = minNormalized;
        let b = maxNormalized;
        let denominator = maxX - minX;

        if (denominator === 0){
            throw new Error("Division by 0 not allowed");
        }

        let numerator = x - minX;
        let normalizedValue = (b - a) * (numerator / denominator) + a;

        return normalizedValue;
    }

    //#endregion

    //#endregion

}