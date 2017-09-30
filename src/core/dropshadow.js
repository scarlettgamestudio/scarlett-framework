import Color from "core/color";
import Stroke from "core/stroke";
import Vector2 from "math/vector2";

/**
 * DropShadow Class
 * DropShadow is a combination of a color and its size
 */
export default class DropShadow {
  //#region Constructors

  /**
     * DropShadow is a combination of a stroke (color + size) and vector (directions/size)
     * @param {Stroke=} stroke DropShadow desired strole (color + size)
     * @param {Vector2=} offset direction vector from -maxoffset to +maxoffset
     * @param {Vector2=} maxOffset max direction vector
     * @constructor
     */
  constructor(stroke, offset, maxOffset) {
    this.stroke = stroke instanceof Stroke ? stroke : new Stroke(Color.fromRGBA(0, 0, 0, 1.0), 5.0);
    // raw max offset
    this._rawMaxOffset = offset instanceof Vector2 ? offset : new Vector2(10, 10);
    // raw offset from -raw offset to +raw offset
    this._offset = maxOffset instanceof Vector2 ? maxOffset : new Vector2(7, 7);
  }

  //#endregion

  //#region Methods

  //#region Static Methods

  static restore(data) {
    let dropshadow = new DropShadow();
    dropshadow.setStroke(Stroke.restore(data.stroke));
    dropshadow.setRawMaxOffset(Vector2.restore(data.rawMaxOffset));
    dropshadow.setOffset(Vector2.restore(data.offset));
    return dropshadow;
  }

  //#endregion

  //#region Public Methods

  getStroke() {
    return this.stroke;
  }

  /**
     * Sets dropshadow's stroke
     * @param {Stroke} color
     */
  setStroke(stroke) {
    if (stroke instanceof Stroke) {
      this.stroke = stroke;
    }
  }

  getOffset() {
    return this._offset;
  }

  /**
     *
     * @param {Vector2} offset the shadow offset vector
     */
  setOffset(offset) {
    if (!(offset instanceof Vector2)) {
      throw new Error("The given raw max drop shadow offset is invalid");
    }
    this._offset = offset;
  }

  getRawMaxOffset() {
    return this._rawMaxOffset;
  }

  setRawMaxOffset(offset) {
    if (!(offset instanceof Vector2)) {
      throw new Error("The given raw max drop shadow offset is invalid");
    }
    this._rawMaxOffset = offset;
  }

  objectify() {
    return {
      stroke: this.getStroke().objectify(),
      rawMaxOffset: this.getRawMaxOffset().objectify(),
      offset: this.getOffset().objectify()
    };
  }

  //#endregion

  //#endregion
}
