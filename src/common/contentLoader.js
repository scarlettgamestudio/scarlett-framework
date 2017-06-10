import GameManager from "core/gameManager";
import FileContext from "common/fileContext";

// unique key
const _contentLoaderSingleton = Symbol("contentLoaderSingleton");

/**
 * Content Loader Singleton Class
 */
class ContentLoaderSingleton {
  //#region Constructors

  constructor(contentLoaderSingletonToken) {
    if (_contentLoaderSingleton !== contentLoaderSingletonToken) {
      throw new Error("Cannot instantiate directly.");
    }

    // Cached files
    this._fileLoaded = {};
    this._fileAlias = {};

    // Cached images
    this._imgLoaded = {};
    this._imgAlias = {};

    // Cached audio
    this._audioLoaded = {};
    this._audioAlias = {};
  }

  //#endregion

  //#region Public Methods

  //#region Static Methods

  static get instance() {
    if (!this[_contentLoaderSingleton]) {
      this[_contentLoaderSingleton] = new ContentLoaderSingleton(
        _contentLoaderSingleton
      );
    }

    return this[_contentLoaderSingleton];
  }

  //#endregion

  /**
     * Clears all loaded assets from the content loader
     */
  clear() {
    this._imgLoaded = {};
    this._imgAlias = {};
    this._audioLoaded = {};
    this._audioAlias = {};
    this._fileLoaded = {};
    this._fileAlias = {};
  }

  isImageAliasCached(alias) {
    return this._imgAlias.hasOwnProperty(alias);
  }

  isFileAliasCached(alias) {
    return this._fileAlias.hasOwnProperty(alias);
  }

  isAudioAliasCached(alias) {
    return this._audioAlias.hasOwnProperty(alias);
  }

  isImageCached(path) {
    return this._imgLoaded.hasOwnProperty(path);
  }

  isFileCached(path) {
    return this._fileLoaded.hasOwnProperty(path);
  }

  isAudioCached(path) {
    return this._audioLoaded.hasOwnProperty(path);
  }

  /**
     * Returns an image loaded by the given alias (if exists)
     * @param alias
     */
  getImage(alias) {
    if (this.isImageAliasCached(alias)) {
      return this._imgLoaded[this._imgAlias[alias]];
    }
  }

  getSourcePath(alias) {
    if (this.isImageAliasCached(alias)) {
      return this._imgAlias[alias];
    }
  }

  /**
     * Returns a file loaded by the given alias (if exists)
     * @param alias
     */
  getFile(alias) {
    if (this.isFileAliasCached(alias)) {
      return this._fileLoaded[this._fileAlias[alias]];
    }
  }

  /**
     * Returns an audio loaded by the given alias (if exists)
     * @param alias
     */
  getAudio(alias) {
    if (this.isAudioAliasCached(alias)) {
      return this._audioLoaded[this._audioAlias[alias]];
    }
  }

  async loadAll(assets) {
    // prepare assets
    assets.images = assets.images || [];
    assets.files = assets.files || [];
    assets.audios = assets.audios || [];

    const imagesPromise = this.loadAllImages(assets.images);
    const filesPromise = this.loadAllFiles(assets.files);
    const audiosPromise = this.loadAllAudios(assets.audios);

    return await Promise.all([imagesPromise, filesPromise, audiosPromise]);
  }

  async loadAllImages(images) {
    images = Array.isArray(images) ? images : [];

    return await Promise.all(
      images.map(async image => {
        return await this.loadImage(image.path, image.alias);
      })
    );
  }

  async loadAllFiles(files) {
    return await Promise.all(
      files.map(async file => {
        return await this.loadFile(file.path, file.alias);
      })
    );
  }

  async loadAllAudios(audios) {
    return await Promise.all(
      audios.map(async audio => {
        return await this.loadAudio(audio.path, audio.alias);
      })
    );
  }

  async loadImage(path, alias) {
    [path, alias] = this._assertPathAliasValidity(path, alias);

    // enrich path if possible
    const newPath = this._enrichRelativePath(path);

    // no need to go further if already in cache
    if (this.isImageCached(newPath)) {
      return this._imgLoaded[newPath];
    }

    // otherwise, try to load it
    const image = await this._tryToLoadImage(newPath);

    // and cache image based on the determined path and alias
    this._cacheImage(newPath, alias, image);

    return image;
  }

  /**
   * loads an audio file from a specified path into memory
   * @param path
   * @param alias
   * @returns {*}
   */
  async loadAudio(path, alias) {
    [path, alias] = this._assertPathAliasValidity(path, alias);

    // enrich path if possible
    const newPath = this._enrichRelativePath(path);

    // no need to go further if already in cache
    if (this.isAudioCached(newPath)) {
      return this._imgLoaded[newPath];
    }

    // otherwise, try to load it
    const audio = await this._tryToLoadAudio(newPath);

    // and cache audio based on the determined path and alias
    this._cacheAudio(newPath, alias, audio);

    return audio;
  }

  /**
     * loads a file from a specified path into memory
     * @param path
     * @param alias
     * @returns {*}
     */
  async loadFile(path, alias) {
    [path, alias] = this._assertPathAliasValidity(path, alias);

    // enrich path if possible
    const newPath = this._enrichRelativePath(path);

    // no need to go further if already in cache
    if (this.isFileCached(newPath)) {
      return this._fileLoaded[newPath];
    }

    // otherwise, try to load it
    const fileContext = await this._tryToLoadFile(newPath);

    // and cache file based on the determined path and alias
    this._cacheFile(newPath, alias, fileContext);

    return fileContext;
  }

  //#endregion

  //#region Private Methods

  /**
   *
   * @param path
   * @returns {*}
   * @private
   */
  _enrichRelativePath(path) {
    // is this a relative path?
    if (
      GameManager.activeProjectPath &&
      path.indexOf(GameManager.activeProjectPath) < 0
    ) {
      path = GameManager.activeProjectPath + path;
    }

    return path;
  }

  /**
   * Asserts that the given path and alias are valid
   * returning valid versions
   * @param {string} path 
   * @param {string} alias 
   * @returns {[string,string]} valid versions of the given path and alias
   */
  _assertPathAliasValidity(path, alias) {
    const newPath = path == null ? "" : path;
    // fallback to path if invalid
    const newAlias = alias == null ? newPath : alias;

    return [newPath, newAlias];
  }

  /**
   * Caches the given image using the given path and alias as keys
   * @param {string} path 
   * @param {string} alias 
   * @param {HTMLImageElement} image 
   */
  _cacheImage(path, alias, image) {
    // cache the loaded image:
    this._imgLoaded[path] = image;
    this._imgAlias[alias] = path;
  }

  /**
   * Caches the given audio using the given path and alias as keys
   * @param {string} path 
   * @param {string} alias 
   * @param {HTMLAudioElement} audio 
   */
  _cacheAudio(path, alias, audio) {
    // cache the loaded audio:
    this._audioLoaded[path] = audio;
    this._audioAlias[alias] = path;
  }

  /**
   * Caches the given file using the given path and alias as keys
   * @param {string} path 
   * @param {string} alias 
   * @param {FileContext} file 
   */
  _cacheFile(path, alias, file) {
    // cache the loaded file:
    this._fileLoaded[path] = file;
    this._fileAlias[alias] = path;
  }

  /**
   * Attempts to load an image, returning it if successful
   * @param {string} path 
   * @returns {Promise<HTMLImageElement>}
   */
  async _tryToLoadImage(path) {
    try {
      return await this._loadImage(path);
    } catch (error) {
      // log and rethrow
      console.error(error);
      throw error;
    }
  }

  /**
   * Attempts to load an audio file, returning it if successful
   * @param {string} path 
   * @returns {Promise<HTMLAudioElement>}
   */
  async _tryToLoadAudio(path) {
    try {
      return await this._loadAudio(path);
    } catch (error) {
      // log and rethrow
      console.error(error);
      throw error;
    }
  }

  /**
   * Attempts to load a file, returning it if successful
   * @param {string} path 
   * @returns {Promise<FileContext>}
   */
  async _tryToLoadFile(path) {
    try {
      return await this._loadFile(path);
    } catch (error) {
      // log and rethrow
      console.error(error);
      throw error;
    }
  }

  /**
   * Attempts to load the image from the given path
   * @param {string} path 
   */
  _loadImage(path) {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = path;
      image.onload = () => resolve(image);
      image.onerror = () =>
        reject(new Error("Image is not defined. Unable to load it."));
    });
  }

  _loadFile(path) {
    return new Promise((resolve, reject) => {
      let rawFile = new XMLHttpRequest();
      rawFile.open("GET", path, true);
      rawFile.onreadystatechange = () => {
        if (rawFile.readyState === 4 && rawFile.status === 200) {
          const fileContext = FileContext.fromXHR(rawFile);
          resolve(fileContext);
        } else if (rawFile.readyState === 4 && rawFile.status != 200) {
          reject(new Error("Could not load file."));
        }
      };
      rawFile.send(null);
    });
  }

  _loadAudio(path) {
    return new Promise((resolve, reject) => {
      let audio = new Audio();
      audio.src = path;
      audio.oncanplaythrough = () => resolve(audio);
      audio.onerror = () =>
        reject(new Error("Audio is not defined. Unable to load it."));
    });
  }

  //#endregion
}

/**
 * Content Loader alias to Content Loader Singleton instance
 */
export const ContentLoader = ContentLoaderSingleton.instance;
