/**
 * Vector4 class for tri dimensional point references
 */
SetterDictionary.addRule("vector4", ["x", "y", "z", "w"]);

function Vector4(x, y, z, w) {
	// public properties:
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = w || 0;

	// private properties:

}

Vector4.prototype.set = function(x, y, z, w) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.w = w;
};

Vector4.prototype.toJSON = function() {
	return {
		x: this.x,
		y: this.y,
		z: this.z,
		w: this.w
	};
};

Vector4.prototype.equals = function(obj) {
	return (obj.x === this.x && obj.y === this.y && obj.z === this.z && obj.w === this.w);
};

Vector4.prototype.unload = function () {
	
};