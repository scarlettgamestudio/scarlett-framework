/**
 * Texture2D class
 */
function Texture2D(source) {
    if (!isObjectAssigned(source)) {
        throw error("Cannot create Texture2D without a valid source filename");
    }

    // public properties:


    // private properties:
    this._uid = generateUID();
    this._source = source;
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
    var promise = new Promise((function (resolve, reject) {
        ImageLoader.loadImage(path, function (e) {
            if (e.success) {
                var texture = new Texture2D(e.data);
                resolve(texture);

            } else {
                reject();

                // TODO: log this
            }
        });
    }).bind(this));

    return promise;
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