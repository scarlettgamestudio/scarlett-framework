/**
 * Matrix4 class @ based on Tdl.Math
 * https://github.com/greggman/tdl/blob/master/tdl/math.js
 */
class Matrix4 {

    /**
     * Class constructor
     * @param {Array|Float32Array=} array
     */
    constructor(array) {
        if ((array instanceof Array || array instanceof Float32Array) && array.length === 16) {
            this._matrix = new Float32Array(array);

        } else {
            this._matrix = new Float32Array(16);
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
        if ((array instanceof Array || array instanceof Float32Array) && array.length === 16) {
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
        let tmp_0 = this._matrix[2 * 4 + 2] * this._matrix[3 * 4 + 3];
        let tmp_1 = this._matrix[3 * 4 + 2] * this._matrix[2 * 4 + 3];
        let tmp_2 = this._matrix[1 * 4 + 2] * this._matrix[3 * 4 + 3];
        let tmp_3 = this._matrix[3 * 4 + 2] * this._matrix[1 * 4 + 3];
        let tmp_4 = this._matrix[1 * 4 + 2] * this._matrix[2 * 4 + 3];
        let tmp_5 = this._matrix[2 * 4 + 2] * this._matrix[1 * 4 + 3];
        let tmp_6 = this._matrix[0 * 4 + 2] * this._matrix[3 * 4 + 3];
        let tmp_7 = this._matrix[3 * 4 + 2] * this._matrix[0 * 4 + 3];
        let tmp_8 = this._matrix[0 * 4 + 2] * this._matrix[2 * 4 + 3];
        let tmp_9 = this._matrix[2 * 4 + 2] * this._matrix[0 * 4 + 3];
        let tmp_10 = this._matrix[0 * 4 + 2] * this._matrix[1 * 4 + 3];
        let tmp_11 = this._matrix[1 * 4 + 2] * this._matrix[0 * 4 + 3];
        let tmp_12 = this._matrix[2 * 4 + 0] * this._matrix[3 * 4 + 1];
        let tmp_13 = this._matrix[3 * 4 + 0] * this._matrix[2 * 4 + 1];
        let tmp_14 = this._matrix[1 * 4 + 0] * this._matrix[3 * 4 + 1];
        let tmp_15 = this._matrix[3 * 4 + 0] * this._matrix[1 * 4 + 1];
        let tmp_16 = this._matrix[1 * 4 + 0] * this._matrix[2 * 4 + 1];
        let tmp_17 = this._matrix[2 * 4 + 0] * this._matrix[1 * 4 + 1];
        let tmp_18 = this._matrix[0 * 4 + 0] * this._matrix[3 * 4 + 1];
        let tmp_19 = this._matrix[3 * 4 + 0] * this._matrix[0 * 4 + 1];
        let tmp_20 = this._matrix[0 * 4 + 0] * this._matrix[2 * 4 + 1];
        let tmp_21 = this._matrix[2 * 4 + 0] * this._matrix[0 * 4 + 1];
        let tmp_22 = this._matrix[0 * 4 + 0] * this._matrix[1 * 4 + 1];
        let tmp_23 = this._matrix[1 * 4 + 0] * this._matrix[0 * 4 + 1];

        let t0 = (tmp_0 * this._matrix[1 * 4 + 1] + tmp_3 * this._matrix[2 * 4 + 1] + tmp_4 * this._matrix[3 * 4 + 1]) -
            (tmp_1 * this._matrix[1 * 4 + 1] + tmp_2 * this._matrix[2 * 4 + 1] + tmp_5 * this._matrix[3 * 4 + 1]);
        let t1 = (tmp_1 * this._matrix[0 * 4 + 1] + tmp_6 * this._matrix[2 * 4 + 1] + tmp_9 * this._matrix[3 * 4 + 1]) -
            (tmp_0 * this._matrix[0 * 4 + 1] + tmp_7 * this._matrix[2 * 4 + 1] + tmp_8 * this._matrix[3 * 4 + 1]);
        let t2 = (tmp_2 * this._matrix[0 * 4 + 1] + tmp_7 * this._matrix[1 * 4 + 1] + tmp_10 * this._matrix[3 * 4 + 1]) -
            (tmp_3 * this._matrix[0 * 4 + 1] + tmp_6 * this._matrix[1 * 4 + 1] + tmp_11 * this._matrix[3 * 4 + 1]);
        let t3 = (tmp_5 * this._matrix[0 * 4 + 1] + tmp_8 * this._matrix[1 * 4 + 1] + tmp_11 * this._matrix[2 * 4 + 1]) -
            (tmp_4 * this._matrix[0 * 4 + 1] + tmp_9 * this._matrix[1 * 4 + 1] + tmp_10 * this._matrix[2 * 4 + 1]);

        let d = 1.0 / (this._matrix[0 * 4 + 0] * t0 + this._matrix[1 * 4 + 0] * t1 + this._matrix[2 * 4 + 0] * t2 + this._matrix[3 * 4 + 0] * t3);

        this._matrix[0] = d * t0;
        this._matrix[1] = d * t1;
        this._matrix[2] = d * t2;
        this._matrix[3] = d * t3;
        this._matrix[4] = d * ((tmp_1 * this._matrix[1 * 4 + 0] + tmp_2 * this._matrix[2 * 4 + 0] + tmp_5 * this._matrix[3 * 4 + 0]) -
            (tmp_0 * this._matrix[1 * 4 + 0] + tmp_3 * this._matrix[2 * 4 + 0] + tmp_4 * this._matrix[3 * 4 + 0]));
        this._matrix[5] = d * ((tmp_0 * this._matrix[0 * 4 + 0] + tmp_7 * this._matrix[2 * 4 + 0] + tmp_8 * this._matrix[3 * 4 + 0]) -
            (tmp_1 * this._matrix[0 * 4 + 0] + tmp_6 * this._matrix[2 * 4 + 0] + tmp_9 * this._matrix[3 * 4 + 0]));
        this._matrix[6] = d * ((tmp_3 * this._matrix[0 * 4 + 0] + tmp_6 * this._matrix[1 * 4 + 0] + tmp_11 * this._matrix[3 * 4 + 0]) -
            (tmp_2 * this._matrix[0 * 4 + 0] + tmp_7 * this._matrix[1 * 4 + 0] + tmp_10 * this._matrix[3 * 4 + 0]));
        this._matrix[7] = d * ((tmp_4 * this._matrix[0 * 4 + 0] + tmp_9 * this._matrix[1 * 4 + 0] + tmp_10 * this._matrix[2 * 4 + 0]) -
            (tmp_5 * this._matrix[0 * 4 + 0] + tmp_8 * this._matrix[1 * 4 + 0] + tmp_11 * this._matrix[2 * 4 + 0]));
        this._matrix[8] = d * ((tmp_12 * this._matrix[1 * 4 + 3] + tmp_15 * this._matrix[2 * 4 + 3] + tmp_16 * this._matrix[3 * 4 + 3]) -
            (tmp_13 * this._matrix[1 * 4 + 3] + tmp_14 * this._matrix[2 * 4 + 3] + tmp_17 * this._matrix[3 * 4 + 3]));
        this._matrix[9] = d * ((tmp_13 * this._matrix[0 * 4 + 3] + tmp_18 * this._matrix[2 * 4 + 3] + tmp_21 * this._matrix[3 * 4 + 3]) -
            (tmp_12 * this._matrix[0 * 4 + 3] + tmp_19 * this._matrix[2 * 4 + 3] + tmp_20 * this._matrix[3 * 4 + 3]));
        this._matrix[10] = d * ((tmp_14 * this._matrix[0 * 4 + 3] + tmp_19 * this._matrix[1 * 4 + 3] + tmp_22 * this._matrix[3 * 4 + 3]) -
            (tmp_15 * this._matrix[0 * 4 + 3] + tmp_18 * this._matrix[1 * 4 + 3] + tmp_23 * this._matrix[3 * 4 + 3]));
        this._matrix[11] = d * ((tmp_17 * this._matrix[0 * 4 + 3] + tmp_20 * this._matrix[1 * 4 + 3] + tmp_23 * this._matrix[2 * 4 + 3]) -
            (tmp_16 * this._matrix[0 * 4 + 3] + tmp_21 * this._matrix[1 * 4 + 3] + tmp_22 * this._matrix[2 * 4 + 3]));
        this._matrix[12] = d * ((tmp_14 * this._matrix[2 * 4 + 2] + tmp_17 * this._matrix[3 * 4 + 2] + tmp_13 * this._matrix[1 * 4 + 2]) -
            (tmp_16 * this._matrix[3 * 4 + 2] + tmp_12 * this._matrix[1 * 4 + 2] + tmp_15 * this._matrix[2 * 4 + 2]));
        this._matrix[13] = d * ((tmp_20 * this._matrix[3 * 4 + 2] + tmp_12 * this._matrix[0 * 4 + 2] + tmp_19 * this._matrix[2 * 4 + 2]) -
            (tmp_18 * this._matrix[2 * 4 + 2] + tmp_21 * this._matrix[3 * 4 + 2] + tmp_13 * this._matrix[0 * 4 + 2]));
        this._matrix[14] = d * ((tmp_18 * this._matrix[1 * 4 + 2] + tmp_23 * this._matrix[3 * 4 + 2] + tmp_15 * this._matrix[0 * 4 + 2]) -
            (tmp_22 * this._matrix[3 * 4 + 2] + tmp_14 * this._matrix[0 * 4 + 2] + tmp_19 * this._matrix[1 * 4 + 2]));
        this._matrix[15] = d * ((tmp_22 * this._matrix[2 * 4 + 2] + tmp_16 * this._matrix[0 * 4 + 2] + tmp_21 * this._matrix[1 * 4 + 2]) -
            (tmp_20 * this._matrix[1 * 4 + 2] + tmp_23 * this._matrix[2 * 4 + 2] + tmp_17 * this._matrix[0 * 4 + 2]));

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
        this._matrix[4] = 0;
        this._matrix[5] = 1;
        this._matrix[6] = 0;
        this._matrix[7] = 0;
        this._matrix[8] = 0;
        this._matrix[9] = 0;
        this._matrix[10] = 1;
        this._matrix[11] = 0;
        this._matrix[12] = 0;
        this._matrix[13] = 0;
        this._matrix[14] = 0;
        this._matrix[15] = 1;

        return this._matrix;
    }

    /**
     *
     * @param left
     * @param right
     * @param bottom
     * @param top
     * @param near
     * @param far
     */
    orthographic(left, right, bottom, top, near, far) {
        this._matrix[0] = 2 / (right - left);
        this._matrix[1] = 0;
        this._matrix[2] = 0;
        this._matrix[3] = 0;
        this._matrix[4] = 0;
        this._matrix[5] = 2 / (top - bottom);
        this._matrix[6] = 0;
        this._matrix[7] = 0;
        this._matrix[8] = 0;
        this._matrix[9] = 0;
        this._matrix[10] = 1 / (near - far);
        this._matrix[11] = 0;
        this._matrix[12] = (left + right) / (left - right);
        this._matrix[13] = (bottom + top) / (bottom - top);
        this._matrix[14] = near / (near - far);
        this._matrix[15] = 1;

        return this._matrix;
    }

    /**
     * Rotates the matrix with the given array
     * @param axis
     * @param angle
     */
    rotate(axis, angle) {
        let x = axis[0];
        let y = axis[1];
        let z = axis[2];
        let n = Math.sqrt(x * x + y * y + z * z);
        x /= n;
        y /= n;
        z /= n;

        let xx = x * x;
        let yy = y * y;
        let zz = z * z;
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        let oneMinusCosine = 1 - c;

        let r00 = xx + (1 - xx) * c;
        let r01 = x * y * oneMinusCosine + z * s;
        let r02 = x * z * oneMinusCosine - y * s;
        let r10 = x * y * oneMinusCosine - z * s;
        let r11 = yy + (1 - yy) * c;
        let r12 = y * z * oneMinusCosine + x * s;
        let r20 = x * z * oneMinusCosine + y * s;
        let r21 = y * z * oneMinusCosine - x * s;
        let r22 = zz + (1 - zz) * c;

        let m00 = this._matrix[0 * 4 + 0];
        let m01 = this._matrix[0 * 4 + 1];
        let m02 = this._matrix[0 * 4 + 2];
        let m03 = this._matrix[0 * 4 + 3];
        let m10 = this._matrix[1 * 4 + 0];
        let m11 = this._matrix[1 * 4 + 1];
        let m12 = this._matrix[1 * 4 + 2];
        let m13 = this._matrix[1 * 4 + 3];
        let m20 = this._matrix[2 * 4 + 0];
        let m21 = this._matrix[2 * 4 + 1];
        let m22 = this._matrix[2 * 4 + 2];
        let m23 = this._matrix[2 * 4 + 3];

        this._matrix[0] = r00 * m00 + r01 * m10 + r02 * m20;
        this._matrix[1] = r00 * m01 + r01 * m11 + r02 * m21;
        this._matrix[2] = r00 * m02 + r01 * m12 + r02 * m22;
        this._matrix[3] = r00 * m03 + r01 * m13 + r02 * m23;
        this._matrix[4] = r10 * m00 + r11 * m10 + r12 * m20;
        this._matrix[5] = r10 * m01 + r11 * m11 + r12 * m21;
        this._matrix[6] = r10 * m02 + r11 * m12 + r12 * m22;
        this._matrix[7] = r10 * m03 + r11 * m13 + r12 * m23;
        this._matrix[8] = r20 * m00 + r21 * m10 + r22 * m20;
        this._matrix[9] = r20 * m01 + r21 * m11 + r22 * m21;
        this._matrix[10] = r20 * m02 + r21 * m12 + r22 * m22;
        this._matrix[11] = r20 * m03 + r21 * m13 + r22 * m23;

        return this._matrix;
    }

    /**
     * Scales the matrix with the given vector
     * @param {Array} vec [x, y, z]
     */
    scale(vec) {
        let v0 = vec[0];
        let v1 = vec[1];
        let v2 = vec[2];

        this._matrix[0] = v0 * this._matrix[0 * 4 + 0];
        this._matrix[1] = v0 * this._matrix[0 * 4 + 1];
        this._matrix[2] = v0 * this._matrix[0 * 4 + 2];
        this._matrix[3] = v0 * this._matrix[0 * 4 + 3];
        this._matrix[4] = v1 * this._matrix[1 * 4 + 0];
        this._matrix[5] = v1 * this._matrix[1 * 4 + 1];
        this._matrix[6] = v1 * this._matrix[1 * 4 + 2];
        this._matrix[7] = v1 * this._matrix[1 * 4 + 3];
        this._matrix[8] = v2 * this._matrix[2 * 4 + 0];
        this._matrix[9] = v2 * this._matrix[2 * 4 + 1];
        this._matrix[10] = v2 * this._matrix[2 * 4 + 2];
        this._matrix[11] = v2 * this._matrix[2 * 4 + 3];

        return this._matrix;
    }

    /**
     * Translates the matrix with the given vector
     * @param {Array} vec [x, y, z]
     */
    translate(vec) {
        let m00 = this._matrix[0 * 4 + 0];
        let m01 = this._matrix[0 * 4 + 1];
        let m02 = this._matrix[0 * 4 + 2];
        let m03 = this._matrix[0 * 4 + 3];
        let m10 = this._matrix[1 * 4 + 0];
        let m11 = this._matrix[1 * 4 + 1];
        let m12 = this._matrix[1 * 4 + 2];
        let m13 = this._matrix[1 * 4 + 3];
        let m20 = this._matrix[2 * 4 + 0];
        let m21 = this._matrix[2 * 4 + 1];
        let m22 = this._matrix[2 * 4 + 2];
        let m23 = this._matrix[2 * 4 + 3];
        let m30 = this._matrix[3 * 4 + 0];
        let m31 = this._matrix[3 * 4 + 1];
        let m32 = this._matrix[3 * 4 + 2];
        let m33 = this._matrix[3 * 4 + 3];
        let v0 = vec[0];
        let v1 = vec[1];
        let v2 = vec[2];

        this._matrix[12] = m00 * v0 + m10 * v1 + m20 * v2 + m30;
        this._matrix[13] = m01 * v0 + m11 * v1 + m21 * v2 + m31;
        this._matrix[14] = m02 * v0 + m12 * v1 + m22 * v2 + m32;
        this._matrix[15] = m03 * v0 + m13 * v1 + m23 * v2 + m33;

        return this._matrix;
    }
}
