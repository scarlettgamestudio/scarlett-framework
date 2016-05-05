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

    this._imageData = ImageLoader.loadImage(source, function (response) {
        if (response.isSuccessful()) {
            this._hasLoaded = true;
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

Texture2D.prototype.isReady = function () {
    return this._hasLoaded;
};

Texture2D.prototype.unload = function () {
  
};