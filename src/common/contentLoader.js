/**
 * Content Loader static class
 */
var ContentLoader = function () {
};

/**
 * Cached images
 * @type {{}}
 * @private
 */
ContentLoader._imgLoaded = {};

/**
 * Cached audio
 * @type {{}}
 * @private
 */
ContentLoader._audioLoaded = {};

/**
 *
 * @param path
 * @returns {*}
 * @private
 */
ContentLoader._enrichRelativePath = function (path) {
    // is this a relative path?
    if (GameManager.activeProjectPath && path.indexOf(GameManager.activeProjectPath) < 0) {
        path = GameManager.activeProjectPath + path;
    }

    return path;
};

/**
 * loads an image file from a specified path into memory
 * @param path
 * @returns {*}
 */
ContentLoader.loadImage = function (path) {
    return new Promise((function (resolve, reject) {
        path = ContentLoader._enrichRelativePath(path);

        // is the image on cache?
        if (ContentLoader._imgLoaded.hasOwnProperty(path)) {
            // the image is already cached. let's use it!
            resolve(ContentLoader._imgLoaded[path]);

        } else {
            // the image is not in cache, we must load it:
            var image = new Image();
            image.src = path;
            image.onload = function () {
                // cache the loaded image:
                ContentLoader._imgLoaded[path] = image;

                resolve(image);
            };
            image.onerror = function () {
                // TODO: log this
                reject();
            };
        }
    }).bind(this));
};

/**
 * loads an audio file from a specified path into memory
 * @param path
 * @returns {*}
 */
ContentLoader.loadAudio = function (path) {
    return new Promise((function (resolve, reject) {
        path = ContentLoader._enrichRelativePath(path);

        // is the audio on cache?
        if (ContentLoader._audioLoaded.hasOwnProperty(path)) {
            // the audio is already cached. let's use it!
            resolve(ContentLoader._audioLoaded[path]);

        } else {
            var audio = new Audio();
            audio.src = path;
            audio.oncanplaythrough = function() {
                // cache the loaded image:
                ContentLoader._audioLoaded[path] = audio;

                resolve(audio);
            };
            audio.onerror = function () {
                // TODO: log this
                reject();
            };
        }

    }).bind(this));
};
