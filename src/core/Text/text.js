/**
 * Created by Luis on 16/12/2016.
 */
/**
 * Text class
 */
AttributeDictionary.inherit("text", "gameobject");
AttributeDictionary.addRule("text", "_textureSrc", {displayName: "Image Src", editor: "filepath"});
AttributeDictionary.addRule("text", "_color", {displayName: "Color"});
AttributeDictionary.addRule("text", "_text", {displayName: "Text"});
AttributeDictionary.addRule("text", "_texture", {visible: false});


function Text(params) {

    params = params || {};
    params.name = params.name || "Text";

    GameObject.call(this, params);

    this._textureSrc = "";
    this._color = params.color || Color.fromRGBA(164,56,32, 1.0);
    this._text = params.text || "";

    this._fontSize = 70.0;
    this._gamma = 2;

    this._stroke = new Stroke();
    // TODO: normalize
    // values between 0.1 and 0.5, where 0.1 is the highest stroke value... better to normalize? and clamp...
    this._stroke.setSize(0.0);
    this._stroke.setColor(Color.fromRGBA(186,85,54, 0.5));

    this._dropShadow = new Stroke();
    this._dropShadow.setSize(5.0);
    this._dropShadow.setColor(Color.fromRGBA(0, 0, 0, 1.0));

    // x and y values have to be between spread (defined in Hiero) / texture size
    // e.g., 4 / 512
    // need to normalize between those values
    this._dropShadowOffset = new Vector2(0, 0);

    this._align = Text.AlignType.LEFT;

    this._wordWrap = true;
    this._characterWrap = true;

    // either 0 or 1
    this._debug = 0;

    this._gl = GameManager.renderContext.getContext();

    this._vertexBuffer = this._gl.createBuffer();
    this._textureBuffer = this._gl.createBuffer();
    this._vertexIndicesBuffer = this._gl.createBuffer();
    this._textShader = new TextShader();

    this._font = params.font || {};

    // set text texture if defined
    this.setTexture(params.texture);

    // already done when creating a Texture2D with content loader
    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, this._texture.getImageData());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.uniform2f(this._textShader.uniforms.u_texsize._location, this._texture.getWidth(), this._texture.getHeight());
}

inheritsFrom(Text, GameObject);

Text.AlignType = {
    LEFT: 1,
    CENTER: 2,
    RIGHT: 3
};

Text.prototype.render = function (delta, spriteBatch) {

    if (!this.enabled) {
        return;
    }

    // get gl context
    var gl = this._gl;

    // use text shader
    GameManager.activeGame.getShaderManager().useShader(this._textShader);

    // enable shader attributes
    gl.enableVertexAttribArray(this._textShader.attributes.a_pos);
    gl.enableVertexAttribArray(this._textShader.attributes.a_texcoord);

    // draw text
    this._drawText(this.getText(), this.getFontSize());

    var cameraMatrix = GameManager.activeGame.getActiveCamera().getMatrix();

    // TODO: do multiplication inside shader (cf., textureShader)
    var mvpMatrix = mat4.create();
    mat4.multiply(mvpMatrix, cameraMatrix, this.getMatrix());
    gl.uniformMatrix4fv(this._textShader.uniforms.u_matrix._location, false, mvpMatrix);

    // bind to texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    this._texture.bind();
    // tell the shader which unit you bound the texture to. In this case it's to sampler 0
    gl.uniform1i(this._textShader.uniforms.u_texture._location, 0);

    // debug
    gl.uniform1f(this._textShader.uniforms.u_debug._location, this._debug);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.vertexAttribPointer(this._textShader.attributes.a_pos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._textureBuffer);
    gl.vertexAttribPointer(this._textShader.attributes.a_texcoord, 2, gl.FLOAT, false, 0, 0);

    // stroke
    var strokeColor = this.getStroke().getColor();
    gl.uniform4fv(this._textShader.uniforms.u_outlineColor._location, [strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a]);

    // stroke size
    // max shader value is 0.5; bigger than that is considered no outline.
    // in terms of raw values, we go from 0 to 10, so we calculate the scaled value between 0 and 10
    var scaledValue = this.getStroke().getSize() * 0.7 / 10;

    // revert the value, so 0 represents less stroke
    // add 0.1 because 0.0 is visually bad
    gl.uniform1f(this._textShader.uniforms.u_outlineDistance._location, 0.7 - scaledValue + 0.1);


    var dropShadowColor = this.getDropShadow().getColor();
    gl.uniform4fv(this._textShader.uniforms.u_dropShadowColor._location, [dropShadowColor.r, dropShadowColor.g, dropShadowColor.b, dropShadowColor.a]);
    // stroke size
    //  (raw value = between 0 and 10) * (actual shader max value = 0.5) / (max raw value = 10)
    gl.uniform1f(this._textShader.uniforms.u_dropShadowSmoothing._location, this.getDropShadow().getSize() * 0.5 / 10);

    // 4 / 512 = 0.0058 = max smoothing value
    this._dropShadowOffset.set(0.005, 0.005);
    gl.uniform2fv(this._textShader.uniforms.u_dropShadowOffset._location, [this._dropShadowOffset.x, this._dropShadowOffset.y]);


    //gl.drawArrays(gl.TRIANGLES, 0, this._vertexBuffer.numItems);

    var color = this.getColor();

    // font color (tint)
    gl.uniform4fv(this._textShader.uniforms.u_color._location, [color.r, color.g, color.b, color.a]);
    //gl.uniform1f(this._textShader.uniforms.u_buffer._location, 0.50); // 192 / 255

    // gamma (smoothing) value (how sharp is the text in the edges)
    gl.uniform1f(this._textShader.uniforms.u_gamma._location, this.getGamma() * 1.4142 / this.getFontSize());

    // draw the glyphs
    //gl.drawArrays(gl.TRIANGLES, 0, this._vertexBuffer.numItems);
    gl.drawElements(gl.TRIANGLES, this._vertexIndicesBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    // parent render function:
    GameObject.prototype.render.call(this, delta, spriteBatch);
};

Text.prototype.unload = function () {
    //gl.deleteBuffer(this._vertexBuffer);
    //gl.deleteBuffer(this._texBuffer);

    //this._textureShader.unload();
};

// TODO: rotate, scale... probably the same thing as in the sprite
Text.prototype.getMatrix = function () {
    var x, y;

    x = this.transform.getPosition().x;
    y = this.transform.getPosition().y;

    mat4.identity(this._transformMatrix);

    //mat4.translate(this._transformMatrix, this._transformMatrix, [x, y, 0]);
    //mat4.rotate(this._transformMatrix, this._transformMatrix, this.transform.getRotation(), [0.0, 0.0, 1.0]);
    //mat4.translate(this._transformMatrix, this._transformMatrix, [-x, -y, 0]);

    mat4.translate(this._transformMatrix, this._transformMatrix, [x, y, 0]);

    return this._transformMatrix;
};

Text.prototype.getType = function () {
    return "Text";
};

Text.prototype.getTexture = function () {
    return this._texture;
};

Text.prototype.setTexture = function (texture) {
    // is this a ready texture?
    if (!texture || !texture.isReady()) {
        this._texture = null;
        this._textureWidth = 0;
        this._textureHeight = 0;
        return;
    }

    this._texture = texture;

    // cache the dimensions
    this._textureWidth = this._texture.getWidth();
    this._textureHeight = this._texture.getHeight();
};

Text.prototype.setColor = function (color) {
    this._color = color;
};

Text.prototype.getColor = function () {
    return this._color;
};

Text.prototype.setStroke = function (stroke) {
    this._stroke = stroke;
};

Text.prototype.getStroke = function () {
    return this._stroke;
};

Text.prototype.getDropShadow = function () {
    return this._dropShadow;
};

Text.prototype.setDropShadow = function (shadow) {
    this._dropShadow = shadow;
};


Text.prototype.setText = function (str) {
    this._text = str;
};

Text.prototype.getText = function () {
    return this._text;
};

Text.prototype.setFontSize = function (size) {
    this._fontSize = size;
};

Text.prototype.getFontSize = function () {
    return this._fontSize;
};

Text.prototype.setGamma = function (gamma) {
    this._gamma = gamma;
};

Text.prototype.getGamma = function () {
    return this._gamma;
};

Text.prototype.setDebug = function (value) {
    this._debug = value;
};

Text.prototype.getDebug = function () {
    return this._debug;
};

Text.prototype.setWordWrap = function (wrap) {
    this._wordWrap = wrap;
};

Text.prototype.getWordWrap = function () {
    return this._wordWrap;
};

Text.prototype.setCharacterWrap = function (wrap) {
    this._characterWrap = wrap;
};

Text.prototype.getCharacterWrap = function () {
    return this._characterWrap;
};

Text.prototype.setAlign = function (alignType) {
    this._align = alignType;
};

Text.prototype.getAlign = function () {
    return this._align;
};

Text.prototype.setTextureSrc = function (path) {
    this._textureSrc = path;

    if (path && path.length > 0) {
        Texture2D.fromPath(path).then(
            (function (texture) {
                this.setTexture(texture);
            }).bind(this), (function (error) {
                this.setTexture(null);
            }).bind(this)
        );
    } else {
        this.setTexture(null);
    }
};

Text.prototype.getTextureSrc = function () {
    return this._textureSrc;
};

// TODO: remove
var maxWidth = 500;

/**
 *
 * @param {string} char character whose correspondent (font) ID is to be found (different from ascii code!)
 * @returns {number} font's character's ID or null if invalid
 * @private
 */
Text.prototype._findCharID = function(char){
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
 * Measures a given character's width based on the provided scale
 * @param {string} char character to measure
 * @param {number} scale scale of the given character
 * @returns {number} the character width if valid and 0 if invalid
 * @private
 */
Text.prototype._measureCharacterWidth = function(char, scale){

    // if parameters are missing
    if (!char || !scale || scale <= 0){
        return 0;
    }

    // retrieve character ID
    var charID = this._findCharID(char);

    // don't go further if char id is invalid
    if (charID === null){
        return 0;
    }

    // calculate character 'width'
    // xadvance is based not only on the width but also on the padding, thus being used instead of width
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
Text.prototype._measureTextWidth = function(text, scale){
    // don't go further if text or scale do not exist
    if (!text || !scale || scale <= 0){
        return 0;
    }

    // set initial width
    var width = 0;

    // iterate through every character
    for (var c = 0; c < text.length; c++){
        // retrieve character at position c
        var char = text[c];

        // TODO: check for 0? (invalid)
        // add its width
        width += this._measureCharacterWidth(char, scale);
    }

    // return total width
    return width;
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

Text.prototype._wrapWordsShortVersion = function(text, maxLineWidth, scale){
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

        var tempWidth = this._measureTextWidth(tempLine, scale);

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
Text.prototype._wrapWordsLongVersion = function(text, maxLineWidth, scale){
    var result = [];

    if(!text || !maxLineWidth || !scale || maxLineWidth <= 0 || scale <= 0){
        return result;
    }

    // retrieve words
    var words = text.split(' ');

    // get first word and remove it from the array
    var currentLine = "";//words.shift();
    // store its width
    var currentLineWordWidth = 0;//this._measureTextWidth(currentLine, scale);

    var whitespace = "";// " ";
    var whitespaceWidth = 0;//this._measureCharacterWidth(whitespace, scale);

    // iterate through the words
    for (var w = 0; w < words.length; w++){
        // retrieve word
        var word = words[w];

        // ...... lol
        if (w == 1){
            whitespace = " ";
            whitespaceWidth = this._measureCharacterWidth(whitespace, scale);
        }

        // calculate word width according to the text scale (not characters length!)
        var wordWidth = this._measureTextWidth(word, scale);

        // TODO: think of a cleaner way of doing this? maybe _wrapTextByCharacter shouldn't return line objects?
        if (this._characterWrap && wordWidth > maxLineWidth){
            var tempLine = currentLine + whitespace + word;

            var characterWrappedLines = this._wrapTextByCharacter(tempLine, scale, maxLineWidth);

            // currentLine is the last line so maybe next word also fits
            currentLine = characterWrappedLines.splice(-1, 1)[0].chars.join("");
            currentLineWordWidth = this._measureTextWidth(currentLine, scale);

            // push the others
            for (var cline = 0; cline < characterWrappedLines.length; cline++){
                var characterLine = characterWrappedLines[cline].chars.join("");
                result.push(characterLine);
            }
            // no need to go further in this iteration
            continue;
        }

        // simulate line width with the current word and a whitespace in between
        var tempWidth = currentLineWordWidth + wordWidth + whitespaceWidth;

        if (tempWidth > maxLineWidth){
            result.push(currentLine);
            currentLine = word;
            currentLineWordWidth = wordWidth;
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

// TODO: Line class?
/**
 * Wraps the characters of a given text depending on a maximum width and text scale
 * @param {string} text text to wrap
 * @param {number} scale scale of the given text
 * @param {number} maxLineWidth maximum line width
 * @returns {Array} wrapped text in lines
 * @private
 */
Text.prototype._wrapTextByCharacter = function(text, scale, maxLineWidth){
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

    // iterate through text characters
    for (var c = 0; c < text.length; c++){
        // retrieve text character
        var char = text[c];

        // retrieve character width
        var charWidth = this._measureCharacterWidth(char, scale);

        // store current line index
        var currentLine = lines.length - 1;

        // current width + char width
        var tempWidth = lines[currentLine].width + charWidth;

        // if current line width + the current character width is > than the max width
        if(tempWidth > maxLineWidth){
            // create a new and empty line
            lines.push({
                chars: [],
                width: 0
            });

            // update current line index
            currentLine++;

            // skip if the character is a whitespace
            if (char === " "){
                continue;
            }
        }

        // add character and its width to current line
        lines[currentLine].width += charWidth;
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
Text.prototype._convertTextToLine = function(text, scale){
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
    line.width = this._measureTextWidth(text, scale);

    return line;
};

/**
 * Creates the definitive lines to draw onto the screen
 * @param {string} text text to draw
 * @param {number} scale scale of the text
 * @returns {Array} text split into lines
 * @private
 */
Text.prototype._measureText = function (text, scale) {
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

    // word wrap by inserting \n in the original text
    if (this._wordWrap){
        // initialize resulting text
        var wrappedText = "";
        // split text into lines defined by the user
        userDefinedLines = useText.split(/(?:\r\n|\r|\n)/);

        // iterate through lines
        for (var l = 0; l < userDefinedLines.length; l++){
            // wrap line
            var wrappedLine = this._wrapWordsLongVersion(userDefinedLines[l], maxWidth, scale).join('\n');
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
        if (!this._wordWrap && this._characterWrap) {
            preparedLines = this._wrapTextByCharacter(userDefinedLine, scale, maxWidth);
        }
        else {
            preparedLines.push(this._convertTextToLine(userDefinedLine, scale));
        }

        // extended result array (does not create a new array such as concat)
        Array.prototype.push.apply(resultLines, preparedLines);
    }

    return resultLines;
};

/**
 * Draws a given text onto the screen
 * @param {string} text text to draw onto the screen
 * @param {number} size font size
 * @private
 */
Text.prototype._drawText = function (text, size) {

    // no need to go further if parameters or _font are invalid
    if (!text || !size || size <= 0 || !this._font || !this._font.info ||
                !this._font.info.size || this._font.info.size <= 0){
        return;
    }

    // retrieve metrics size
    var metricsSize = this._font.info.size;

    // text scale based on the font size
    var scale = size / metricsSize;

    var x;
    var lines;

    // TODO: create a function for this? alignPositionAccordingly
    switch(this._align) {
        case Text.AlignType.LEFT:
            x = 0; // bounding box x
            break;
        case Text.AlignType.RIGHT: // x + bounding box width
            break;
        default:
            // do nothing since center is calculated per line
    }

    // create the lines to draw onto the screen
    lines = this._measureText(text, scale);

    // draws lines
    // TODO: remove x parameter?
    this._drawLines(lines, scale, x);
};

/**
 * Draws the given text lines onto the screen
 * @param {Array} lines lines to draw
 * @param {number} scale scale of the text
 * @param {number} x
 * @private
 */
Text.prototype._drawLines = function(lines, scale, x){

    // if lines or scale don't exist, no need to go further
    if (!lines || !scale || scale <= 0){
        return;
    }

    // retrieve webgl context
    var gl = this._gl;

    // create shader arrays, which are filled inside prepareLineToBeDrawn
    var vertexElements = [];
    var textureElements = [];
    var vertexIndices = [];

    // center (0,0)

    var currentY = 0;

    for (var i = 0; i < lines.length; i++) {

        if (this._align == Text.AlignType.CENTER){
            // text x position - lines[i].width / 2 or...
            // x + text width/2 - lines[i].width / 2 ?
            x = 0 - lines[i].width / 2;
        }

        // create pen with the screen coordinates
        //  TODO: replace by vector2?
        var pen = { x: x, y: currentY - 350 };

        // retrieve line characters
        var line = lines[i].chars;

        // prepare to draw line
        this._prepareLineToBeDrawn(line, scale, pen, vertexElements, textureElements, vertexIndices);

        // update Y (one more line) // todo: CHANGE according to bmfont...
        currentY += this.getFontSize();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexElements), gl.STATIC_DRAW);
    this._vertexBuffer.numItems = vertexElements.length / 2;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._vertexIndicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
    this._vertexIndicesBuffer.numItems = vertexIndices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, this._textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureElements), gl.STATIC_DRAW);
    this._textureBuffer.numItems = textureElements.length / 2;
};

/**
 * Prepares a line to be drawn
 * @param {Array} line array of characters whose draw is to be prepared
 * @param {number} scale text desired scale
 * @param {{x: number, y:number}} pen pen to draw with
 * @param {Array} vertexElements array to store the characters vertices
 * @param {Array} textureElements array to store the characters texture elements
 * @param {Array} vertexIndices array to store the vertices indices
 * @private
 */
Text.prototype._prepareLineToBeDrawn = function(line, scale, pen, vertexElements, textureElements, vertexIndices){

    var lastGlyphCode = 0;

    // iterate through line characters
    for (var i = 0; i < line.length; i++){

        // retrieve line char
        var char = line[i];

        // prepare character to be drawn
        lastGlyphCode = this._createGlyph(char, scale, pen, lastGlyphCode,
            vertexElements, textureElements, vertexIndices);

    }
};

/**
 * Creates the necessary vertices and texture elements to draw a given character
 * @param {string} char character to prepare to draw
 * @param {number} scale text scale
 * @param {{x: number, y: number}} pen pen to draw with
 * @param {number} lastGlyphCode last drawn glyph ascii code
 * @param {Array} vertexElements array to store the characters vertices
 * @param {Array} textureElements array to store the characters texture elements
 * @param {Array} vertexIndices array to store the vertices indices
 * @returns {number} drawn glyph ascii code
 * @private
 */
Text.prototype._createGlyph = function (char, scale, pen, lastGlyphCode,
                                        vertexElements, textureElements, vertexIndices) {

    // if font or any of the parameters is missing, no need to go further
    if (!this._font || !this._font.chars || !char || !scale || scale <= 0 || !pen  || lastGlyphCode == null ||
                !vertexElements || !textureElements || !vertexIndices) {
        return 0;
    }

    // retrieve char ID
    var charID = this._findCharID(char);

    // return if null
    if (charID === null){
        return 0;
    }

    // retrieve font metrics
    var metrics = this._font.chars[charID];

    // retrieve character metrics
    var width = metrics.width;
    var height = metrics.height;
    var xOffset = metrics.xoffset;
    var yOffset = metrics.yoffset;
    var xAdvance = metrics.xadvance;
    var posX = metrics.x;
    var posY = metrics.y;
    var asciiCode = metrics.id;

    // set kerning initial value
    var kern = 0;

    if (width > 0 && height > 0) {
        //width += metrics.buffer * 2;
        //height += metrics.buffer * 2;

        // if there a glyph was created before,
        if (lastGlyphCode){
            // retrieve kerning value between last character and current character
            kern = this._getKerning(lastGlyphCode, asciiCode);
        }

        // TODO: isn't there a way to reuse the indices?
        var factor = (vertexIndices.length / 6) * 4;

        vertexIndices.push(
            0 + factor, 1 + factor, 2 + factor,
            1 + factor, 2 + factor, 3 + factor
        );

        // Add a quad (= two triangles) per glyph.
        vertexElements.push(
            pen.x + ((xOffset + kern) * scale), pen.y + yOffset * scale,
            pen.x + ((xOffset + kern + width) * scale), pen.y + yOffset * scale,
            pen.x + ((xOffset + kern) * scale), pen.y + (height + yOffset) * scale,

            pen.x + ((xOffset + kern  + width) * scale), pen.y + (height + yOffset) * scale
        );

        /*              ___
           |\           \  |
           | \           \ |
           |__\ and then  \|
         */
        // example without scaling
        /*
         var bottomLeftX = pen.x + horiBearingX;
         var bottomLeftY = pen.y + horiBearingY;
         vertexElements.push(
            bottomLeftX, bottomLeftY, // bottom left
            bottomLeftX + width, bottomLeftY, // bottom right
            bottomLeftX, bottomLeftY + height, // top left

            bottomLeftX + width, bottomLeftY, // bottom right
            bottomLeftX, bottomLeftY + height, // top left
            bottomLeftX + width, bottomLeftY + height // top right
        );*/

        textureElements.push(
            posX, posY,
            posX + width, posY,
            posX, posY + height,

            posX + width, posY + height
        );
    }

    pen.x = pen.x + (xAdvance + kern) * scale;

    // return the last glyph ascii code
    return asciiCode;
};

/**
 * Retrieves Kerning value between the given characters
 * @param {number} firstCharCode first character ascii code
 * @param {number} secondCharCode second character ascii code
 * @returns {number} kerning value or 0 if not found
 * @private
 */
Text.prototype._getKerning = function (firstCharCode, secondCharCode) {
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
    return 0
}