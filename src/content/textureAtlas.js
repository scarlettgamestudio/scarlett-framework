/**
 * Content Texture Atlas
 * @param params
 * @constructor
 */
function TextureAtlas(params) {
    params = params || {};

    ContentObject.call(this, params);

    // public properties:
    this.sourcePath = params.sourcePath || "";
}

inheritsFrom(TextureAtlas, ContentObject);

TextureAtlas.prototype.objectify = function () {
    return {
        sourcePath: this.sourcePath
    };
};

TextureAtlas.restore = function (data) {
    return new TextureAtlas({
        sourcePath: data.sourcePath
    });
};

TextureAtlas.prototype.getType = function () {
    return "TextureAtlas";
};