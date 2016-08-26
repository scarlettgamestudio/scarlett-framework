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

Vector2.prototype.normalLeft = function () {
    return new Vector2(this.y, -1 * this.x);
};

Vector2.prototype.normalRight = function () {
    return new Vector2(-1 * this.y, this.x);
};

Vector2.prototype.dot = function (vector) {
    return this.x * vector.x + this.y * vector.y;
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

Vector2.multiply = function (vectorA, vectorB) {
    return new Vector2(vectorA.x * vectorB.x, vectorA.y * vectorB.y);
};

Vector2.restore = function (data) {
    return new Vector2(data.x, data.y);
};

Vector2.distance = function (vectorA, vectorB) {
    var v1 = vectorA.x - vectorB.x;
    var v2 = vectorA.y - vectorB.y;
    return Math.sqrt((v1 * v1) + (v2 * v2));
};

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
