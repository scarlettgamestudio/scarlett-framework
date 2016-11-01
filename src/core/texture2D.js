/**
 * Texture2D class
 */
function Texture2D(image) {
    if (!isObjectAssigned(image)) {
        throw error("Cannot create Texture2D without an image source");
    }

    // private properties:
    this._uid = generateUID();
    this._source = image;
    this._texture = null;
    this._gl = gl = GameManager.renderContext.getContext();

    // Prepare the webgl texture:
    this._texture = gl.createTexture();

    // binding
    gl.bindTexture(gl.TEXTURE_2D, this._texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._source);

    this._hasLoaded = true;
}

Texture2D.fromPath = function (path) {
    return new Promise((function (resolve, reject) {
        ContentLoader.loadImage(path).then(function (image) {
            resolve(new Texture2D(image));

        }, function () {
            reject();

        });
    }).bind(this));
};

Texture2D.prototype.getUID = function () {
    return this._uid;
};

Texture2D.prototype.bind = function () {
    this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
};

Texture2D.prototype.setImageData = function (imageData) {
    this._source = imageData;
};

Texture2D.prototype.getWidth = function () {
    return this._source.width;
};

Texture2D.prototype.getHeight = function () {
    return this._source.height;
};

Texture2D.prototype.getImageData = function () {
    return this._source;
};

Texture2D.prototype.getTexture = function () {
    return this._texture;
};

Texture2D.prototype.isReady = function () {
    return this._hasLoaded;
};

Texture2D.prototype.unload = function () {

};