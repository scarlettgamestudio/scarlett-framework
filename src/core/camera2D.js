import Matrix4 from "math/matrix4";
import Vector2 from "math/vector2";

/**
 * Camera2D class
 */

export default class Camera2D {
  //#region Constructors

  /**
     *
     * @param x
     * @param y
     * @param viewWidth
     * @param viewHeight
     * @param zoom
     */
  constructor(x, y, viewWidth, viewHeight, zoom) {
    // public properties:
    this.x = x || 0;
    this.y = y || 0;
    this.zoom = zoom || 1.0;
    this.viewWidth = viewWidth || 0;
    this.viewHeight = viewHeight || 0;

    // private properties:
    this._lastX = null;
    this._lastY = null;
    this._lastZoom = null;
    this._matrix = new Matrix4();
  }

  //#endregion

  //#region Methods

  //#region Static Methods

  /**
     *
     * @param data
     * @returns {Camera2D}
     */
  static restore(data) {
    return new Camera2D(data.x, data.y, data.viewWidth, data.viewHeight, data.zoom);
  }

  //#endregion

  /**
     *
     * @returns {Float32Array}
     */
  calculateMatrix() {
    // generate orthographic perspective:
    this._matrix.orthographic(
      this.x + -this.viewWidth * this.zoom / 2.0,
      this.x + this.viewWidth * this.zoom / 2.0,
      this.y + this.viewHeight * this.zoom / 2.0,
      this.y + -this.viewHeight * this.zoom / 2.0,
      0.0,
      1.0
    );

    this._lastX = this.x;
    this._lastY = this.y;
    this._lastZoom = this.zoom;

    return this._matrix.asArray();
  }

  /**
     *
     * @param viewWidth
     * @param viewHeight
     */
  setViewSize(viewWidth, viewHeight) {
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;

    // force the camera calculations
    this.calculateMatrix();
  }

  /**
     *
     * @returns {*|number}
     */
  getViewWidth() {
    return this.viewWidth;
  }

  /**
     *
     * @returns {*|number}
     */
  getViewHeight() {
    return this.viewHeight;
  }

  /**
     *
     * @returns {Float32Array}
     */
  getMatrix() {
    // needs to have a new calculation?
    if (this.x != this._lastX || this.y != this._lastY || this._lastZoom != this.zoom) {
      return this.calculateMatrix();
    }

    return this._matrix.asArray();
  }

  /**
     *
     * @param screenX
     * @param screenY
     */
  screenToWorldCoordinates(screenX, screenY) {
    // first we normalize the screen position:
    let x = 2.0 * screenX / this.viewWidth - 1.0;
    let y = 1.0 - 2.0 * screenY / this.viewHeight;

    // then we calculate and return the world coordinates:
    return Vector2.transformMat4(new Vector2(x, y), new Matrix4(this.getMatrix()).invert());
  }

  /**
     *
     */
  unload() {}

  /**
     *
     * @returns {{x: (*|number), y: (*|number), zoom: (*|number)}}
     */
  objectify() {
    return {
      x: this.x,
      y: this.y,
      zoom: this.zoom
    };
  }

  //#endregion
}
