/**
 * Keyboard state
 * @param keys
 * @constructor
 */
function KeyboardState (keys) {
    // now we copy the values to our state array.
    this._keys = [];
    keys.forEach((function (key) {
       this._keys.push(key);
    }).bind(this));
}

/**
 * Gets if the given key is currently being pressed
 * @param key
 * @returns {boolean}
 */
KeyboardState.prototype.isKeyDown = function(key) {
    return this._keys.indexOf(key) >= 0;
};

/**
 * Gets if the given key is not currently being pressed
 * @param key
 * @returns {boolean}
 */
KeyboardState.prototype.isKeyUp = function(key) {
    return this._keys.indexOf(key) < 0;
};
