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

    this._fontStyle = new FontStyle(params.font || {});

    this._fontStyle.setFontSize(params.fontSize || 70.0);
    this._fontStyle.setLetterSpacing(params.letterSpacing || 0);

    this._wordWrap = true;
    this._characterWrap = true;
    this._alignType = Text.AlignType.LEFT;

    this._textureSrc = "";
    this._color = params.color || Color.fromRGBA(164,56,32, 1.0);
    this._text = params.text || "";

    this._gamma = params.gamma || 2.0;

    // TODO: normalize inside the setters?
    // values between 0.1 and 0.5, where 0.1 is the highest stroke value... better to normalize? and clamp...
    this._stroke = new Stroke(Color.fromRGBA(186,85,54, 0.5), 0.0);

    this._dropShadow = new Stroke(Color.fromRGBA(0, 0, 0, 1.0), 5.0);

    // x and y values have to be between spread (defined in Hiero) / texture size
    // e.g., 4 / 512
    // need to normalize between those values
    this._dropShadowOffset = new Vector2(0, 0);

    // either 0 or 1
    this._debug = 0;

    this._gl = GameManager.renderContext.getContext();

    this._vertexBuffer = this._gl.createBuffer();
    this._textureBuffer = this._gl.createBuffer();
    this._vertexIndicesBuffer = this._gl.createBuffer();
    this._textShader = new TextShader();

    // set text texture if defined
    this.setTexture(params.texture);
}

inheritsFrom(Text, GameObject);

Text.AlignType = {
    LEFT: 1,
    CENTER: 2,
    RIGHT: 3
};

// TODO: remove
var maxWidth = 500;

Text.prototype.render = function (delta, spriteBatch) {

    if (!this.enabled) {
        return;
    }

    // TODO: don't render if font or font's texture are not valid/defined?

    // get gl context
    var gl = this._gl;

    // use text shader
    GameManager.activeGame.getShaderManager().useShader(this._textShader);

    // enable shader attributes
    gl.enableVertexAttribArray(this._textShader.attributes.aPos);
    gl.enableVertexAttribArray(this._textShader.attributes.aTexCoord);

    // draw text
    this._drawText();

    var cameraMatrix = GameManager.activeGame.getActiveCamera().getMatrix();

    gl.uniformMatrix4fv(this._textShader.uniforms.uMatrix._location, false, cameraMatrix);
    gl.uniformMatrix4fv(this._textShader.uniforms.uTransform._location, false, this.getMatrix());

    // bind to texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    this._texture.bind();
    // tell the shader which unit you bound the texture to. In this case it's to sampler 0
    gl.uniform1i(this._textShader.uniforms.uTexture._location, 0);

    // debug
    gl.uniform1f(this._textShader.uniforms.uDebug._location, this._debug);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.vertexAttribPointer(this._textShader.attributes.aPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._textureBuffer);
    gl.vertexAttribPointer(this._textShader.attributes.aTexCoord, 2, gl.FLOAT, false, 0, 0);

    // stroke
    var strokeColor = this.getStroke().getColor();
    gl.uniform4fv(this._textShader.uniforms.uOutlineColor._location, [strokeColor.r, strokeColor.g, strokeColor.b, strokeColor.a]);

    // stroke size
    // max shader value is 0.5; bigger than that is considered no outline.
    // in terms of raw values, we go from 0 to 10, so we calculate the scaled value between 0 and 10
    var scaledValue = this.getStroke().getSize() * 0.7 / 10;

    // revert the value, so 0 represents less stroke
    // add 0.1 because 0.0 is visually bad
    gl.uniform1f(this._textShader.uniforms.uOutlineDistance._location, 0.7 - scaledValue + 0.1);


    var dropShadowColor = this.getDropShadow().getColor();
    gl.uniform4fv(this._textShader.uniforms.uDropShadowColor._location, [dropShadowColor.r, dropShadowColor.g, dropShadowColor.b, dropShadowColor.a]);
    // stroke size
    //  (raw value = between 0 and 10) * (actual shader max value = 0.5) / (max raw value = 10)
    gl.uniform1f(this._textShader.uniforms.uDropShadowSmoothing._location, this.getDropShadow().getSize() * 0.5 / 10);

    // 4 / 512 = 0.0058 = max smoothing value
    this._dropShadowOffset.set(0.005, 0.005);
    gl.uniform2fv(this._textShader.uniforms.uDropShadowOffset._location, [this._dropShadowOffset.x, this._dropShadowOffset.y]);

    var color = this.getColor();

    // font color (tint)
    gl.uniform4fv(this._textShader.uniforms.uColor._location, [color.r, color.g, color.b, color.a]);
    //gl.uniform1f(this._textShader.uniforms.u_buffer._location, 0.50); // 192 / 255

    // gamma (smoothing) value (how sharp is the text in the edges)
    gl.uniform1f(this._textShader.uniforms.uGamma._location, this.getGamma() * 1.4142 / this.getFontSize());

    // draw the glyphs
    //gl.drawArrays(gl.TRIANGLES, 0, this._vertexBuffer.numItems);
    gl.drawElements(gl.TRIANGLES, this._vertexIndicesBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    // parent render function:
    GameObject.prototype.render.call(this, delta, spriteBatch);
};

Text.prototype.unload = function () {
    this._gl.deleteBuffer(this._vertexBuffer);
    this._gl.deleteBuffer(this._textureBuffer);
    this._gl.deleteBuffer(this._vertexIndicesBuffer);

    this._textShader.unload();

    // spritebatch related... TODO: add/remove when spritebatch is fixed?
    //this._gl.deleteBuffer(this._texBuffer);
    //this._textureShader.unload();
};

// TODO: rotate, scale... probably similar to sprite... think carefully about scaling?
Text.prototype.getMatrix = function () {
    let x, y;

    x = this.transform.getPosition().x;
    y = this.transform.getPosition().y;

    this._transformMatrix.identity();

    //mat4.translate(this._transformMatrix, this._transformMatrix, [x, y, 0]);
    //mat4.rotate(this._transformMatrix, this._transformMatrix, this.transform.getRotation(), [0.0, 0.0, 1.0]);
    //mat4.translate(this._transformMatrix, this._transformMatrix, [-x, -y, 0]);

    this._transformMatrix.translate([x, y, 0]);

    return this._transformMatrix.asArray();
};

Text.prototype.getType = function () {
    // TODO: is it even needed? we could replace this method in gameobject by this.name
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

    let gl = this._gl;

    // the line below is already done when creating a Texture2D with content loader
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, this._texture.getImageData());
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.uniform2f(this._textShader.uniforms.uTexSize._location, this._texture.getWidth(), this._texture.getHeight());
};

Text.prototype.setColor = function (color) {
    this._color = color;
};

Text.prototype.getColor = function () {
    return this._color;
};

/**
 * Sets the outline effect of the text
 * @param {Stroke} stroke outline effect of the text
 */
Text.prototype.setStroke = function (stroke) {
    this._stroke = stroke;
};

Text.prototype.getStroke = function () {
    return this._stroke;
};

Text.prototype.getDropShadow = function () {
    return this._dropShadow;
};

/**
 * Sets the dropshadow effect of the text
 * @param {Stroke} shadow dropshadow effect of the text
 */
Text.prototype.setDropShadow = function (shadow) {
    this._dropShadow = shadow;
};

Text.prototype.setText = function (str) {
    this._text = str;
};

Text.prototype.getText = function () {
    return this._text;
};

Text.prototype.getFontStyle = function () {
    return this._fontStyle;
};

/**
 * Sets the font style
 * @param {FontStyle} fontStyle font style
 */
Text.prototype.setFontStyle = function (fontStyle) {
    this._fontStyle = fontStyle;
};

/*
    Just for API sake
 */

Text.prototype.setFontSize = function (size) {
    this.getFontStyle().setFontSize(size);
};

Text.prototype.getFontSize = function () {
    return this.getFontStyle().getFontSize();
};

Text.prototype.getLetterSpacing = function(){
    return this.getFontStyle().getLetterSpacing();
};

Text.prototype.setLetterSpacing = function(value){
    this.getFontStyle().setLetterSpacing(value);
};

// #############

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

/**
 * Sets Text alignment
 * @param {Text.AlignType} alignType
 */
Text.prototype.setAlign = function (alignType) {
    this._alignType = alignType;
};

Text.prototype.getAlign = function () {
    return this._alignType;
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

/**
 * Draws the text onto the screen
 * @private
 */
Text.prototype._drawText = function () {
    var fontStyle = this.getFontStyle();

    if (!fontStyle){
        return;
    }

    var fontDescription = fontStyle.getFontDescription();

    // don't go further if font description isn't valid either
    if (!fontDescription || !fontDescription.common || !fontDescription.common.lineHeight){
        return;
    }

    // line height; falls back to font size
    var lineHeight = fontDescription.common.lineHeight || this.getFontSize();

    // text scale based on the font size
    var scale = fontStyle.getScale();

    // don't go further if scale is invalid
    if (!scale){
        return;
    }

    // create the lines to draw onto the screen
    var lines = TextUtils.measureText(fontStyle, this.getText(), maxWidth, this.getWordWrap(), this.getCharacterWrap());

    // draws lines
    this._drawLines(lines, scale, lineHeight);
};

/**
 * Aligns a line according to its width and align type
 * @param {number} width width of the line to align
 * @returns {number} the aligned x position of the line
 * @private
 */
Text.prototype._alignLine = function (width) {
    // set return variable
    var x;

    // change beginning of the line depending on the chosen alignment
    switch(this.getAlign()) {
        case Text.AlignType.LEFT:
            x = this.transform.getPosition().x;
            break;
        case Text.AlignType.CENTER:
            x = this.transform.getPosition().x + maxWidth / 2 - width / 2;
            break;
        case Text.AlignType.RIGHT:
            x = this.transform.getPosition().x + maxWidth - width;
            break;
        // TODO: implement AlignType.JUSTIFIED using Knuth and Plass's algorithm
        // case FontStyle.AlignType.JUSTIFIED:
        default:
            x = 0;
            break;
    }

    return x;
};

/**
 * Draws the given text lines onto the screen
 * @param {Array} lines lines to draw
 * @param {number} scale scale of the text
 * * @param {number} lineHeight how much Y should increase to switch line
 * @private
 */
Text.prototype._drawLines = function(lines, scale, lineHeight){

    // TODO: maybe throw new Error when simply returning? so errors can be seen in the console?
    // if parameters are invalid, no need to go further
    if (!lines || !scale || scale <= 0 || !lineHeight || lineHeight === 0){
        return;
    }

    // retrieve webgl context
    var gl = this._gl;

    // create shader arrays, which are filled inside prepareLineToBeDrawn
    var vertexElements = [];
    var textureElements = [];
    var vertexIndices = [];

    // create pen with the screen coordinates, where (0,0) is the center of the screen
    var pen = {
        x: 0,
        y: this.transform.getPosition().y
    };

    for (var i = 0; i < lines.length; i++) {

        // align line accordingly
        pen.x = this._alignLine(lines[i].width);

        // retrieve line characters
        var line = lines[i].chars;

        // prepare to draw line
        this._prepareLineToBeDrawn(line, scale, pen, vertexElements, textureElements, vertexIndices);

        // update Y before drawing another line
        // TODO: no need to recalculate this value every time...
        pen.y += lineHeight * scale;
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
 * @param {Array} outVertexElements out array to store the characters vertices
 * @param {Array} outTextureElements out array to store the characters texture elements
 * @param {Array} outVertexIndices out array to store the vertices indices
 * @returns {number} drawn glyph ascii code or 0 if invalid
 * @private
 */
Text.prototype._createGlyph = function (char, scale, pen, lastGlyphCode,
                                        outVertexElements, outTextureElements, outVertexIndices) {

    var fontStyle = this.getFontStyle();

    if (!fontStyle){
        return 0;
    }

    var fontDescription = fontStyle.getFontDescription();

    // if font's description or any of the parameters is missing, no need to go further
    if (!fontDescription || !fontDescription.chars ||
                !char || !scale || scale <= 0 || !pen || lastGlyphCode == null ||
                !outVertexElements || !outTextureElements || !outVertexIndices){
        return 0;
    }

    // retrieve char ID
    var charID = fontStyle.findCharID(char);

    // return if null
    if (charID === null){
        return 0;
    }

    // retrieve font metrics
    var metrics = fontDescription.chars[charID];

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

    // only prepare character to be drawn if width and height are valid
    if (width > 0 && height > 0) {
        // if a glyph was created before
        if (lastGlyphCode){
            // retrieve kerning value between last character and current character
            kern = fontStyle.getKerning(lastGlyphCode, asciiCode);
        }

        // TODO: isn't there a way to reuse the indices?
        var factor = (outVertexIndices.length / 6) * 4;

        outVertexIndices.push(
            0 + factor, 1 + factor, 2 + factor,
            1 + factor, 2 + factor, 3 + factor
        );

        // Add a quad (= two triangles) per glyph.
        outVertexElements.push(
            pen.x + ((xOffset + kern) * scale), pen.y + yOffset * scale,
            pen.x + ((xOffset + kern + width) * scale), pen.y + yOffset * scale,
            pen.x + ((xOffset + kern) * scale), pen.y + (height + yOffset) * scale,

            pen.x + ((xOffset + kern + width) * scale), pen.y + (height + yOffset) * scale
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

        outTextureElements.push(
            posX, posY,
            posX + width, posY,
            posX, posY + height,

            posX + width, posY + height
        );
    }

    // TODO: not sure kern should actually be added to the pen or just help with the offset when drawing.
    pen.x = pen.x + fontStyle.getLetterSpacing() + ((xAdvance + kern) * scale);

    // return the last glyph ascii code
    return asciiCode;
};
