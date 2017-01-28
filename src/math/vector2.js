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

// instance functions:

Vector2.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
};

Vector2.prototype.objectify = function () {
    return {
        x: this.x,
        y: this.y
    };
};

/**
 * The magnitude, or length, of this vector.
 * The magnitude is the L2 norm, or Euclidean distance between the origin and
 * the point represented by the (x, y) components of this Vector object.
 * @returns {number}
 */
Vector2.prototype.magnitude = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * The square of the magnitude, or length, of this vector.
 * See http://docs.unity3d.com/ScriptReference/Vector3-sqrMagnitude.html
 * @returns {number}
 */
Vector2.prototype.sqrMagnitude = function () {
  return this.x * this.x + this.y * this.y;
};

Vector2.prototype.normalLeft = function () {
    return new Vector2(this.y, -1 * this.x);
};

Vector2.prototype.normalRight = function () {
    return new Vector2(-1 * this.y, this.x);
};

Vector2.prototype.normalize = function() {
    return Vector2.normalize(this);
};

Vector2.normalize = function (vector) {
    var val = 1.0 / Math.sqrt((vector.x * vector.x) + (vector.y * vector.y));
    vector.x *= val;
    vector.y *= val;

    return vector;
};

/**
 * The dot product of this vector with another vector.
 * @param vector
 * @returns {number}
 */
Vector2.prototype.dot = function (vector) {
    return this.x * vector.x + this.y * vector.y;
};

/**
 * Calculates the magnitude of the vector that would result from a regular 3D cross product of the input vectors,
 * taking their Z values implicitly as 0 (i.e., treating the 2D space as a plane in the 3D space).
 * The 3D cross product will be perpendicular to that plane, and thus have 0 X & Y components
 * (thus the scalar returned is the Z value of the 3D cross product vector).
 * @param vector
 */
Vector2.prototype.cross = function (vector) {
    return this.x * vector.y - this.y * vector.x;
};

/**
 * The distance between the point represented by this Vector
 * object and a point represented by the given Vector object.
 * @param vector
 * @returns {number}
 */
Vector2.prototype.distanceTo = function (vector) {
    return Math.sqrt((this.x - vector.x)*(this.x - vector.x) +
                     (this.y - vector.y) * (this.y - vector.y));
};

Vector2.prototype.multiply = function (vector) {
    this.x *= vector.x;
    this.y *= vector.y;
};

Vector2.prototype.equals = function (obj) {
    return (obj.x === this.x && obj.y === this.y);
};

Vector2.prototype.unload = function () {

};

Vector2.prototype.subtract = function(vector) {
    return Vector2.subtract(this, vector);
};

Vector2.prototype.add = function(vector) {
    return Vector2.add(this, vector);
};

Vector2.subtract = function(vectorA, vectorB) {
    return new Vector2(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
};

Vector2.add = function(vectorA, vectorB) {
    return new Vector2(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
};

Vector2.multiply = function (vectorA, vectorB) {
    return new Vector2(vectorA.x * vectorB.x, vectorA.y * vectorB.y);
};

Vector2.restore = function (data) {
    return new Vector2(data.x, data.y);
};

/**
 * The distance between the points represented by VectorA and VectorB
 * @param vectorA
 * @param vectorB
 * @returns {number}
 */
Vector2.distance = function (vectorA, vectorB) {
    var v1 = vectorA.x - vectorB.x;
    var v2 = vectorA.y - vectorB.y;
    return Math.sqrt((v1 * v1) + (v2 * v2));
};

/**
 * The squared distance between the points represented by VectorA and VectorB
 * @param vectorA
 * @param vectorB
 * @returns {number}
 */
Vector2.sqrDistance = function (vectorA, vectorB) {
    var v1 = vectorA.x - vectorB.x;
    var v2 = vectorA.y - vectorB.y;
    return (v1 * v1) + (v2 * v2);
};

// static functions:

Vector2.transformMat4 = function (vec2, mat) {
    return new Vector2(
        (mat[0] * vec2.x) + (mat[4] * vec2.y) + mat[12],
        (mat[1] * vec2.x) + (mat[5] * vec2.y) + mat[13]);
};

Vector2.transformMat3 = function (vec2, mat) {
    return new Vector2(
        mat[0] * vec2.x + mat[3] * vec2.y + mat[6],
        mat[1] * vec2.x + mat[4] * vec2.y + mat[7]);
};
