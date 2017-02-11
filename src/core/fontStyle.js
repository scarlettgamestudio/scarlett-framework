/**
 * Created by Luis on 08/02/2017.
 */

/**
 * FontStyle Class
 */
class FontStyle {
    //#region Constructors

    /**
     * @param fontDescription
     * @constructor
     */
    constructor(fontDescription){
        this._fontDescription = fontDescription;
        this._fontSize = 70;
        this._letterSpacing = 0;
    }

    //#endregion

    //#region Methods

    getFontDescription(){
        return this._fontDescription;
    }

    setFontDescription(fontInfo){

        // don't go further if fontInfo is invalid
        if (!isObjectAssigned(fontInfo)) {
            throw new Error("fontInfo needs to be valid.");
        }

        // TODO: make sure fontInfo follows bmfont format!

        return this._fontDescription = fontInfo;
    }

    getFontSize(){
        return this._fontSize;
    }

    setFontSize(size){
        this._fontSize = size;
    }

    /**
     * Retrieves font style scale based on font size and font's description info size
     * @returns {number|null} font style scale or null if invalid
     */
    getScale(){

        let metricsSize = this.getFontDescription().info.size;

        // TODO: possibly validated in setFontInfo instead?
        if (!metricsSize){
            return null;
        }

        // calculate scale between generated font's size and the desired (font) size of the text
        let scale = this.getFontSize() / metricsSize;

        if (!scale || scale <= 0){
            return null;
        }

        return scale;
    }

    getLetterSpacing(){
        return this._letterSpacing;
    }

    setLetterSpacing(spacing){
        this._letterSpacing = spacing;
    }

    /**
     *
     * @param {string} char character whose correspondent (font) ID is to be found (different from ascii code!)
     * @returns {number|null} font's character's ID or null if invalid
     * @public
     */
    findCharID(char){

        let fontDescriptionChars = this.getFontDescription().chars;

        // make sure the parameter is valid
        if (!char || !fontDescriptionChars || fontDescriptionChars.length == 0){
            return null;
        }
        // retrieve character's ascii code
        let charCode = char.charCodeAt(0);

        // if code is invalid, no need to go further
        if (!charCode){
            return null;
        }

        // go through every character
        for (let i = 0; i < fontDescriptionChars.length; i++){
            // store glyphID (Ascii Code)
            let glyphID = fontDescriptionChars[i].id;

            // skip if invalid
            if (!glyphID){
                continue;
            }

            // if that's the code we are looking for
            if (glyphID === charCode){
                // return the iteration number (the position of that character inside the array of characters)
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

        if (!firstCharCode || !secondCharCode ||
            !fontDescriptionKernings|| !fontDescriptionKernings.length || fontDescriptionKernings.length === 0) {
            return 0;
        }

        // iterate through the kernings
        for (let i = 0; i < fontDescriptionKernings.length; i++) {
            let kern = fontDescriptionKernings[i];

            // skip if table is invalid
            if (!kern || !kern.first || !kern.second){
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

    //#endregion
}



