/**
 * Content Loader static class
 */
var ContentLoader = function () {
};

/**
 * Cached files
 * @type {{}}
 * @private
 */
ContentLoader._fileLoaded = {};
ContentLoader._fileAlias = {};

/**
 * Cached images
 * @type {{}}
 * @private
 */
ContentLoader._imgLoaded = {};
ContentLoader._imgAlias = {};

/**
 * Cached audio
 * @type {{}}
 * @private
 */
ContentLoader._audioLoaded = {};
ContentLoader._audioAlias = {};

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
 * Clears all loaded assets from the content loader
 */
ContentLoader.clear = function () {
    ContentLoader._imgLoaded = {};
    ContentLoader._imgAlias = {};
    ContentLoader._audioLoaded = {};
    ContentLoader._audioAlias = {};
    ContentLoader._fileLoaded = {};
    ContentLoader._fileAlias = {};
};

/**
 * Loads several assets per category (audio, images, ..) and resolves after all are loaded
 * @param assets
 */
ContentLoader.load = function (assets) {
    return new Promise(function (resolve, reject) {
        // result holder
        var result = {
            success: [],
            fail: []
        };

        // counters
        var toLoad = 0; // number of expected loaded assets
        var loaded = 0; // number of loaded assets

        function assetLoaded(asset, success) {
            loaded += 1;

            if (success) {
                result.success.push(asset);
            } else {
                result.fail.push(asset);
            }

            if (loaded >= toLoad) {
                resolve(result);
            }
        }

        // load all images:
        assets.images = assets.images || [];
        assets.images.forEach(function (asset) {
            if (!asset.path) {
                return;
            }

            toLoad++; // count only supposedly valid assets

            ContentLoader.loadImage(asset.path, asset.alias).then(
                function () {
                    assetLoaded(asset, true);
                }, function () {
                    assetLoaded(asset, false);
                }
            )
        });

        // load all images:
        assets.audio = assets.audio || [];
        assets.audio.forEach(function (asset) {
            if (!asset.path) {
                return;
            }

            toLoad++; // count only supposedly valid assets

            ContentLoader.loadAudio(asset.path, asset.alias).then(
                function () {
                    assetLoaded(asset, true);
                }, function () {
                    assetLoaded(asset, false);
                }
            )
        });

        // load all images:
        assets.files = assets.files || [];
        assets.files.forEach(function (asset) {
            if (!asset.path) {
                return;
            }

            toLoad++; // count only supposedly valid assets

            ContentLoader.loadFile(asset.path, asset.alias).then(
                function () {
                    assetLoaded(asset, true);
                }, function () {
                    assetLoaded(asset, false);
                }
            )
        });
    });
};

/**
 * Returns an image loaded by the given alias (if exists)
 * @param alias
 */
ContentLoader.getImage = function (alias) {
    if (ContentLoader._imgAlias.hasOwnProperty(alias)) {
        return ContentLoader._imgLoaded[ContentLoader._imgAlias[alias]]
    }
};

/**
 * loads an image file from a specified path into memory
 * @param path
 * @param alias
 * @returns {*}
 */
ContentLoader.loadImage = function (path, alias) {
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

                if (alias) {
                    ContentLoader._imgAlias[alias] = path;
                }

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
 * Returns an audio loaded by the given alias (if exists)
 * @param alias
 */
ContentLoader.getAudio = function (alias) {
    if (ContentLoader._audioAlias.hasOwnProperty(alias)) {
        return ContentLoader._audioLoaded[ContentLoader._audioAlias[alias]]
    }
};

/**
 * loads an audio file from a specified path into memory
 * @param path
 * @param alias
 * @returns {*}
 */
ContentLoader.loadAudio = function (path, alias) {
    return new Promise((function (resolve, reject) {
        path = ContentLoader._enrichRelativePath(path);

        // is the audio on cache?
        if (ContentLoader._audioLoaded.hasOwnProperty(path)) {
            // the audio is already cached. let's use it!
            resolve(ContentLoader._audioLoaded[path]);

        } else {
            var audio = new Audio();
            audio.src = path;
            audio.oncanplaythrough = function () {
                // cache the loaded image:
                ContentLoader._audioLoaded[path] = audio;

                if (alias) {
                    ContentLoader._audioAlias[alias] = path;
                }

                resolve(audio);
            };
            audio.onerror = function () {
                // TODO: log this
                reject();
            };
        }

    }).bind(this));
};

/**
 * Returns a file loaded by the given alias (if exists)
 * @param alias
 */
ContentLoader.getFile = function (alias) {
    if (ContentLoader._fileAlias.hasOwnProperty(alias)) {
        return ContentLoader._fileLoaded[ContentLoader._fileAlias[alias]]
    }
};

/**
 * loads a file from a specified path into memory
 * @param path
 * @param alias
 * @returns {*}
 */
ContentLoader.loadFile = function (path, alias) {
    return new Promise((function (resolve, reject) {
        path = ContentLoader._enrichRelativePath(path);

        // is the image on cache?
        if (ContentLoader._fileLoaded.hasOwnProperty(path)) {
            // the image is already cached. let's use it!
            resolve(ContentLoader._fileLoaded[path]);

        } else {
            var rawFile = new XMLHttpRequest();
            //rawFile.overrideMimeType("application/json");
            rawFile.open("GET", path, true);
            rawFile.onreadystatechange = function() {
                if (rawFile.readyState === 4 && rawFile.status == "200") {
                    // cache the loaded image:
                    ContentLoader._fileLoaded[path] = rawFile.responseText;

                    if (alias) {
                        ContentLoader._fileAlias[alias] = path;
                    }

                    resolve(rawFile.responseText);

                } else if (rawFile.readyState === 4 && rawFile.status != "200") {
                    reject();
                }
            };
            rawFile.send(null);
        }
    }).bind(this));
};