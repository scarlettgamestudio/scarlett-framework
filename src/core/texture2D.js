/**
 * Texture2D class
 */
class Texture2D {

    //#region Constructors

    /**
     * @param {Image} image
     */
    constructor(image) {
        if (!isObjectAssigned(image)) {
            throw new Error("Cannot create Texture2D without an image source");
        }

        // private properties:
        this._uid = generateUID();
        this._source = image;
        this._texture = null;
        this._textureSrc = image.src;
        this._gl = GameManager.renderContext.getContext();

        // Prepare the webgl texture:
        this._texture = this._gl.createTexture();

        // binding
        this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);

        // Set the parameters so we can render any size image.
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);

        // Upload the image into the texture.
        this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, this._source);

        //this._gl.bindTexture(gl.TEXTURE_2D, null);

        this._hasLoaded = true;
    }

    //#endregion

    //#region Methods

    //#region Static Methods

    /**
     *
     * @param path
     * @returns {Promise}
     */
    static fromPath(path) {
        return new Promise(((resolve, reject) => {
            ContentLoader.loadImage(path).then((image) => {
                resolve(new Texture2D(image));
            }, function () {
                reject();
            });
        }).bind(this));
    }

    //#endregion

    /**
     *
     * @returns {Number}
     */
    getUID() {
        return this._uid;
    }

    /**
     *
     */
    bind() {
        this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
    }

    /**
     *
     * @param {Image} imageData
     */
    setImageData(imageData) {
        this._source = imageData;
        this._textureSrc = imageData.src;
    }

    /**
     *
     * @returns {Image}
     */
    getImageData() {
        return this._source;
    }

    getTextureSrc() {
        return this._textureSrc;
    }

    /**
     * Gets the texture width
     * @returns {Number}
     */
    getWidth() {
        return this._source.width;
    }

    /**
     * Gets the texture height
     * @returns {Number}
     */
    getHeight() {
        return this._source.height;
    }

    /**
     * Gets the Texture
     * @returns {WebGLTexture|*|null}
     */
    getTexture() {
        return this._texture;
    }

    /**
     *
     * @returns {boolean}
     */
    isReady() {
        return this._hasLoaded;
    }

    /**

     */
    unload() {

    }

    //#endregion

}