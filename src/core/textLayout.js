/**
 * Created by Luis on 08/02/2017.
 */

function TextLayout(font) {

    // don't go further if font is invalid
    if (!isObjectAssigned(font)) {
        throw new Error("Cannot create TextLayout without a valid font parameter.");
    }

    this._font = font;

    this._wordWrap = true;
    this._characterWrap = true;
    this._alignType = TextLayout.AlignType.LEFT;
    this._fontSize = 70;
    this._letterSpacing = 0;
}

TextLayout.AlignType = {
    LEFT: 1,
    CENTER: 2,
    RIGHT: 3
};

// TODO: replace for extensions.js array insert? supports multiple arguments...
Array.prototype.insert = function (index) {
    this.splice.apply(this, [index, 0].concat(this.slice.call(arguments, 1)));
};

// TODO: place in another file?
String.prototype.insert = function (index, string) {
    if (index > 0)
        return this.substring(0, index) + string + this.substring(index, this.length);
    else
        return string + this;
};


TextLayout.prototype.getWordWrap = function () {
    return this._wordWrap;
};

TextLayout.prototype.setWordWrap = function (value) {
    return this._wordWrap = value;
};

TextLayout.prototype.getCharacterWrap = function () {
    return this._characterWrap;
};

TextLayout.prototype.setCharacterWrap = function (value) {
    return this._characterWrap = value;
};

TextLayout.prototype.getAlignType = function (){
    return this._alignType;
};

TextLayout.prototype.setAlignType = function (alignType){
    this._alignType = alignType;
};

TextLayout.prototype.getFontSize = function (){
    return this._fontSize;
};

TextLayout.prototype.setFontSize = function (size){
    this._fontSize = size;
};

TextLayout.prototype.getLetterSpacing = function (){
    return this._letterSpacing;
};

TextLayout.prototype.setLetterSpacing = function (spacing){
    this._letterSpacing = spacing;
};

/**
 *
 * @param {string} char character whose correspondent (font) ID is to be found (different from ascii code!)
 * @returns {number|null} font's character's ID or null if invalid
 * @private
 */
TextLayout.prototype.findCharID = function(char){
    // make sure the parameter is valid
    if (!char || !this._font || !this._font.chars || this._font.chars.length == 0){
        return null;
    }
    // retrieve character's ascii code
    var charCode = char.charCodeAt(0);

    // if code is invalid, no need to go further
    if (!charCode){
        return null;
    }

    // go through every character
    for (var i = 0; i < this._font.chars.length; i++){
        // store glyphID (Ascii Code)
        var glyphID = this._font.chars[i].id;
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
 * @private
 */
TextLayout.prototype.getKerning = function (firstCharCode, secondCharCode) {
    if (!firstCharCode || !secondCharCode || !this._font || !this._font.kernings
        || !this._font.kernings.length || this._font.kernings.length === 0) {
        return 0;
    }

    // retrieve kernings' table
    var table = this._font.kernings;

    // iterate through the kernings
    for (var i = 0; i < table.length; i++) {
        var kern = table[i];
        // if there is a match
        if (kern.first === firstCharCode && kern.second === secondCharCode)
        // return kerning
            return kern.amount;
    }

    // return 0 if there is no match
    return 0;
};

/**
 * Measures a given character's width based on the provided scale
 * @param {string} char character to measure
 * @param {number} scale scale of the given character
 * @returns {number} the character width if valid and 0 if invalid
 * @private
 */
TextLayout.prototype.measureCharacterWidth = function(char, scale){

    // if parameters are missing
    if (!char || !scale || scale <= 0){
        return 0;
    }

    // retrieve character ID
    var charID = this.findCharID(char);

    // don't go further if char id is invalid
    if (charID === null){
        return 0;
    }

    // calculate character 'width'
    // xadvance is based not only on the width but also on the padding, thus being used instead of width (?)
    var charWidth = this._font.chars[charID].xadvance * scale;

    return charWidth;
};

/**
 * Measures the given text's width based on the provided scale
 * @param {string} text text to measure
 * @param {number} scale scale of the given text
 * @returns {number} the text width if valid and 0 if invalid
 * @private
 */
TextLayout.prototype.measureTextWidth = function(text, scale){
    // don't go further if text or scale do not exist
    if (!text || !scale || scale <= 0){
        return 0;
    }

    // set initial width
    var width = 0;
    // set initial letter spacing (for the first character, basically)
    var currentLetterSpacing = 0;
    // just to keep track of reverting to the original letter spacing value, so we only do it once
    var revertedToOriginalValue = false;

    // iterate through every character
    for (var c = 0; c < text.length; c++){
        // retrieve character at position c
        var char = text[c];

        // if there is already one or more valid characters, then we can use the actual letter spacing value
        if (!revertedToOriginalValue && width > 0){
            // revert to original value
            currentLetterSpacing = this.getLetterSpacing();
            // make sure we only enter this condition once
            revertedToOriginalValue = true;
        }

        // store character's width temporarily
        var tempWidth = this.measureCharacterWidth(char, scale);

        // if valid
        if (tempWidth > 0){
            // add its width
            // if tempWidth was 0, adding letter spacing wouldn't make much sense.
            width += tempWidth + currentLetterSpacing;
        }
    }

    // return total width
    return width;
};

TextLayout.prototype.wrapWordsShortVersion = function(text, maxLineWidth, scale){
    // retrieve words
    var words = text.split(' ');

    // no need to go further if there is only 1 word
    if (words.length == 1){
        return words;
    }

    var result = [];

    var whitespace = " ";
    // get first word and remove it from the array
    var currentLine = words.shift();

    // iterate through the words
    for (var w = 0; w < words.length; w++){
        // retrieve word
        var word = words[w];

        // simulate line width with the current word and whitespaces in between
        var tempLine = currentLine + whitespace + word;

        var tempWidth = this.measureTextWidth(tempLine, scale);

        if (tempWidth > maxLineWidth){
            result.push(currentLine);
            currentLine = word;
        }
        else {
            currentLine += whitespace + word;
        }
    }

    // push last line
    result.push(currentLine);

    return result;
};

/**
 * Wraps the words of a given text depending on a maximum width and text scale
 * @param {string} text text to wrap
 * @param {number} maxLineWidth maximum line width
 * @param {number} scale scale of the given text
 * @returns {Array} wrapped text in lines
 * @private
 */
TextLayout.prototype.wrapWordsLongVersion = function(text, maxLineWidth, scale){
    var result = [];

    if(!text || !maxLineWidth || !scale || maxLineWidth <= 0 || scale <= 0){
        return result;
    }

    // retrieve words
    var words = text.split(' ');

    // get first word and remove it from the array
    var currentLine = "";//words.shift();
    // store its width
    var currentLineWordWidth = 0;//this.measureTextWidth(currentLine, scale);

    var whitespace = "";// " ";
    var whitespaceWidth = 0;//this.measureCharacterWidth(whitespace, scale);
    // just to keep track of reverting whitespace to its original value (its real width)
    var revertedToOriginalValue = false;

    // iterate through the words
    for (var w = 0; w < words.length; w++){
        // retrieve word
        var word = words[w];

        // just a way to not consider whitespace and its width (along with a possible letter spacing value)
        // if there aren't any characters or words already in the current line.
        if (!revertedToOriginalValue && currentLineWordWidth > 0){
            whitespace = " ";
            // letter spacing also affects the whitespace width when there is at least 1 word
            whitespaceWidth = this.measureCharacterWidth(whitespace, scale) + this.getLetterSpacing();
            // make sure we only enter this condition once (per line)
            revertedToOriginalValue = true;
        }

        // calculate word width according to the text scale (not characters length!)
        var wordWidth = this.measureTextWidth(word, scale);

        // TODO: think of a cleaner way of doing this? maybe wrapTextByCharacter shouldn't return line objects?
        if (this.getCharacterWrap() && wordWidth > maxLineWidth){
            var tempLine = currentLine + whitespace + word;

            var characterWrappedLines = this.wrapTextByCharacter(tempLine, scale, maxLineWidth);

            // currentLine is the last line so maybe next word also fits
            currentLine = characterWrappedLines.splice(-1, 1)[0].chars.join("");
            currentLineWordWidth = this.measureTextWidth(currentLine, scale);
            // reset whitespace values as currentLineWordWidth can be 0... and would consider whitespace
            // in the beginning of a new line, which we are trying to avoid (the reason of all this mess!)
            whitespace = "";
            whitespaceWidth = 0;
            revertedToOriginalValue = false;

            // push the others
            for (var cline = 0; cline < characterWrappedLines.length; cline++){
                var characterLine = characterWrappedLines[cline].chars.join("");
                result.push(characterLine);
            }
            // no need to go further in this iteration
            continue;
        }

        // simulate line width with the current word, a whitespace in between and also extra line spacing if any
        var tempWidth = currentLineWordWidth + wordWidth + whitespaceWidth;

        if (tempWidth > maxLineWidth){
            result.push(currentLine);
            currentLine = word;
            currentLineWordWidth = wordWidth;
            // reset whitespace values as currentLineWordWidth can be 0... and would consider whitespace
            // in the beginning of a new line, which we are trying to avoid (the reason of all this mess!)
            whitespace = "";
            whitespaceWidth = 0;
            revertedToOriginalValue = false;
        }
        else {
            currentLine += whitespace + word;
            currentLineWordWidth += whitespaceWidth + wordWidth;
        }
    }

    // push last line
    result.push(currentLine);

    return result;
};

/**
 * Wraps the characters of a given text depending on a maximum width and text scale
 * @param {string} text text to wrap
 * @param {number} scale scale of the given text
 * @param {number} maxLineWidth maximum line width
 * @returns {Array} wrapped text in lines
 * @private
 */
TextLayout.prototype.wrapTextByCharacter = function(text, scale, maxLineWidth){
    // create empty array
    var lines = [];

    // TODO: trim?
    // if word or scale are empty, no need to go further
    if (!text || !scale || !maxLineWidth || scale <= 0 || maxLineWidth <= 0){
        return lines;
    }

    // create first line, since it's sure to have some text
    lines.push({
        chars: [],
        width: 0
    });

    // set initial value for letter spacing (for the first character iteration, basically...)
    var currentLetterSpacing = 0;
    // just to keep track of reverting to letter spacing original value
    var revertedToOriginalValue = false;

    // iterate through text characters
    for (var c = 0; c < text.length; c++){
        // retrieve text character
        var char = text[c];

        // store current line index
        var currentLine = lines.length - 1;

        // after the first (valid) character of current line, get the actual value of letter spacing
        if (!revertedToOriginalValue && lines[currentLine].width > 0){
            // revert to original value
            currentLetterSpacing = this.getLetterSpacing();
            // make sure we only enter this condition once (per line, thus the resets down below)
            revertedToOriginalValue = true;
        }

        // retrieve character width
        var charWidth = this.measureCharacterWidth(char, scale);

        // current width + char width + letter spacing if there is at least 1 character
        var tempWidth = lines[currentLine].width + charWidth + currentLetterSpacing;

        // if current line width + the current character width is > than the max width
        if(tempWidth > maxLineWidth){
            // create a new and empty line
            lines.push({
                chars: [],
                width: 0
            });

            // update current line index
            currentLine++;
            // reset letter spacing!
            currentLetterSpacing = 0;
            // and the variable that keeps track of reverting to actual letter spacing value
            revertedToOriginalValue = false;

            // skip if the character is a whitespace
            if (char === " "){
                continue;
            }
        }

        // add character and its width to current line (plus letter spacing if there is at least 1 character)
        lines[currentLine].width += charWidth + currentLetterSpacing;
        lines[currentLine].chars.push(char);
    }

    return lines;
};

/**
 * Converts a given text into a Line Object, with an array of characters and the line total width
 * @param {string} text text to convert into a line object
 * @param {number} scale scale of the given text
 * @returns {{chars: Array, width: number}}
 * @private
 */
TextLayout.prototype.convertTextToLine = function(text, scale){
    // define empty line
    var line = {
        chars: Array(),
        width: 0
    };

    // return empty if any of the values is invalid
    if (!text || !scale || scale <= 0){
        return line;
    }

    // set line characters and width
    line.chars = text.split("");
    line.width = this.measureTextWidth(text, scale);

    return line;
};

/**
 * Creates the definitive lines to draw onto the screen
 * @param {string} text text to draw
 * @param {number} scale scale of the text
 * @param {number} maxLineWidth maximum line width
 * @returns {Array} text split into lines
 * @private
 */
TextLayout.prototype.measureText = function (text, scale, maxLineWidth) {
    // create empty array
    var resultLines = [];

    // TODO: trim text? guess that, at least technically, a lot of spaces should still be drawn...
    // if text or scale don't exist, no need to go further
    if (!text || !scale || scale <= 0){
        return resultLines;
    }

    // create first line, since it's sure to have some text
    resultLines.push({
        chars: [],
        width: 0
    });

    // store original text
    var useText = text;

    // create array for user defined lines
    var userDefinedLines = [];

    var wordWrap = this.getWordWrap();

    // word wrap by inserting \n in the original text
    if (wordWrap){
        // initialize resulting text
        var wrappedText = "";
        // split text into lines defined by the user
        userDefinedLines = useText.split(/(?:\r\n|\r|\n)/);

        // iterate through lines
        for (var l = 0; l < userDefinedLines.length; l++){
            // wrap line
            var wrappedLine = this.wrapWordsLongVersion(userDefinedLines[l], maxLineWidth, scale).join('\n');
            // always insert a break at the end since the split gets rid of the user defined breaks...
            wrappedLine = wrappedLine.insert(wrappedLine.length, "\n");
            // concatenate to resulting wrapping text
            wrappedText = wrappedText.concat(wrappedLine);
        }

        // assign useText to resulting wrapping text
        useText = wrappedText;
    }

    // split text into lines defined by the users (and also word wrapped now ;))
    userDefinedLines = useText.split(/(?:\r\n|\r|\n)/);

    // iterate through user defined lines (with special characters)
    for (var l = 0; l < userDefinedLines.length; l++){

        var userDefinedLine = userDefinedLines[l];

        var preparedLines = [];

        // only perform character wrap if word wrap isn't enabled in the first place
        if (!wordWrap && this.getCharacterWrap()) {
            preparedLines = this.wrapTextByCharacter(userDefinedLine, scale, maxLineWidth);
        }
        else {
            preparedLines.push(this.convertTextToLine(userDefinedLine, scale));
        }

        // extended result array (does not create a new array such as concat)
        Array.prototype.push.apply(resultLines, preparedLines);
    }

    return resultLines;
};



