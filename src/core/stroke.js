/**
 * Created by Luis on 23/12/2016.
 */

/**
 * Stroke Class
 * Stroke is a combination of a color and its size
 */
class Stroke {

    //#region Static Properties

    /**
     *
     * @returns {number}
     */
    getMaxSize() {
        return this._maxSize;
    }

    /**
     *
     * @param {number} size
     */
    setMaxSize(size) {
        if (!isNumber(size)) {
            throw new Error("The given raw size is invalid");
        }
        this._maxSize = size;
    }

    //#endregion

    //#region Constructors

    /**
     * Stroke is a combination of a color and its size
     * @param {Color=} color stroke color
     * @param {number=} size size of the stroke
     * @constructor
     */
    constructor(color, size) {
        // stroke color
        this._color = color || Color.fromRGBA(0.0, 0.0, 0.0, 1.0);
        // stroke size
        this._size = size || 0.0;
        this._maxSize = 10;
    }

    //#endregion

    //#region Methods

    //#region Static Methods

    static restore(data) {
        return {
            color: Color.restore(data),
            size: data.size
        };
    }

    //#endregion

    //#region Public Methods

    getColor() {
        return this._color;
    }

    /**
     * Sets stroke's color
     * @param {Color} color
     */
    setColor(color) {

        if (color instanceof Color) {
            this._color = color.clone();
            return;
        }

        if (!isNumber(color.r) || !isNumber(color.g) || !isNumber(color.b) || !isNumber(color.a)) {
            throw new Error("The given stroke color is invalid");
        }

        this._color.set(color.r, color.g, color.b, color.a);
    }

    setOpacity(alpha) {

        if (!isNumber(alpha)) {
            throw new Error("The given alpha is invalid");
        }

        let currentColor = this.getColor();

        this._color.set(currentColor.r, currentColor.g, currentColor.b, alpha);
    }

    getOpacity() {
        return this.getColor().a;
    }

    getSize() {
        return this._size;
    }

    setSize(size) {

        if (!isNumber(size)) {
            throw new Error("The given size is invalid");
        }

        size = MathHelper.clamp(size, 0, this.getMaxSize());

        this._size = size;
    }

    objectify() {
        return {
            color: this._color.objectify(),
            size: this.getSize()
        };
    }

    //#endregion

    //#endregion
}