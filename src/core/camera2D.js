/**
 * Camera2D class
 */
function Camera2D(x, y, viewWidth, viewHeight) {
    // public properties:
    this.x = x || 0;
    this.y = y || 0;
    this.viewWidth = viewWidth || 0;
    this.viewHeight = viewHeight || 0;

    // private properties:
    this._lastX = null;
    this._lastY = null;
    this._matrix = mat4.create();
}

Camera2D.prototype.calculateMatrix = function() {
    // FIXME optimize this?
    var ortho = mat4.create();
    mat4.ortho(ortho, -this.viewWidth / 2.0, this.viewWidth / 2.0, this.viewHeight / 2.0, -this.viewHeight / 2.0, 0.0, 1.0);

    var translate = mat4.create();
    mat4.translate(translate, translate, [this.x, this.y, 0.0]);

    mat4.multiply(this._matrix, ortho, translate);

    this._lastX = this.x;
    this._lastY = this.y;

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
    if(this.x != this._lastX || this.y != this._lastY) {
        return this.calculateMatrix();
    }

    return this._matrix;
};

Camera2D.prototype.unload = function () {

};