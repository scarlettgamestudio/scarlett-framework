import { SetterDictionary } from "common/setterDictionary";

SetterDictionary.addRule("ray", ["origin", "direction"]);

/**
 * Ray Class (TODO: this class is not yet working!)
 */
export default class Ray {
  //#region Constructors

  constructor(origin, direction) {
    this.origin = 0;
    this.direction = 0;

    this.set(origin, direction);
  }

  //#endregion

  //#region Methods

  //#region Static Methods

  static restore(data) {
    return new Ray(data.origin, data.direction);
  }

  //#endregion

  set(origin, direction) {
    this.origin = origin || 0;
    this.direction = direction || 0;
  }

  objectify() {
    return {
      origin: this.origin,
      direction: this.direction
    };
  }

  equals(obj) {
    return obj.origin === this.origin && obj.direction === this.direction;
  }

  unload() {}

  //#endregion
}
