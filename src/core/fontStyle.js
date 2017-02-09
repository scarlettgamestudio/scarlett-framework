/**
 * Created by Luis on 08/02/2017.
 */

/**
 * FontStyle Class
 * @param fontDescription
 * @constructor
 */
function FontStyle(fontDescription) {

    this._fontDescription = fontDescription;
    this._fontSize = 70;
    this._letterSpacing = 0;
}

FontStyle.prototype.getFontDescription = function(){
    return this._fontDescription;
};

FontStyle.prototype.setFontDescription = function(fontInfo){

    // don't go further if fontInfo is invalid
    if (!isObjectAssigned(fontInfo)) {
        throw new Error("fontInfo needs to be valid.");
    }

    // TODO: make sure fontInfo follows bmfont format!

    return this._fontDescription = fontInfo;
};

FontStyle.prototype.getFontSize = function (){
    return this._fontSize;
};

FontStyle.prototype.setFontSize = function (size){
    this._fontSize = size;
};

/**
 * Retrieves font style scale based on font size and font's description info size
 * @returns {number|null} font style scale or null if invalid
 */
FontStyle.prototype.getScale = function(){

    var metricsSize = this.getFontDescription().info.size;

    // TODO: possibly validated in setFontInfo instead?
    if (!metricsSize){
        return null;
    }

    // calculate scale between generated font's size and the desired (font) size of the text
    var scale = this.getFontSize() / metricsSize;

    if (!scale || scale <= 0){
        return null;
    }

    return scale;
};

FontStyle.prototype.getLetterSpacing = function (){
    return this._letterSpacing;
};

FontStyle.prototype.setLetterSpacing = function (spacing){
    this._letterSpacing = spacing;
};

/**
 *
 * @param {string} char character whose correspondent (font) ID is to be found (different from ascii code!)
 * @returns {number|null} font's character's ID or null if invalid
 * @public
 */
FontStyle.prototype.findCharID = function(char){

    var fontDescriptionChars = this.getFontDescription().chars;

    // make sure the parameter is valid
    if (!char || !fontDescriptionChars || fontDescriptionChars.length == 0){
        return null;
    }
    // retrieve character's ascii code
    var charCode = char.charCodeAt(0);

    // if code is invalid, no need to go further
    if (!charCode){
        return null;
    }

    // go through every character
    for (var i = 0; i < fontDescriptionChars.length; i++){
        // store glyphID (Ascii Code)
        var glyphID = fontDescriptionChars[i].id;

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
};

/**
 * Retrieves Kerning value between the given characters
 * @param {number} firstCharCode first character ascii code
 * @param {number} secondCharCode second character ascii code
 * @returns {number} kerning value or 0 if not found
 * @public
 */
FontStyle.prototype.getKerning = function (firstCharCode, secondCharCode) {

    var fontDescriptionKernings = this.getFontDescription().kernings;

    if (!firstCharCode || !secondCharCode ||
                !fontDescriptionKernings|| !fontDescriptionKernings.length || fontDescriptionKernings.length === 0) {
        return 0;
    }

    // iterate through the kernings
    for (var i = 0; i < fontDescriptionKernings.length; i++) {
        var kern = fontDescriptionKernings[i];

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
};


