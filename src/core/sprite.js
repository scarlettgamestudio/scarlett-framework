/**
 * Sprite class
 */
AttributeDictionary.inherit("sprite", "gameobject");
AttributeDictionary.addRule("sprite", "_textureSrc", {displayName: "Image Src", editor: "filepath"});
AttributeDictionary.addRule("sprite", "_tint", {displayName: "Tint"});
AttributeDictionary.addRule("sprite", "_texture", {visible: false});

function Sprite(params) {
    params = params || {};
    params.name = params.name || "Sprite";

    GameObject.call(this, params);

    // private properties:
    this._texture = params.texture;
    this._textureSrc = "";
    this._tint = params.tint || Color.fromRGB(255, 255, 255);
    this._textureWidth = 0;
    this._textureHeight = 0;
    this._origin = new Vector2(0.5, 0.5);
}

inheritsFrom(Sprite, GameObject);

Sprite.prototype.getBaseWidth = function() {
    return this._textureWidth;
};

Sprite.prototype.getBaseHeight = function() {
    return this._textureHeight;
};

Sprite.prototype.getMatrix = function () {
    var width = this._textureWidth * this.transform.getScale().x;
    var height = this._textureHeight * this.transform.getScale().y;

    mat4.identity(this._transformMatrix);
    mat4.translate(this._transformMatrix, this._transformMatrix, [this.transform.getPosition().x - width * this._origin.x, this.transform.getPosition().y - height * this._origin.y, 0]);
    mat4.translate(this._transformMatrix, this._transformMatrix, [width * this._origin.x, height * this._origin.y, 0]);
    mat4.rotate(this._transformMatrix, this._transformMatrix, this.transform.getRotation(), [0.0, 0.0, 1.0]);
    mat4.translate(this._transformMatrix, this._transformMatrix, [-width * this._origin.x, -height * this._origin.y, 0]);
    mat4.scale(this._transformMatrix, this._transformMatrix, [width, height, 0]);

    return this._transformMatrix;
};

Sprite.prototype.setOrigin = function (origin) {
    this._origin = origin;
};

Sprite.prototype.getOrigin = function () {
    return this._origin;
};

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
    // is this a ready texture?
    if (!texture || !texture.isReady()) {
        return;
    }

    this._texture = texture;

    // cache the dimensions
    this._textureWidth = this._texture.getWidth();
    this._textureHeight = this._texture.getHeight();
};

Sprite.prototype.render = function (delta, spriteBatch) {
    if (!this.enabled) {
        return;
    }

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
    var sprite = new Sprite({
        name: data.name,
        transform: Transform.restore(data.transform),
        children: Objectify.restoreArray(data.children),
        components: Objectify.restoreArray(data.components)
    });

    sprite.setTextureSrc(data.src);

    return sprite;
};

Sprite.prototype.unload = function () {

};
