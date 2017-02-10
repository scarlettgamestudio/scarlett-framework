/**
 * Matrix3 class @ based on Tdl.Math
 * https://github.com/greggman/tdl/blob/master/tdl/math.js
 */
class Matrix3 {

    /**
     * Class constructor
     * @param {Array|Float32Array=} array
     */
    constructor(array) {
        if ((array instanceof Array || array instanceof Float32Array) && array.length === 9) {
            this._matrix = new Float32Array(array);

        } else {
            this._matrix = new Float32Array(9);
        }
    }

    /**
     * Copies the content of the current matrix to another
     * @param {Matrix4} outMatrix
     */
    copy(outMatrix) {
        if (outMatrix instanceof Matrix4) {
            outMatrix.setFromArray(this.asArray());
        }
    }

    /**
     *
     * @param {Array|Float32Array} array
     */
    setFromArray(array) {
        if ((array instanceof Array || array instanceof Float32Array) && array.length === 9) {
            this._matrix = new Float32Array(array);
        }
    }

    /**
     * Returns a cloned Matrix
     */
    clone() {
        return new Matrix4(this._matrix.asArray());
    }

    /**
     * Returns the matrix array value
     * @returns {Float32Array}
     */
    asArray() {
        return this._matrix;
    }

    /**
     * Calculates the matrix invert
     * @returns {Float32Array}
     */
    invert() {
        let t00 = this._matrix[1 * 3 + 1] * this._matrix[2 * 3 + 2] - this._matrix[1 * 3 + 2] * this._matrix[2 * 3 + 1];
        let t10 = this._matrix[0 * 3 + 1] * this._matrix[2 * 3 + 2] - this._matrix[0 * 3 + 2] * this._matrix[2 * 3 + 1];
        let t20 = this._matrix[0 * 3 + 1] * this._matrix[1 * 3 + 2] - this._matrix[0 * 3 + 2] * this._matrix[1 * 3 + 1];
        let d = 1.0 / (this._matrix[0 * 3 + 0] * t00 - this._matrix[1 * 3 + 0] * t10 + this._matrix[2 * 3 + 0] * t20);

        this._matrix[0] = d * t00;
        this._matrix[1] = -d * t10;
        this._matrix[2] = d * t20;
        this._matrix[3] = -d * (this._matrix[1 * 3 + 0] * this._matrix[2 * 3 + 2] - this._matrix[1 * 3 + 2] * this._matrix[2 * 3 + 0]);
        this._matrix[4] = d * (this._matrix[0 * 3 + 0] * this._matrix[2 * 3 + 2] - this._matrix[0 * 3 + 2] * this._matrix[2 * 3 + 0]);
        this._matrix[5] = -d * (this._matrix[0 * 3 + 0] * this._matrix[1 * 3 + 2] - this._matrix[0 * 3 + 2] * this._matrix[1 * 3 + 0]);
        this._matrix[6] = d * (this._matrix[1 * 3 + 0] * this._matrix[2 * 3 + 1] - this._matrix[1 * 3 + 1] * this._matrix[2 * 3 + 0]);
        this._matrix[7] = -d * (this._matrix[0 * 3 + 0] * this._matrix[2 * 3 + 1] - this._matrix[0 * 3 + 1] * this._matrix[2 * 3 + 0]);
        this._matrix[8] = d * (this._matrix[0 * 3 + 0] * this._matrix[1 * 3 + 1] - this._matrix[0 * 3 + 1] * this._matrix[1 * 3 + 0]);

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
