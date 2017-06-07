import { SetterDictionary } from "common/setterDictionary";
import Vector2 from "./vector2";

SetterDictionary.addRule("rectangle", ["x", "y", "width", "height"]);

/**
 * Rectangle class
 */
export default class Rectangle {
  //#region Constructors

  constructor(x, y, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    this.set(x, y, width, height);
  }

  //#endregion

  //#region Methods

  //#region Static Methods

  static restore(data) {
    return new Rectangle(data.x, data.y, data.width, data.height);
  }

  static fromVectors(vectorA, vectorB) {
    let x, y, width, height;

    if (vectorA.x > vectorB.x) {
      x = vectorB.x;
      width = Math.abs(vectorA.x - vectorB.x);
    } else {
      x = vectorA.x;
      width = Math.abs(vectorB.x - vectorA.x);
    }

    if (vectorA.y > vectorB.y) {
      y = vectorB.y;
      height = Math.abs(vectorA.y - vectorB.y);
    } else {
      y = vectorA.y;
      height = Math.abs(vectorB.y - vectorA.y);
    }

    return new Rectangle(x, y, width, height);
  }

  //#endregion

  set(x, y, width, height) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 10;
    this.height = height || 10;
  }

  objectify() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  equals(obj) {
    return (
      obj.x === this.x &&
      obj.y === this.y &&
      obj.width === this.width &&
      obj.height === this.height
    );
  }

  unload() {}

  /**
  * Get the rectangle vertices based on the position and width/height
  * @returns {{topLeft: Vector2, topRight: 
          Vector2, bottomRight: Vector2, bottomLeft: Vector2}}
  */
  getVertices() {
    return {
      topLeft: new Vector2(this.x, this.y),
      topRight: new Vector2(this.x + this.width, this.y),
      bottomRight: new Vector2(this.x + this.width, this.y + this.height),
      bottomLeft: new Vector2(this.x, this.y + this.height)
    };
  }

  /**
     * Checks if the rectangle is intersecting the given rectangle
     * @param {Rectangle} rectangle
     * @returns {boolean}
     */
  intersects(rectangle) {
    return (
      rectangle.x <= this.x + this.width &&
      this.x <= rectangle.x + rectangle.width &&
      rectangle.y <= this.y + this.height &&
      this.y <= rectangle.y + rectangle.height
    );
  }

  /**
     * Checks if the given rectangle is contained by the instance
     * @param {Rectangle} rectangle
     */
  contains(rectangle) {
    return (
      rectangle.x >= this.x &&
      rectangle.x + rectangle.width <= this.x + this.width &&
      rectangle.y >= this.y &&
      rectangle.y + rectangle.height <= this.y + this.height
    );
  }

  //#endregion
}
