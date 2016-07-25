/**
 * Rectangle class
 */
/**
 * @constructor
 */
SetterDictionary.addRule("rectangle", ["x", "y", "width", "height"]);

function Rectangle(x, y, width, height) {
    // public properties:
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 10;
    this.height = height || 10;

    // private properties:

}

Rectangle.prototype.set = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

Rectangle.prototype.toJSON = function() {
    return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
    };
};

Rectangle.prototype.equals = function(obj) {
    return (obj.x === this.x && obj.y === this.y && obj.width === this.width && obj.height === this.height);
};

Rectangle.prototype.unload = function () {

};