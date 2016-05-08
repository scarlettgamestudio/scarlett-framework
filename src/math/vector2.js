/**
 * Vector2 class for bi dimensional point references
 */
/**
 * @constructor
 */
SetterDictionary.addRule("vector2", ["x", "y"]);

function Vector2(x, y) {
	// public properties:
	this.x = x || 0;
	this.y = y || 0;

	// private properties:

}

Vector2.prototype.set = function(x, y) {
	this.x = x;
	this.y = y;
};

Vector2.prototype.toJSON = function() {
	return {
		x: this.x,
		y: this.y
	};
};

Vector2.prototype.unload = function () {

};
