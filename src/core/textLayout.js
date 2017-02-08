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
}

TextLayout.AlignType = {
    LEFT: 1,
    CENTER: 2,
    RIGHT: 3
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



