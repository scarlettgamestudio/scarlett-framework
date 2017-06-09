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

  async loadAll(assets) {
    // prepare assets
    assets.images = assets.images || [];
    assets.files = assets.files || [];

    const imagesPromise = this.loadAllImages(assets.images);
    const filesPromise = this.loadAllFiles(assets.files);

    return await Promise.all([imagesPromise, filesPromise]);
  }

  async loadAllImages(images) {
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

  /**
     * Loads several assets per category (audio, images,...) 
     * and resolves after all are loaded
     * @param assets
     */
  load(assets) {
    return new Promise(
      // eslint-disable-next-line
      function(resolve, reject) {
        // result holder
        let result = {
          success: [],
          fail: []
        };

        // counters
        let toLoad = 0; // number of expected loaded assets
        let loaded = 0; // number of loaded assets

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
        assets.images.forEach(
          function(asset) {
            if (!asset.path) {
              return;
            }

            toLoad++; // count only supposedly valid assets

            this.loadImage(asset.path, asset.alias).then(
              function() {
                assetLoaded(asset, true);
              },
              function() {
                assetLoaded(asset, false);
              }
            );
          }.bind(this)
        );

        // load all images:
        assets.audio = assets.audio || [];
        assets.audio.forEach(
          function(asset) {
            if (!asset.path) {
              return;
            }

            toLoad++; // count only supposedly valid assets

            this.loadAudio(asset.path, asset.alias).then(
              function() {
                assetLoaded(asset, true);
              },
              function() {
                assetLoaded(asset, false);
              }
            );
          }.bind(this)
        );

        // load all images:
        assets.files = assets.files || [];
        assets.files.forEach(
          function(asset) {
            if (!asset.path) {
              return;
            }

            toLoad++; // count only supposedly valid assets

            this.loadFile(asset.path, asset.alias).then(
              function() {
                assetLoaded(asset, true);
              },
              function() {
                assetLoaded(asset, false);
              }
            );
          }.bind(this)
        );
      }.bind(this)
    );
  }

  /**
     * Returns an image loaded by the given alias (if exists)
     * @param alias
     */
  getImage(alias) {
    if (this._imgAlias.hasOwnProperty(alias)) {
      return this._imgLoaded[this._imgAlias[alias]];
    }
  }

  // TODO: make it image explicit?
  getSourcePath(alias) {
    if (this._imgAlias.hasOwnProperty(alias)) {
      return this._imgAlias[alias];
    }
    return null;
  }

  _loadImage(path) {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = path;
      image.onload = () => resolve(image);
      image.onerror = () =>
        reject(new Error("Image is not defined. Unable to load it."));
    });
  }

  async loadImage(path, alias) {
    const newPath = this._enrichRelativePath(path);
    let image;
    try {
      image = await this._loadImage(newPath);
    } catch (error) {
      // log and rethrow
      console.error(error);
      throw error;
    }

    // cache the loaded image:
    this._imgLoaded[newPath] = image;

    if (alias) {
      this._imgAlias[alias] = newPath;
    }

    return image;
  }

  /**
     * Returns an audio loaded by the given alias (if exists)
     * @param alias
     */
  getAudio(alias) {
    if (this._audioAlias.hasOwnProperty(alias)) {
      return this._audioLoaded[this._audioAlias[alias]];
    }
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

  /**
     * loads an audio file from a specified path into memory
     * @param path
     * @param alias
     * @returns {*}
     */
  async loadAudio(path, alias) {
    const newPath = this._enrichRelativePath(path);
    let audio;
    try {
      audio = await this._loadAudio(newPath);
    } catch (error) {
      // log and rethrow
      console.error(error);
      throw error;
    }

    // cache the loaded audio:
    this._audioLoaded[newPath] = audio;

    if (alias) {
      this._audioAlias[alias] = newPath;
    }

    return audio;
  }

  /**
     * Returns a file loaded by the given alias (if exists)
     * @param alias
     */
  getFile(alias) {
    if (this._fileAlias.hasOwnProperty(alias)) {
      return this._fileLoaded[this._fileAlias[alias]];
    }
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

  /**
     * loads a file from a specified path into memory
     * @param path
     * @param alias
     * @returns {*}
     */
  async loadFile(path, alias) {
    const newPath = this._enrichRelativePath(path);
    let fileContext;
    try {
      fileContext = await this._loadFile(newPath);
    } catch (error) {
      // log and rethrow
      console.error(error);
      throw error;
    }

    // cache the loaded file:
    this._fileLoaded[newPath] = fileContext;

    if (alias) {
      this._fileAlias[alias] = newPath;
    }

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

  //#endregion
}

/**
 * Content Loader alias to Content Loader Singleton instance
 */
export const ContentLoader = ContentLoaderSingleton.instance;
