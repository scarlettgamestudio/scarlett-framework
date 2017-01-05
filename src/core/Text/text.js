/**
 * Created by Luis on 16/12/2016.
 */
/**
 * SpriteBatch class
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
    this._color = params.color || Color.fromRGBA(0, 0, 0, 1.0);
    this._text = params.text || "";

    this._fontSize = 70.0;
    this._gamma = 2;

    this._stroke = new Stroke();
    // TODO: normalize
    // values between 0.1 and 0.7, where 0.1 is the highest stroke value... better to normalize?
    this._stroke.setSize(0.7);
    this._stroke.setColor(Color.fromRGBA(255, 255, 255, 1.0));

    this._align = Text.AlignType.LEFT;

    this._wordWrap = true;
    this._characterWrap = true;

    // either 0 or 1
    this._debug = 0;

    this._gl = GameManager.renderContext.getContext();

    this._vertexBuffer = this._gl.createBuffer();
    this._textureBuffer = this._gl.createBuffer();
    this._textShader = new TextShader();

    this._font = params.font || {};
    // hardcode value...
    this._font.buffer = 4;

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

    // create text
    this._drawText(this._text, this._fontSize);

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
    //gl.uniform4fv(this._textShader.uniforms.u_color._location, [strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a]);
    // stroke size
    //gl.uniform1f(this._textShader.uniforms.u_buffer._location, this.getStroke().getSize());

    gl.drawArrays(gl.TRIANGLES, 0, this._vertexBuffer.numItems);

    var color = this.getColor();

    // font color (tint)
    gl.uniform4fv(this._textShader.uniforms.u_color._location, [color.r, color.g, color.b, color.a]);
    gl.uniform1f(this._textShader.uniforms.u_buffer._location, 0.50); // 192 / 255

    // gamma value (how sharp is the text)
    gl.uniform1f(this._textShader.uniforms.u_gamma._location, this.getGamma() * 1.4142 / this.getFontSize());
    gl.drawArrays(gl.TRIANGLES, 0, this._vertexBuffer.numItems);

    // parent render function:
    GameObject.prototype.render.call(this, delta, spriteBatch);
};

Text.prototype.unload = function () {
    //gl.deleteBuffer(this._vertexBuffer);
    //gl.deleteBuffer(this._texBuffer);

    //this._textureShader.unload();
};

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

Text.prototype._findCharID = function(char){
    if (!char || !this._font || !this._font.chars || this._font.chars.length == 0){
        return -1;
    }
    // retrieve character's ascii code
    var charCode = char.charCodeAt(0);

    if (!charCode){
        return -1;
    }

    for (var i = 0; i < this._font.chars.length; i++){
        var glyphID = this._font.chars[i].id;
        if (glyphID === charCode){
            return i;
        }
    }
    return -1;
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

    var charID = this._findCharID(char);

    if (charID < 0){
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

    // no need to go further if there is only 1 word
    if (words.length == 1){
        return words;
    }

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
 * @returns {{chars: *, width: number}}
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
 * @param {number} size font size of the text
 * @returns {Array} text split into lines
 * @private
 */
Text.prototype._measureText = function (text, size) {
    // create empty array
    var resultLines = [];

    // TODO: trim text? guess that, at least technically, a lot of spaces should still be drawn...
    // if text or size or metrics don't exist, no need to go further
    if (!text || !size || size <= 0 || !this._font){
        return resultLines;
    }

    // retrieve metrics size
    var metricsSize = this._font.info.size;

    // return is metrics size is invalid
    if (metricsSize <= 0) {
        return resultLines;
    }

    // create first line, since it's sure to have some text
    resultLines.push({
        chars: [],
        width: 0
    });

    // calculate text scale
    var scale = size / metricsSize;

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

    var gl = this._gl;

    var vertexElements = [];
    var textureElements = [];

    // create the lines to draw onto the screen
    var lines = this._measureText(text, size);

    // center (0,0)

    var currentY = 0;

    var metrics = this._font;
    var scale = size / metrics.info.size;

    var x;

    switch(this._align) {
        case Text.AlignType.LEFT:
            x = 0; // bounding box x
            break;
        case Text.AlignType.RIGHT: // x + bounding box width
            break;
        default:
            // do nothing since center it's calculated per line
    }

    for (var i = 0; i < lines.length; i++) {

        if (this._align == Text.AlignType.CENTER){
            // text x position - lines[i].width / 2 or...
            // x + text width/2 - lines[i].width / 2 ?
                x = 0 - lines[i].width / 2;
        }

        // create pen with the screen coordinates
        //  TODO: replace by vector2?
        var pen = { x: x, y: currentY };

        // iterate through line chars
        for (var j = 0; j < lines[i].chars.length; j++){

            // retrieve line char
            var chr = lines[i].chars[j];

            // draw it
            this._createGlyph(metrics, chr, pen, scale, vertexElements, textureElements);
        }

        // update Y (one more line) // todo: CHANGE according to bmfont...
        currentY += this.getFontSize();
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexElements), gl.STATIC_DRAW);
    this._vertexBuffer.numItems = vertexElements.length / 2;

    gl.bindBuffer(gl.ARRAY_BUFFER, this._textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureElements), gl.STATIC_DRAW);
    this._textureBuffer.numItems = textureElements.length / 2;
};

/**
 * Creates the necessary vertices and texture elements to draw a given character
 * @param metrics font metrics
 * @param {string} chr character to prepare to draw
 * @param pen pen to draw with
 * @param {number} scale
 * @param {Array} vertexElements array to store the character vertices
 * @param {Array} textureElements array to store the character texture elements
 * @private
 */
Text.prototype._createGlyph = function (metrics, chr, pen, scale, vertexElements, textureElements) {

    var charID = this._findCharID(chr);

    if (charID < 0){
        return;
    }

    var metric = this._font.chars[charID];

    var factor = 1;

    // retrieve character metrics
    var width = metric.width;
    var height = metric.height;
    var horiBearingX = metric.xoffset;
    var horiBearingY = metric.yoffset;
    var horiAdvance = metric.xadvance;
    var posX = metric.x;
    var posY = metric.y;

    if (width > 0 && height > 0) {
        //width += metrics.buffer * 2;
        //height += metrics.buffer * 2;

        // Add a quad (= two triangles) per glyph.
        vertexElements.push(
            pen.x + ((horiBearingX ) * scale), pen.y + horiBearingY * scale,
            pen.x + ((horiBearingX  + width) * scale), pen.y + horiBearingY * scale,
            pen.x + ((horiBearingX ) * scale), pen.y + (height + horiBearingY) * scale,

            pen.x + ((horiBearingX  + width) * scale), pen.y + horiBearingY * scale,
            pen.x + ((horiBearingX ) * scale), pen.y + (height + horiBearingY) * scale,
            pen.x + ((horiBearingX  + width) * scale), pen.y + (height + horiBearingY) * scale
        );

        /*              ___
           |\           \  |
           | \           \ |
           |__\ and then  \|
         */
        /* example without scaling
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

            posX + width, posY,
            posX, posY + height,
            posX + width, posY + height
        );

    }

    // pen.x += Math.ceil(horiAdvance * scale);
    pen.x = pen.x + horiAdvance * scale;
};