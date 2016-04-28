/**
 * Camera2D class
 */
var Camera2D = (function () {

    // private properties
    var _this = {};

    /**
     * @constructor
     */
    function Camera2D() {
        // public properties:
        this.x = 0;
        this.y = 0;

        // private properties:
        _this.lastX = this.x;
        _this.lastY = this.y;
        _this.matrix = mat4.create();
    }

    /**
     * Calculates (if necessary) and returns the transformation matrix of the camera
     * @returns {mat4|*}
     */
    Camera2D.prototype.getMatrix = function () {
        // needs to have a new calculation?
        if(this.x != _this.lastX || this.y != _this.lastY) {
            _this.matrix = mat4.translate(this.x, this.y, 0.0);
            _this.lastX = this.x;
            _this.lastY = this.y;
        }

        return _this.matrix;
    };

    Camera2D.prototype.unload = function () {
        _this = null;
    };

    return Camera2D;

})();