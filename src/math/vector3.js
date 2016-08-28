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

/**
 * The magnitude, or length, of this vector.
 * The magnitude is the L2 norm, or Euclidean distance between the origin and
 * the point represented by the (x, y) components of this Vector object.
 * @returns {number}
 */
Vector3.prototype.magnitude = function() {
	return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};

/**
 * The square of the magnitude, or length, of this vector.
 * See http://docs.unity3d.com/ScriptReference/Vector3-sqrMagnitude.html
 * @returns {number}
 */
Vector3.prototype.sqrMagnitude = function () {
	return this.x * this.x + this.y * this.y + this.z * this.z;
};

/**
 * The distance between the point represented by this Vector
 * object and a point represented by the given Vector object.
 * @param vector
 * @returns {number}
 */
Vector3.prototype.distanceTo = function (vector) {
	return Math.sqrt((this.x - vector.x)*(this.x - vector.x) +
		(this.y - vector.y) * (this.y - vector.y) +
		(this.z - vector.z) * (this.z - vector.z));
};

/**
 * The dot product of this vector with another vector.
 * @param vector
 * @returns {number}
 */
Vector3.prototype.dot = function (vector) {
	return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z);
};

/**
 * The cross product of this vector and the given vector.
 *
 * The cross product is a vector orthogonal to both original vectors.
 * It has a magnitude equal to the area of a parallelogram having the
 * two vectors as sides. The direction of the returned vector is
 * determined by the right-hand rule.
 * @param vector
 */
Vector3.prototype.cross = function (vector) {
	return new Vector3((this.y * vector.z) - (this.z * vector.y),
		(this.z * vector.x) - (this.x * vector.z),
		(this.x * vector.y) - (this.y * vector.x));
};