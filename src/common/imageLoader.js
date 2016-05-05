/**
 * Image Loader static class
 */
var ImageLoader = function() {};

/**
 *
 * @type {{}}
 */
ImageLoader.loaded = {};

/**
 * loads an image from a specified path into memory
 * @param path
 * @param callback
 * @returns {*}
 */
ImageLoader.loadImage = function(path, callback) {
    var image;

    // is the image on cache?
    if(ImageLoader.loaded.hasOwnProperty(path)) {
        // the image is already cached. let's use it!
        image = loaded[path];
    } else {
        // the image is not in cache, we must load it:
        image = new Image();
        image.src = path;
        image.onload = function() {
            ImageLoader.loaded[path] = image;

            if(isFunction(callback)) {
                callback(new CallbackResponse({
                    success: true,
                    data: image
                }));
            }
        };
        image.onerror = function() {
            callback(new CallbackResponse({
                success: false
            }));
        };
    }

    return image;
};

