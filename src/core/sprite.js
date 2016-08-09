/**
 * Sprite class
 */
AttributeDictionary.inherit("sprite", "gameobject");
AttributeDictionary.addRule("sprite", "_textureSrc", {displayName: "Image Src", editor: "filepath"});
AttributeDictionary.addRule("sprite", "_tint", {displayName: "Tint"});

function Sprite(params) {
    params = params || {};
    params.name = params.name || "Sprite";

    GameObject.call(this, params);

    // private properties:
    this._texture = params.texture;
    this._textureSrc = "";
    this._tint = params.tint || Color.fromRGB(255, 255, 255);
}

inheritsFrom(Sprite, GameObject);

Sprite.prototype.setTint = function (color) {
    this._tint = color;
};

Sprite.prototype.getTint = function () {
    return this._tint;
};

Sprite.prototype.setTextureSrc = function (path) {
    this._textureSrc = path;

    if (path && path.length > 0) {
        Texture2D.fromPath(path).then(
            (function (texture) {
                this.setTexture(texture);
            }).bind(this), function (error) {
                // TODO: log this..
            }
        );
    }
};

Sprite.prototype.getTextureSrc = function () {
    return this._textureSrc;
};

Sprite.prototype.getType = function () {
    return "Sprite";
};

Sprite.prototype.getTexture = function () {
    return this._texture;
};

Sprite.prototype.setTexture = function (texture) {
    this._texture = texture;
};

Sprite.prototype.render = function (delta, spriteBatch) {
    // just store the sprite to render on flush:
    spriteBatch.storeSprite(this);

    // parent render function:
    GameObject.prototype.render.call(this, delta, spriteBatch);
};

// functions:
Sprite.prototype.objectify = function () {
    var superObjectify = GameObject.prototype.objectify.call(this);
    return Objectify.extend(superObjectify, {
        src: this._textureSrc,
        tint: this._tint.objectify()
    });
};

Sprite.restore = function (data) {
    var gameObject = GameObject.restore(data);
    var sprite = new Sprite();

    Objectify.extend(sprite, gameObject);

    sprite.setTextureSrc(data.src);

    return sprite;
};

Sprite.prototype.unload = function () {

};
