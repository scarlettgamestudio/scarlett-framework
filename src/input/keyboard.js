/**
 * Global Keyboard handler
 */

import KeyboardState from "./keyboardState";

// unique key
let _keyboardSingleton = Symbol("keyboardSingleton");

class KeyboardSingleton {
  //#region Constructors

  constructor(keyboardSingletonToken) {
    if (_keyboardSingleton !== keyboardSingletonToken) {
      throw new Error("Cannot instantiate directly.");
    }
    this._keys = [];
  }

  //#endregion

  //#region Methods

  //#region Static Methods

  static get instance() {
    if (!this[_keyboardSingleton]) {
      this[_keyboardSingleton] = new KeyboardSingleton(_keyboardSingleton);
    }

    return this[_keyboardSingleton];
  }

  //#endregion

  removeKey(key) {
    let idx = this._keys.indexOf(key);
    if (idx >= 0) {
      this._keys.splice(idx, 1);
    }
  }

  removeKeys(keys) {
    keys.forEach(
      function(key) {
        this.removeKey(key);
      }.bind(this)
    );
  }

  addKey(key) {
    if (this._keys.indexOf(key) < 0) {
      this._keys.push(key);
    }
  }

  addKeys(keys) {
    keys.forEach(
      function(key) {
        this.addKey(key);
      }.bind(this)
    );
  }

  setKeys(keys) {
    this._keys = keys;
  }

  clearKeys() {
    this._keys = [];
  }

  getState() {
    return new KeyboardState(this._keys);
  }

  /**
     * Gets if the given key is currently being pressed
     * @param key
     * @returns {boolean}
     */
  isKeyDown(key) {
    return this._keys.indexOf(key) >= 0;
  }

  /**
     * Gets if the given key is not currently being pressed
     * @param key
     * @returns {boolean}
     */
  isKeyUp(key) {
    return this._keys.indexOf(key) < 0;
  }

  //#endregion
}

export const Keyboard = KeyboardSingleton.instance;
