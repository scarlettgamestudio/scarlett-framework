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

  getSourcePath(alias) {
    if (this._imgAlias.hasOwnProperty(alias)) {
      return this._imgAlias[alias];
    }
    return null;
  }

  /**
     *
     * @param path
     * @param alias
     * @returns {Promise|Image} Image when successful
     */
  loadImage(path, alias) {
    return new Promise((resolve, reject) => {
      path = this._enrichRelativePath(path);

      // is the image on cache?
      if (this._imgLoaded.hasOwnProperty(path)) {
        // the image is already cached. let's use it!
        resolve(this._imgLoaded[path]);
      } else {
        // the image is not in cache, we must load it:
        let image = new Image();
        image.src = path;
        image.onload = () => {
          // cache the loaded image:
          this._imgLoaded[path] = image;

          if (alias) {
            this._imgAlias[alias] = path;
          }

          resolve(image);
        };
        image.onerror = () => {
          // TODO: log this
          reject(new Error("Image is not defined. Unable to load it."));
        };
      }
    });
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

  /**
     * loads an audio file from a specified path into memory
     * @param path
     * @param alias
     * @returns {*}
     */
  loadAudio(path, alias) {
    return new Promise(
      function(resolve, reject) {
        path = this._enrichRelativePath(path);

        // is the audio on cache?
        if (this._audioLoaded.hasOwnProperty(path)) {
          // the audio is already cached. let's use it!
          resolve(this._audioLoaded[path]);
        } else {
          let audio = new Audio();
          audio.src = path;
          audio.oncanplaythrough = function() {
            // cache the loaded image:
            this._audioLoaded[path] = audio;

            if (alias) {
              this._audioAlias[alias] = path;
            }

            resolve(audio);
          }.bind(this);
          audio.onerror = function() {
            // TODO: log this
            reject();
          };
        }
      }.bind(this)
    );
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

  /**
     * loads a file from a specified path into memory
     * @param path
     * @param alias
     * @returns {*}
     */
  loadFile(path, alias) {
    return new Promise(
      function(resolve, reject) {
        path = this._enrichRelativePath(path);

        // is the image on cache?
        if (this._fileLoaded.hasOwnProperty(path)) {
          // the image is already cached. let's use it!
          resolve(this._fileLoaded[path]);
        } else {
          let rawFile = new XMLHttpRequest();
          //rawFile.overrideMimeType("application/json");
          rawFile.open("GET", path, true);
          rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
              let fileContext = FileContext.fromXHR(rawFile);

              // cache the loaded image:
              this._fileLoaded[path] = fileContext;

              if (alias) {
                this._fileAlias[alias] = path;
              }

              resolve(fileContext);
            } else if (rawFile.readyState === 4 && rawFile.status != "200") {
              reject();
            }
          }.bind(this);
          rawFile.send(null);
        }
      }.bind(this)
    );
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
