/**
 * Keyboard state Class
 */

export default class KeyboardState {
  //#region Constructors

  /**
     * @param keys
     */
  constructor(keys) {
    // now we copy the values to our state array.
    this._keys = [];
    keys.forEach(
      function(key) {
        this._keys.push(key);
      }.bind(this)
    );
  }

  //#endregion

  //#region Methods

  /**
     * Gets the keys currently being pressed
     * @returns {Array}
     */
  getKeys() {
    return this._keys;
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
