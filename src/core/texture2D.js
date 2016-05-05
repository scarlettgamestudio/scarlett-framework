/**
 * Texture2D class
 */
function Texture2D(source) {
    if (!isObjectAssigned(source)) {
        throw error("Cannot create Texture2D without a valid source filename");
    }

    // public properties:


    // private properties:
    this._source = source;
    this._hasLoaded = false;
    this._texture = null;
    this._gl = GameManager.renderContext.getContext();

    var self = this;
    this._imageData = ImageLoader.loadImage(source, function (response) {
        if (response.isSuccessful()) {
            var gl = self._gl;

            self.texture = gl.createTexture();
            
            gl.bindTexture(gl.TEXTURE_2D, self.texture);

            // Set the parameters so we can render any size image.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            // Upload the image into the texture.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, response.data);

            self._hasLoaded = true;

        } else {
            // FIXME: give details about the error
            debug.warn("Texture2D with source " + this._source + " failed to load.");
        }
    });
}

Texture2D.prototype.setImageData = function(imageData) {
    this._imageData = imageData;
};

Texture2D.prototype.getImageData = function () {
    return this._imageData;
};

Texture2D.prototype.getTexture = function() {
    return this._texture;
};

Texture2D.prototype.isReady = function () {
    return this._hasLoaded;
};

Texture2D.prototype.unload = function () {

};