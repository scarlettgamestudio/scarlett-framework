import { SetterDictionary } from "common/setterDictionary";

SetterDictionary.addRule("vector2", ["x", "y"]);

/**
 * Vector2 Class for bi dimensional point references
 */
export default class Vector2 {
  //#region Constructors

  constructor(x, y) {
    this.x = 0;
    this.y = 0;

    this.set(x, y);
  }

  //#endregion

  //#region Methods

  //#region Static Methods

  static restore(data) {
    return new Vector2(data.x, data.y);
  }

  static add(vectorA, vectorB) {
    return new Vector2(vectorA.x + vectorB.x, vectorA.y + vectorB.y);
  }

  static subtract(vectorA, vectorB) {
    return new Vector2(vectorA.x - vectorB.x, vectorA.y - vectorB.y);
  }

  static multiply(vectorA, vectorB) {
    return new Vector2(vectorA.x * vectorB.x, vectorA.y * vectorB.y);
  }

  /**
     * Normalizes the given vector, returning it
     * @param {Vector2} vector
     * @returns {Vector2} the same vector, normalized
     */
  static normalize(vector) {
    let val = 1.0 / vector.magnitude();
    vector.x *= val;
    vector.y *= val;

    return vector;
  }

  /**
     * The distance between the points represented by VectorA and VectorB
     * @param {Vector2} vectorA
     * @param {Vector2} vectorB
     * @returns {number} the distance
     */
  static distance(vectorA, vectorB) {
    return Math.sqrt(Vector2.sqrDistance(vectorA, vectorB));
  }

  /**
     * The squared distance between the points 
     * represented by VectorA and VectorB
     * @param {Vector2} vectorA
     * @param {Vector2} vectorB
     * @returns {number} the squared distance
     */
  static sqrDistance(vectorA, vectorB) {
    let v1 = vectorA.x - vectorB.x;
    let v2 = vectorA.y - vectorB.y;
    return v1 * v1 + v2 * v2;
  }

  static transformMat4(vec2, mat) {
    return new Vector2(mat[0] * vec2.x + mat[4] * vec2.y + mat[12], mat[1] * vec2.x + mat[5] * vec2.y + mat[13]);
  }

  static transformMat3(vec2, mat) {
    return new Vector2(mat[0] * vec2.x + mat[3] * vec2.y + mat[6], mat[1] * vec2.x + mat[4] * vec2.y + mat[7]);
  }

  //#endregion

  set(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  objectify() {
    return {
      x: this.x,
      y: this.y
    };
  }

  equals(obj) {
    return obj.x === this.x && obj.y === this.y;
  }

  unload() {}

  /**
     * The magnitude, or length, of this vector.
     * The magnitude is the L2 norm, or 
     * Euclidean distance between the origin and
     * the point represented by the (x, y) components of this Vector object.
     * @returns {number} the magnitude
     */
  magnitude() {
    return Math.sqrt(this.sqrMagnitude());
  }

  /**
     * The square of the magnitude, or length, of this vector.
     * See http://docs.unity3d.com/ScriptReference/Vector3-sqrMagnitude.html
     * @returns {number} the squared magnitude
     */
  sqrMagnitude() {
    return this.x * this.x + this.y * this.y;
  }

  normalLeft() {
    return new Vector2(this.y, -1 * this.x);
  }

  normalRight() {
    return new Vector2(-1 * this.y, this.x);
  }

  normalize() {
    return Vector2.normalize(this);
  }

  /**
     * The dot product of this vector with another vector.
     * @param vector
     * @returns {number}
     */
  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  /**
     * Calculates the magnitude of the vector 
     * that would result from a regular 3D cross product of the input vectors,
     * taking their Z values implicitly as 0 
     * (i.e., treating the 2D space as a plane in the 3D space).
     * The 3D cross product will be perpendicular to that plane, 
     * and thus have 0 X & Y components
     * (thus the scalar returned is the Z value of the 3D cross product vector).
     * @param vector
     */
  cross(vector) {
    return this.x * vector.y - this.y * vector.x;
  }

  /**
     * The distance between the point represented by this Vector
     * object and a point represented by the given Vector object.
     * @param {Vector2} vector
     * @returns {number}
     */
  distanceTo(vector) {
    return Vector2.distance(this, vector);
  }

  multiply(vector) {
    return Vector2.multiply(this, vector);
  }

  subtract(vector) {
    return Vector2.subtract(this, vector);
  }

  add(vector) {
    return Vector2.add(this, vector);
  }

  toString() {
    return "{x: " + this.x + "; y: " + this.y + "}";
  }

  //#endregion
}
