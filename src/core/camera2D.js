/**
 * Camera2D class
 */
function Camera2D(x, y, viewWidth, viewHeight, zoom) {
    // public properties:
    this.x = x || 0;
    this.y = y || 0;
    this.zoom = zoom || 1.0;
    this.viewWidth = viewWidth || 0;
    this.viewHeight = viewHeight || 0;

    // private properties:
    this._lastX = null;
    this._lastY = null;
    this._lastZoom = null;
    this._matrix = mat4.create();
    this._omatrix = mat4.create(); // used for temporary calculations
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

Camera2D.prototype.getViewWidth = function() {
    return this.viewWidth;
};

Camera2D.prototype.getViewHeight = function() {
    return this.viewHeight;
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

/**
 * Gets the world coordinates based on the screen X and Y
 * @param screenX
 * @param screenY
 */
Camera2D.prototype.screenToWorldCoordinates = function(screenX, screenY) {
    // first we normalize the screen position:
    var x = (2.0 * screenX) / this.viewWidth - 1.0;
    var y = 1.0 - (2.0 * screenY) / this.viewHeight;

    // then we calculate and return the world coordinates:
    mat4.invert(this._omatrix, this.getMatrix());

    return Vector2.transformMat4(new Vector2(x, y), this._omatrix);
};


Camera2D.prototype.unload = function () {

};

Camera2D.prototype.objectify = function() {
    return {
        x: this.x,
        y: this.y,
        zoom: this.zoom
    }
};

Camera2D.restore = function(data) {
    return new Camera2D(data.x, data.y, data.viewWidth, data.viewHeight, data.zoom);
};