/**
 * IO Path utility class
 */
var Path = function () {
};

/**
 *
 * @type {boolean}
 * @private
 */
Path._IS_WIN = navigator.platform.toLowerCase().indexOf('win') > -1;

/**
 * The appropriate system trailing slash
 * @type {string}
 */
Path.TRAILING_SLASH = Path._IS_WIN ? "\\" : "/";

/**
 * Ensures this is a valid string directory (eg. ends with slash)
 * @param path
 * @returns {string}
 */
Path.wrapDirectoryPath = function (path) {
    return path + (path.endsWith('/') || path.endsWith('\\') ? '' : Path.TRAILING_SLASH);
};

/**
 * Strips only the directory path (excludes file names)
 * @param path
 */
Path.getDirectory = function (path) {
    var index = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return path.substring(0, (index >= 0 ? index : path.length));
};

/**
 * Returns the directory name from a given path
 * @param path
 * @returns {string}
 */
Path.getDirectoryName = function (path) {
    if (path.endsWith("/") || path.endsWith("\\")) {
        path = path.substring(0, path.length - 1);
    }

    var index = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return path.substring(index + 1, path.length);
};

/**
 * Gets a filename from a given path
 * @param path
 */
Path.getFilename = function (path) {
    var index = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return path.substring((index >= 0 && index < path.length - 1 ? index + 1 : 0), path.length);
};

/**
 * Gets a file extension from a given path
 * @param path
 */
Path.getFileExtension = function (path) {
    return path.substring(path.lastIndexOf('.'), path.length);
};

/**
 * Checks if pathA can be contained inside pathB
 * @param pathA
 * @param pathB
 */
Path.relativeTo = function (pathA, pathB) {
    return Path.wrapDirectoryPath(pathA).indexOf(Path.wrapDirectoryPath(pathB)) === 0;
};

/**
 * Makes the full path relative to the base path
 * @param basePath
 * @param fullPath
 */
Path.makeRelative = function (basePath, fullPath) {
    return fullPath.replace(Path.wrapDirectoryPath(basePath), "");
};