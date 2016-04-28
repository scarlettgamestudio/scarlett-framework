/**
 * Camera2D class
 */
var Camera2D = (function () {

    // private properties
    var _this = {};

    /**
     * @constructor
     */
    function Camera2D(x, y, viewWidth, viewHeight) {
        // public properties:
        this.x = x || 0;
        this.y = y || 0;
        this.viewWidth = viewWidth || 0;
        this.viewHeight = viewHeight || 0;

        // private properties:
        _this.lastX = null;
        _this.lastY = null;
        _this.matrix = mat4.create();
    }

    Camera2D.prototype.calculateMatrix = function() {
        // FIXME optimize this
        var ortho = mat4.create();
        mat4.ortho(ortho, -this.viewWidth / 2.0, this.viewWidth / 2.0, this.viewHeight / 2.0, -this.viewHeight / 2.0, 0.0, 1.0);

        var translate = mat4.create();
        mat4.translate(translate, translate, [this.x, this.y, 0.0]);

        mat4.multiply(_this.matrix, ortho, translate);

        _this.lastX = this.x;
        _this.lastY = this.y;

        return _this.matrix
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
        if(this.x != _this.lastX || this.y != _this.lastY) {
           return this.calculateMatrix();
        }

        return _this.matrix;
    };

    Camera2D.prototype.unload = function () {
        _this = null;
    };

    return Camera2D;

})();