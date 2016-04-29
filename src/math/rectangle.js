/**
 * Rectangle class
 */
var Rectangle = (function () {

    // private properties
    var _this = {};

    /**
     * @constructor
     */
    function Rectangle(x, y, width, height) {
        // public properties:
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 10;
        this.height = height || 10;

        // private properties:

    }

    Rectangle.prototype.toJSON = function() {
        return JSON.stringify({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        });
    };

    Rectangle.prototype.unload = function () {
        _this = null;
    };

    return Rectangle;

})();