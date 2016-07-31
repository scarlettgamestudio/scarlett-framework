/**
 * Camera2D class
 */
function Camera2D(x, y, viewWidth, viewHeight) {
    // public properties:
    this.x = x || 0;
    this.y = y || 0;
    this.zoom = 1.0;
    this.viewWidth = viewWidth || 0;
    this.viewHeight = viewHeight || 0;

    // private properties:
    this._lastX = null;
    this._lastY = null;
    this._lastZoom = null;
    this._matrix = mat4.create();
}

Camera2D.prototype.calculateMatrix = function () {
    // generate orthographic perspective:
    mat4.ortho(
        this._matrix,
        this.x + -this.viewWidth * this.zoom / 2.0,
        this.x + this.viewWidth * this.zoom / 2.0,
        this.y + this.viewHeight * this.zoom / 2.0,
        this.y + -this.viewHeight * this.zoom / 2.0,
        0.0, 1.0);

    this._lastX = this.x;
    this._lastY = this.y;
    this._lastZoom = this.zoom;

    return this._matrix;
};

Camera2D.prototype.setViewSize = function (viewWidth, viewHeight) {
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;

    // force the camera calculations
    this.calculateMatrix();
};

/**
 * Calculates (if necessary) and returns the transformation matrix of the camera
 * @returns {mat4|*}
 */
Camera2D.prototype.getMatrix = function () {
    // needs to have a new calculation?
    if (this.x != this._lastX || this.y != this._lastY || this._lastZoom != this.zoom) {
        return this.calculateMatrix();
    }

    return this._matrix;
};

Camera2D.prototype.unload = function () {

};