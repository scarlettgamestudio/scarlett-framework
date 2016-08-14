/**
 * Rectangle class
 */
/**
 * @constructor
 */
SetterDictionary.addRule("ray", ["origin", "direction"]);

function Ray(origin, direction) {
    // public properties:
    this.origin = origin || 0;
    this.direction = direction || 0;

    // private properties:

}

Ray.prototype.set = function(origin, direction) {
    this.origin = origin;
    this.direction = direction;
};

Ray.prototype.objectify = function() {
    return {
        origin: this.origin,
        direction: this.direction
    };
};

Ray.restore = function(data) {
    return new Ray(data.origin, data.direction);
};

Ray.prototype.equals = function(obj) {
    return (obj.origin === this.origin && obj.direction === this.direction);
};

Ray.prototype.unload = function () {

};