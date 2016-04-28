/**
 * Texture2D class
 */
var Texture2D = (function () {

    // private properties
    var _this = {};

    /**
     * @constructor
     */
    function Texture2D(source) {
        if (!isObjectAssigned(source)) {
            throw error("Cannot create Texture2D without a valid source filename");
        }

        // public properties:


        // private properties:
        _this.source = source;
        _this.hasLoaded = false;

        _this.imageData = ImageLoader.loadImage(source, function (response) {
            if (response.isSuccessful()) {
                _this.hasLoaded = true;
            } else {
                // FIXME: give details about the error
                debug.warn("Texture2D with source " + _this.source + " failed to load.");
            }
        });
    }

    Texture2D.prototype.setImageData = function(imageData) {
        _this.imageData = imageData;
    };

    Texture2D.prototype.getImageData = function () {
        return _this.imageData;
    };

    Texture2D.prototype.isReady = function () {
        return _this.hasLoaded;
    };

    Texture2D.prototype.unload = function () {
        _this = null;
    };

    return Texture2D;

})();