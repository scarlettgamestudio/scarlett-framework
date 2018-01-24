import { AttributeDictionary } from "common/attributeDictionary";
import { ContentLoader } from "common/contentLoader";
import { isObjectAssigned } from "common/utils";
import BMFontParser from "utility/bmFontParser";

AttributeDictionary.addRule("fontStyle", "_fontDescriptionFilePath", {
  displayName: "Font Description Source",
  editor: "filepath"
});
AttributeDictionary.addRule("fontStyle", "_fontDescription", {
  visible: false
});

/**
 * FontStyle Class
 */
export default class FontStyle {
  //#region Constructors

  /**
     * @param fontDescription
     * @constructor
     */
  constructor(fontDescription, fontDescriptionFilePath, fontImage) {
    this._fontDescriptionFilePath = fontDescriptionFilePath;
    this._fontDescription = fontDescription;
    this._fontImage = fontImage;
    this._fontSize = 70;
    this._letterSpacing = 0;
    this._spread = 4;
  }

  //#endregion

  //#region Methods

  //#region Static Methods

  static restore(data) {
    let fontStyle = new FontStyle(data.fontDescription, data.fontDescriptionFilePath);

    fontStyle.setSpread(data.spread);
    fontStyle.setFontSize(data.fontSize);
    fontStyle.setLetterSpacing(data.letterSpacing);

    return fontStyle;
  }

  //#endregion

  //#region Public Methods

  getFontImage() {
    return this._fontImage;
  }

  getFontDescription() {
    return this._fontDescription;
  }

  setFontImage(image) {
    this._fontImage = image;
  }

  setFontDescription(fontInfo) {
    // don't go further if fontInfo is invalid
    if (!isObjectAssigned(fontInfo)) {
      console.error("font description (fontInfo) argument needs to be valid");
      return;
    }

    this._fontDescription = fontInfo;
  }

  getFontDescriptionFilePath() {
    return this._fontDescriptionFilePath;
  }

  async setFontDescriptionFilePath(filepath) {
    const fileContext = await ContentLoader.loadFile(filepath);

    if (fileContext === false) {
      console.error("Unable to load the desired font file");
      return;
    }

    let parsedBMFont = BMFontParser.parse(fileContext);

    // make sure parsing was successful
    if (parsedBMFont == null) {
      return;
    }

    // it should now be safe to set both description and filepath
    this.setFontDescription(parsedBMFont);
    this._fontDescriptionFilePath = filepath;
  }

  getFontSize() {
    return this._fontSize;
  }

  setFontSize(size) {
    this._fontSize = size;
  }

  /**
     * Retrieves font style scale based on 
     * font size and font's description info size
     * @returns {number|null} font style scale or null if invalid
     */
  getScale() {
    let metricsSize = this.getFontDescription().info.size;

    // TODO: possibly validated in setFontInfo instead?
    if (!metricsSize) {
      return null;
    }

    // calculate scale between generated
    // font's size and the desired (font) size of the text
    let scale = this.getFontSize() / metricsSize;

    if (!scale || scale <= 0) {
      return null;
    }

    return scale;
  }

  getLetterSpacing() {
    return this._letterSpacing;
  }

  setLetterSpacing(spacing) {
    this._letterSpacing = spacing;
  }

  getSpread() {
    return this._spread;
  }

  setSpread(spread) {
    this._spread = spread;
  }

  /**
     *
     * @param {string} char character whose correspondent (font) 
     * ID is to be found (different from ascii code!)
     * @returns {number|null} font's character's ID or null if invalid
     * @public
     */
  findCharID(char) {
    let fontDescriptionChars = this.getFontDescription().chars;

    // make sure the parameter is valid
    if (!char || !fontDescriptionChars || fontDescriptionChars.length == 0) {
      return null;
    }
    // retrieve character's ascii code
    let charCode = char.charCodeAt(0);

    // if code is invalid, no need to go further
    if (!charCode) {
      return null;
    }

    // go through every character
    for (let i = 0; i < fontDescriptionChars.length; i++) {
      // store glyphID (Ascii Code)
      let glyphID = fontDescriptionChars[i].id;

      // skip if invalid
      if (!glyphID) {
        continue;
      }

      // if that's the code we are looking for
      if (glyphID === charCode) {
        // return the iteration number
        // (the position of that character inside the array of characters)
        return i;
      }
    }
    return null;
  }

  /**
     * Retrieves Kerning value between the given characters
     * @param {number} firstCharCode first character ascii code
     * @param {number} secondCharCode second character ascii code
     * @returns {number} kerning value or 0 if not found
     * @public
     */
  getKerning(firstCharCode, secondCharCode) {
    let fontDescriptionKernings = this.getFontDescription().kernings;

    if (
      !firstCharCode ||
      !secondCharCode ||
      !fontDescriptionKernings ||
      !fontDescriptionKernings.length ||
      fontDescriptionKernings.length === 0
    ) {
      return 0;
    }

    // iterate through the kernings
    for (let i = 0; i < fontDescriptionKernings.length; i++) {
      let kern = fontDescriptionKernings[i];

      // skip if table is invalid
      if (!kern || !kern.first || !kern.second) {
        continue;
      }

      // if there is a match
      if (kern.first === firstCharCode && kern.second === secondCharCode)
        // return kerning
        return kern.amount;
    }

    // return 0 if there is no match
    return 0;
  }

  objectify() {
    return {
      fontDescriptionFilePath: this.getFontDescriptionFilePath(),
      fontDescription: this.getFontDescription(),
      fontSize: this.getFontSize(),
      letterSpacing: this.getLetterSpacing(),
      spread: this.getSpread()
    };
  }

  //#endregion

  //#endregion
}
