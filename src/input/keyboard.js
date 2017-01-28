/**
 * Global Keyboard handler
 * @constructor
 */
function Keyboard() {
    // stuff..
}

// internal key data:
Keyboard._keys = [];

Keyboard.removeKey = function (key) {
    var idx = Keyboard._keys.indexOf(key);
    if (idx >= 0) {
        Keyboard._keys.splice(idx, 1);
    }
};

Keyboard.removeKeys = function (keys) {
    keys.forEach(function (key) {
        Keyboard.removeKey(key);
    });
};

Keyboard.addKey = function (key) {
    if (Keyboard._keys.indexOf(key) < 0) {
        Keyboard._keys.push(key);
    }
};

Keyboard.addKeys = function (keys) {
    keys.forEach(function (key) {
        Keyboard.addKey(key);
    })
};

Keyboard.setKeys = function (keys) {
    Keyboard._keys = keys;
};

Keyboard.clearKeys = function () {
    Keyboard._keys = [];
};

Keyboard.getState = function () {
    return new KeyboardState(Keyboard._keys);
};

/**
 * Gets if the given key is currently being pressed
 * @param key
 * @returns {boolean}
 */
Keyboard.isKeyDown = function (key) {
    return Keyboard._keys.indexOf(key) >= 0;
};

/**
 * Gets if the given key is not currently being pressed
 * @param key
 * @returns {boolean}
 */
Keyboard.isKeyUp = function (key) {
    return Keyboard._keys.indexOf(key) < 0;
};


