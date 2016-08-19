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

// static methods

Rectangle.fromVectors = function (va, vb) {
    var x, y, width, height;

    if (va.x > vb.x) {
        x = vb.x;
        width = Math.abs(va.x - vb.x);
    } else {
        x = va.x;
        width = Math.abs(vb.x - va.x);
    }

    if (va.y > vb.y) {
        y = vb.y;
        height = Math.abs(va.y - vb.y);
    } else {
        y = va.y;
        height = Math.abs(vb.y - va.y);
    }

    return new Rectangle(x, y, width, height);
};

// instance methods

/**
 * Get the rectangle vertices based on the position and width/height
 * @returns {{topLeft: Vector2, topRight: Vector2, bottomRight: Vector2, bottomLeft: Vector2}}
 */
Rectangle.prototype.getVertices = function () {
    return {
        topLeft: new Vector2(this.x, this.y),
        topRight: new Vector2(this.x + this.width, this.y),
        bottomRight: new Vector2(this.x + this.width, this.y + this.height),
        bottomLeft: new Vector2(this.x, this.y + this.height)
    }
};

/**
 * Checks if the rectangle is intersecting another given rectangle
 * @param rectangle
 * @returns {boolean}
 */
Rectangle.prototype.intersects = function (rectangle) {
    return (rectangle.x <= this.x + this.width && this.x <= rectangle.x + rectangle.width &&
    rectangle.y <= this.y + this.height && this.y <= rectangle.y + rectangle.height);
};

/**
 * Checks if the given rectangle is contained by the instance
 * @param rectangle
 */
Rectangle.prototype.contains = function (rectangle) {
    return (rectangle.x >= this.x && rectangle.x + rectangle.width <= this.x + this.width &&
    rectangle.y >= this.y && rectangle.y + rectangle.height <= this.y + this.height);
};

Rectangle.prototype.set = function (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
};

Rectangle.prototype.objectify = function () {
    return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
    };
};

Rectangle.restore = function (data) {
    return new Rectangle(data.x, data.y, data.width, data.height);
};

Rectangle.prototype.equals = function (obj) {
    return (obj.x === this.x && obj.y === this.y && obj.width === this.width && obj.height === this.height);
};

Rectangle.prototype.unload = function () {

};