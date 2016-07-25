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

Ray.prototype.toJSON = function() {
    return {
        origin: this.origin,
        direction: this.direction
    };
};

Ray.prototype.equals = function(obj) {
    return (obj.origin === this.origin && obj.direction === this.direction);
};

Ray.prototype.unload = function () {

};