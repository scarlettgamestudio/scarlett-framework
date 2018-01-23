/* @flow */

/**
 * IO Path utility class
 */
export default class Path {
  //#region Static Properties

  /**
     *
     * @type {boolean}
     * @private
     */
  static get _IS_WIN() {
    return navigator.platform.toLowerCase().indexOf("win") > -1;
  }

  /**
     * The appropriate system trailing slash
     * @type {string}
     * @public
     */
  static get TRAILING_SLASH() {
    return Path._IS_WIN ? "\\" : "/";
  }

  //#endregion

  //#region Constructors

  constructor() {}

  //#endregion

  //#region Static Methods

  /**
     * Ensures this is a valid string directory (eg. ends with slash)
     * @param path
     * @returns {string}
     */
  static wrapDirectoryPath(path) {
    return path + (path.endsWith("/") || path.endsWith("\\") ? "" : Path.TRAILING_SLASH);
  }

  /**
     * Strips only the directory path (excludes file names)
     * @param path
     */
  static getDirectory(path) {
    let index = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return path.substring(0, index >= 0 ? index : path.length);
  }

  /**
     * Returns the directory name from a given path
     * @param path
     * @returns {string}
     */
  static getDirectoryName(path) {
    if (path.endsWith("/") || path.endsWith("\\")) {
      path = path.substring(0, path.length - 1);
    }

    let index = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return path.substring(index + 1, path.length);
  }

  /**
     * Attempts to retrive a filename from a given path
     * If the file path is incorrect (e.g., ends in '/'), the given path will be returned
     * @param path
     */
  static getFilename(path: string) {
    let index = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return path.substring(index >= 0 && index < path.length - 1 ? index + 1 : 0, path.length);
  }

  /**
     * Gets a file extension from a given path
     * @param path
     */
  static getFileExtension(path) {
    return path.substring(path.lastIndexOf("."), path.length);
  }

  /**
     * Checks if pathA can be contained inside pathB
     * @param pathA
     * @param pathB
     */
  static relativeTo(pathA, pathB) {
    return Path.wrapDirectoryPath(pathA).indexOf(Path.wrapDirectoryPath(pathB)) === 0;
  }

  /**
     * Makes the full path relative to the base path
     * @param basePath
     * @param fullPath
     */
  static makeRelative(basePath, fullPath) {
    return fullPath.replace(Path.wrapDirectoryPath(basePath), "");
  }

  //#endregion
}
