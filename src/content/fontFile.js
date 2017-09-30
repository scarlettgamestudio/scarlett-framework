/**
 * Content Font File Class
 */
export default class FontFile {
  //#region Constructors

  /**
     * @param params
     * @constructor
     */
  constructor(params) {
    params = params || {};

    // public properties:
    this.sourcePath = params.sourcePath || ""; // should be a relative path
    this.mapping = [];
  }

  //#endregion

  //#region Methods

  //#region Static Methods

  static restore(data) {
    return new FontFile({
      sourcePath: data.sourcePath
    });
  }

  //#endregion

  objectify() {
    return {
      sourcePath: this.sourcePath
    };
  }

  getType() {
    return "FontFile";
  }

  //#endregion
}
