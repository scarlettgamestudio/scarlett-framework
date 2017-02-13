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

    //#endregion

    //#endregion

}