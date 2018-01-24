/* @flow */
import { extname, basename } from "path";

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
  static get _IS_WIN(): boolean {
    return navigator.platform.toLowerCase().indexOf("win") > -1;
  }

  /**
     * The appropriate system trailing slash
     * @type {string}
     * @public
     */
  static get TRAILING_SLASH(): string {
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
  static wrapDirectoryPath(path: string): string {
    return path + (path.endsWith("/") || path.endsWith("\\") ? "" : Path.TRAILING_SLASH);
  }

  /**
     * Strips only the directory path (excludes file names)
     * @param path
     */
  static getDirectory(path: string): string {
    let index = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return path.substring(0, index >= 0 ? index : path.length);
  }

  /**
     * Returns the directory name from a given path
     * @param path
     * @returns {string}
     */
  static getDirectoryName(path: string): string {
    if (path.endsWith("/") || path.endsWith("\\")) {
      path = path.substring(0, path.length - 1);
    }

    let index = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return path.substring(index + 1, path.length);
  }

  /**
     * Attempts to retrive a filename from a given path
     * TODO: change to node basename
     * Issue with single slash path. replacing /\\/g with "\\\\" doesn't seem to help
     * @param path
     */
  static getFilename(path: string): string {
    let index = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    return path.substring(index >= 0 && index < path.length - 1 ? index + 1 : 0, path.length);
    //return Path.getBasename(path);
  }

  static getBasename(path: string, ext?: string): string {
    return basename(path, ext);
  }

  /**
     * Gets a file extension from a given path
     * Returns the extension of the path, from the last occurrence of the . (period) character 
     * to end of string in the last portion of the path. If there is no . in the last portion of the path, 
     * or if the first character of the basename of path (see getBasename()) is ., then an empty string is returned.
     * @param path
     */
  static getFileExtension(path: string): string {
    return extname(path);
  }

  /**
     * Checks if pathA can be contained inside pathB
     * @param pathA
     * @param pathB
     */
  static relativeTo(pathA: string, pathB: string): boolean {
    return Path.wrapDirectoryPath(pathA).indexOf(Path.wrapDirectoryPath(pathB)) === 0;
  }

  /**
     * Makes the full path relative to the base path
     * @param basePath
     * @param fullPath
     */
  static makeRelative(basePath: string, fullPath: string): string {
    return fullPath.replace(Path.wrapDirectoryPath(basePath), "");
  }

  //#endregion
}
