/**
 * Vector3 class for tri dimensional point references
 */
SetterDictionary.addRule("vector3", ["x", "y", "z"]);

function Vector3(x, y, z) {
	// public properties:
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

	// private properties:

}

Vector3.prototype.set = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
};

Vector3.prototype.objectify = function() {
	return {
		x: this.x,
		y: this.y,
		z: this.z
	};
};

Vector3.restore = function(data) {
	return new Vector3(data.x, data.y, data.z);
};

Vector3.prototype.equals = function(obj) {
	return (obj.x === this.x && obj.y === this.y && obj.z === this.z);
};

Vector3.prototype.unload = function () {

};