/**
 * Sprite class
 */
AttributeDictionary.addRule("sprite", "_textureSrc", {displayName: "Image Src", editor: "filepath"});
AttributeDictionary.addRule("sprite", "transform", {ownContainer:true});

function Sprite(params) {
    params = params || {};
    params.name = params.name || "Sprite";

    GameObject.call(this, params);

    // public properties:


    // private properties:
    this._texture = params.texture;
    this._textureSrc = "";

}

inheritsFrom(Sprite, GameObject);

Sprite.prototype.setTextureSrc = function (path) {
    this._textureSrc = path;

    Texture2D.fromPath(path).then(
        (function(texture) {
             this.setTexture(texture);
        }).bind(this), function(error) {
            // TODO: log this..
        }
    );
};

Sprite.prototype.getTextureSrc = function () {
    return this._textureSrc;
};

Sprite.prototype.getType = function () {
    return "sprite";
};

Sprite.prototype.getTexture = function () {
    return this._texture;
};

Sprite.prototype.setTexture = function (texture) {
    this._texture = texture;
};

Sprite.prototype.render = function (delta, spriteBatch) {
    spriteBatch.storeSprite(this);
};

// functions:
Sprite.prototype.toJSON = function () {
   // TODO: do this
};

Sprite.prototype.unload = function () {

};

Sprite.prototype.changeSource = function (src) {

};

