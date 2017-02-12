SetterDictionary.addRule("vector3", ["x", "y", "z"]);

/**
 * Vector3 Class for tri dimensional point references
 */
class Vector3 {

    //#region Constructors

    constructor(x, y, z) {
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.set(x, y, z);
    }

    //#endregion

    //#region Methods

    //#region Static Methods

    static restore(data) {
        return new Vector3(data.x, data.y, data.z);
    }

    //#endregion

    set(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    objectify() {
        return {
            x: this.x,
            y: this.y,
            z: this.z
        };
    }

    equals(obj) {
        return (obj.x === this.x && obj.y === this.y && obj.z === this.z);
    }

    unload() {

    }

    /**
     * The magnitude, or length, of this vector.
     * The magnitude is the L2 norm, or Euclidean distance between the origin and
     * the point represented by the (x, y, z) components of this Vector object.
     * @returns {number}
     */
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    /**
     * The square of the magnitude, or length, of this vector.
     * See http://docs.unity3d.com/ScriptReference/Vector3-sqrMagnitude.html
     * @returns {number}
     */
    sqrMagnitude() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /**
     * The distance between the point represented by this Vector
     * object and a point represented by the given Vector object.
     * @param {Vector3} vector
     * @returns {number}
     */
    distanceTo(vector) {
        return Math.sqrt(
            (this.x - vector.x) * (this.x - vector.x) +
            (this.y - vector.y) * (this.y - vector.y) +
            (this.z - vector.z) * (this.z - vector.z)
        );
    }

    /**
     * The dot product of this vector with another vector.
     * @param {Vector3} vector
     * @returns {number}
     */
    dot(vector) {
        return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z);
    }

    /**
     * The cross product of this vector and the given vector.
     *
     * The cross product is a vector orthogonal to both original vectors.
     * It has a magnitude equal to the area of a parallelogram having the
     * two vectors as sides. The direction of the returned vector is
     * determined by the right-hand rule.
     * @param {Vector3} vector
     */
    cross(vector) {
        return new Vector3(
            (this.y * vector.z) - (this.z * vector.y),
            (this.z * vector.x) - (this.x * vector.z),
            (this.x * vector.y) - (this.y * vector.x)
        );
    }

    //#endregion

}