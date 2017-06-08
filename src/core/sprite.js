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

/**
 * Sprite class
 */
class Sprite extends GameObject {

    //#region Constructors

    /**
     * Class constructor
     * @param {Object} params
     */
    constructor(params) {
        params = params || {};
        params.name = params.name || "Sprite";

        super(params);

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

    //#endregion

    //#region Public Methods

    //#region Static Methods

    static restore(data) {
        let sprite = new Sprite({
            name: data.name,
            transform: Transform.restore(data.transform),
            children: Objectify.restoreArray(data.children),
            components: Objectify.restoreArray(data.components)
        });

        sprite.setSource(data.src);

        return sprite;
    }

    //#endregion

    getBaseWidth() {
        return this._textureWidth;
    }

    getBaseHeight() {
        return this._textureHeight;
    }

    getMatrix() {
        let x, y, width, height;

        x = this.transform.getPosition().x;
        y = this.transform.getPosition().y;
        width = this._textureWidth * this.transform.getScale().x;
        height = this._textureHeight * this.transform.getScale().y;

        this._transformMatrix.identity();

        if (this._wrapMode !== WrapMode.REPEAT) {
            this._transformMatrix.translate([x - width * this._origin.x, y - height * this._origin.y, 0]);

        } else {
            this._transformMatrix.translate([-width * this._origin.x, -height * this._origin.y, 0]);

        }

        this._transformMatrix.translate([width * this._origin.x, height * this._origin.y, 0]);
        this._transformMatrix.rotate([0.0, 0.0, 1.0], this.transform.getRotation());
        this._transformMatrix.translate([-width * this._origin.x, -height * this._origin.y, 0]);
        this._transformMatrix.scale([width, height, 0]);

        return this._transformMatrix.asArray();
    }

    setWrapMode(wrapMode) {
        this._wrapMode = wrapMode;
    }

    getWrapMode() {
        return this._wrapMode;
    }

    setOrigin(origin) {
        this._origin = origin;
    }

    getOrigin() {
        return this._origin;
    }

    setTint(color) {
        this._tint = color;
    }

    getTint() {
        return this._tint;
    }

    setSource(path) {
        this._source = path;

        if (path && path.length > 0) {
            let ext = Path.getFileExtension(path);

            if (ext == SC.CONTENT_EXTENSIONS.ATLAS) {
                ContentLoader.loadFile(path).then(
                    (function (data) {
                        let atlas = Objectify.restoreFromString(data);

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
    }

    getAtlasRegion() {
        return this._atlasRegion;
    }

    setAtlasRegion(value) {
        this._atlasRegion = value;
    }

    getSource() {
        return this._source;
    }

    getType() {
        return "Sprite";
    }

    getTexture() {
        return this._texture;
    }

    setTexture(texture) {
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
    }

    render(delta, spriteBatch) {
        if (!this.enabled) {
            return;
        }

        // just store the sprite to render on flush:
        spriteBatch.storeSprite(this);

        // parent render function:
        super.render(delta, spriteBatch);
    }

    // functions:
    objectify() {
        let superObjectify = super.objectify();
        return Objectify.extend(superObjectify, {
            src: this._source,
            tint: this._tint.objectify()
        });
    }

    unload() {

    }

    //#endregion

    //#region Private Methods

    _assignTextureFromPath(path) {
        Texture2D.fromPath(path).then(
            (function (texture) {
                this.setTexture(texture);

            }).bind(this), (function (error) {
                this.setTexture(null);
            }).bind(this)
        );
    }

    //#endregion

}