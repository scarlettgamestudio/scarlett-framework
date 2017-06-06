/**
 * Matrix3 class @ based on Tdl.Math
 * https://github.com/greggman/tdl/blob/master/tdl/math.js
 */
export default class Matrix3 {
  /**
     * Class constructor
     * @param {Array|Float32Array=} array
     */
  constructor(array) {
    if (
      (array instanceof Array || array instanceof Float32Array) &&
      array.length === 9
    ) {
      this._matrix = new Float32Array(array);
    } else {
      this._matrix = new Float32Array(9);
    }
  }

  /**
     * Copies the content of the current matrix to another
     * @param {Matrix3} outMatrix
     */
  copy(outMatrix) {
    if (outMatrix instanceof Matrix3) {
      outMatrix.setFromArray(this.asArray());
    }
  }

  /**
     *
     * @param {Array|Float32Array} array
     */
  setFromArray(array) {
    if (
      (array instanceof Array || array instanceof Float32Array) &&
      array.length === 9
    ) {
      this._matrix = new Float32Array(array);
    }
  }

  /**
     * Returns a cloned Matrix
     */
  clone() {
    return new Matrix3(this._matrix.asArray());
  }

  /**
     * Returns the matrix array value
     * @returns {Float32Array}
     */
  asArray() {
    return this._matrix;
  }

  /**
     * Calculates the inverse matrix
     * @returns {Float32Array}
     */
  invert() {
    let t00 =
      this._matrix[1 * 3 + 1] * this._matrix[2 * 3 + 2] -
      this._matrix[1 * 3 + 2] * this._matrix[2 * 3 + 1];
    let t10 =
      this._matrix[0 * 3 + 1] * this._matrix[2 * 3 + 2] -
      this._matrix[0 * 3 + 2] * this._matrix[2 * 3 + 1];
    let t20 =
      this._matrix[0 * 3 + 1] * this._matrix[1 * 3 + 2] -
      this._matrix[0 * 3 + 2] * this._matrix[1 * 3 + 1];
    let d =
      1.0 /
      (this._matrix[0 * 3 + 0] * t00 -
        this._matrix[1 * 3 + 0] * t10 +
        this._matrix[2 * 3 + 0] * t20);

    this._matrix[0] = d * t00;
    this._matrix[1] = -d * t10;
    this._matrix[2] = d * t20;
    this._matrix[3] =
      -d *
      (this._matrix[1 * 3 + 0] * this._matrix[2 * 3 + 2] -
        this._matrix[1 * 3 + 2] * this._matrix[2 * 3 + 0]);
    this._matrix[4] =
      d *
      (this._matrix[0 * 3 + 0] * this._matrix[2 * 3 + 2] -
        this._matrix[0 * 3 + 2] * this._matrix[2 * 3 + 0]);
    this._matrix[5] =
      -d *
      (this._matrix[0 * 3 + 0] * this._matrix[1 * 3 + 2] -
        this._matrix[0 * 3 + 2] * this._matrix[1 * 3 + 0]);
    this._matrix[6] =
      d *
      (this._matrix[1 * 3 + 0] * this._matrix[2 * 3 + 1] -
        this._matrix[1 * 3 + 1] * this._matrix[2 * 3 + 0]);
    this._matrix[7] =
      -d *
      (this._matrix[0 * 3 + 0] * this._matrix[2 * 3 + 1] -
        this._matrix[0 * 3 + 1] * this._matrix[2 * 3 + 0]);
    this._matrix[8] =
      d *
      (this._matrix[0 * 3 + 0] * this._matrix[1 * 3 + 1] -
        this._matrix[0 * 3 + 1] * this._matrix[1 * 3 + 0]);

    return this._matrix;
  }

  /**
     * Multiples the current Matrix3 by another Matrix3
     * @param matrix3
     */
  multiply(matrix3) {
    let a00 = this._matrix[0 * 3 + 0];
    let a01 = this._matrix[0 * 3 + 1];
    let a02 = this._matrix[0 * 3 + 2];
    let a10 = this._matrix[1 * 3 + 0];
    let a11 = this._matrix[1 * 3 + 1];
    let a12 = this._matrix[1 * 3 + 2];
    let a20 = this._matrix[2 * 3 + 0];
    let a21 = this._matrix[2 * 3 + 1];
    let a22 = this._matrix[2 * 3 + 2];

    let b00 = matrix3[0 * 3 + 0];
    let b01 = matrix3[0 * 3 + 1];
    let b02 = matrix3[0 * 3 + 2];
    let b10 = matrix3[1 * 3 + 0];
    let b11 = matrix3[1 * 3 + 1];
    let b12 = matrix3[1 * 3 + 2];
    let b20 = matrix3[2 * 3 + 0];
    let b21 = matrix3[2 * 3 + 1];
    let b22 = matrix3[2 * 3 + 2];

    this._matrix[0] = a00 * b00 + a01 * b10 + a02 * b20;
    this._matrix[1] = a00 * b01 + a01 * b11 + a02 * b21;
    this._matrix[2] = a00 * b02 + a01 * b12 + a02 * b22;
    this._matrix[3] = a10 * b00 + a11 * b10 + a12 * b20;
    this._matrix[4] = a10 * b01 + a11 * b11 + a12 * b21;
    this._matrix[5] = a10 * b02 + a11 * b12 + a12 * b22;
    this._matrix[6] = a20 * b00 + a21 * b10 + a22 * b20;
    this._matrix[7] = a20 * b01 + a21 * b11 + a22 * b21;
    this._matrix[8] = a20 * b02 + a21 * b12 + a22 * b22;

    return this._matrix;
  }

  /**
     * Set Matrix identity
     * @returns {Float32Array}
     */
  identity() {
    this._matrix[0] = 1;
    this._matrix[1] = 0;
    this._matrix[2] = 0;
    this._matrix[3] = 0;
    this._matrix[4] = 1;
    this._matrix[5] = 0;
    this._matrix[6] = 0;
    this._matrix[7] = 0;
    this._matrix[8] = 1;

    return this._matrix;
  }
}
