/**
 * Sprite class
 */
AttributeDictionary.inherit("sprite", "gameobject");
AttributeDictionary.addRule("sprite", "_source", {displayName: "Source", editor: "filepath"});
AttributeDictionary.addRule("sprite", "_tint", {displayName: "Tint"});
AttributeDictionary.addRule("sprite", "_texture", {visible: false});
AttributeDictionary.addRule("sprite", "_wrapMode", {visible: false}); // temporary while we don't have cb's in editor
AttributeDictionary.addRule("sprite", "_atlasRegion", {
    displayName: "Region", available: function () {
        return isObjectAssigned(this._atlas)
    }
});

function Sprite(params) {
    params = params || {};
    params.name = params.name || "Sprite";

    GameObject.call(this, params);

    // private properties:
    this._source = "";
    this._atlasRegion = "";
    this._tint = params.tint || Color.fromRGB(255, 255, 255);
    this._textureWidth = 0;
    this._textureHeight = 0;
    this._origin = new Vector2(0.5, 0.5);
    this._wrapMode = WrapMode.CLAMP;
    this._atlas = null;

    this.setTexture(params.texture);
}

inheritsFrom(Sprite, GameObject);

Sprite.prototype.getBaseWidth = function () {
    return this._textureWidth;
};

Sprite.prototype.getBaseHeight = function () {
    return this._textureHeight;
};

Sprite.prototype.getMatrix = function () {
    let x, y, width, height;

    x = this.transform.getPosition().x;
    y = this.transform.getPosition().y;
    width = this._textureWidth * this.transform.getScale().x;
    height = this._textureHeight * this.transform.getScale().y;

    this._transformMatrix.identity();

    if (this._wrapMode != WrapMode.REPEAT) {
        this._transformMatrix.translate([x - width * this._origin.x, y - height * this._origin.y, 0]);
    } else {
        this._transformMatrix.translate([-width * this._origin.x, -height * this._origin.y, 0]);
    }

    this._transformMatrix.translate([width * this._origin.x, height * this._origin.y, 0]);
    this._transformMatrix.rotate([0.0, 0.0, 1.0], this.transform.getRotation());
    this._transformMatrix.translate([-width * this._origin.x, -height * this._origin.y, 0]);
    this._transformMatrix.scale([width, height, 0]);

    return this._transformMatrix.asArray();
};

Sprite.prototype.setWrapMode = function (wrapMode) {
    this._wrapMode = wrapMode;
};

Sprite.prototype.getWrapMode = function () {
    return this._wrapMode;
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

Sprite.prototype.setSource = function (path) {
    this._source = path;

    if (path && path.length > 0) {
        var ext = Path.getFileExtension(path);

        if (ext == SC.CONTENT_EXTENSIONS.ATLAS) {
            ContentLoader.loadFile(path).then(
                (function (data) {
                    var atlas = Objectify.restoreFromString(data);

                    // is this a valid atlas?
                    if (atlas && isObjectAssigned(atlas.sourcePath)) {
                        // seems so!
                        this._atlas = atlas;
                        this._assignTextureFromPath(this._atlas.sourcePath);

                        // FIXME: change to a more appropriate event?
                        // this is currently being used so the property editor refreshes the view after the atlas
                        // is asynchronously loaded.
                        EventManager.emit(SC.EVENTS.CONTENT_ASSET_LOADED, path);
                    }

                }).bind(this), function (err) {
                    console.log("failed");
                }
            );

        } else {
            this._atlas = null;
            this._assignTextureFromPath(path);
        }

    } else {
        this.setTexture(null);
    }
};

Sprite.prototype._assignTextureFromPath = function (path) {
    Texture2D.fromPath(path).then(
        (function (texture) {
            this.setTexture(texture);

        }).bind(this), (function (error) {
            this.setTexture(null);
        }).bind(this)
    );
};


Sprite.prototype.getAtlasRegion = function () {
    return this._atlasRegion;
};

Sprite.prototype.setAtlasRegion = function (value) {
    this._atlasRegion = value;
};

Sprite.prototype.getSource = function () {
    return this._source;
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
        src: this._source,
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

    sprite.setSource(data.src);

    return sprite;
};

Sprite.prototype.unload = function () {

};
