/**
 * Global Keyboard handler
 * TODO: make it a singleton?
 */
class Keyboard {

    //#region Static Properties

    static get keys() {
        if (this._keys == null || !this._keys) {
            this._keys = [];
        }
        return this._keys;
    }

    static set keys(keys) {
        if (keys) {
            this._keys = keys;
        }
    }

    //#endregion

    //#region Constructors

    constructor() {
        Keyboard.keys = [];
    }

    //#endregion

    //#region Methods

    //#region Static Methods

    static removeKey(key) {
        let idx = Keyboard.keys.indexOf(key);
        if (idx >= 0) {
            Keyboard.keys.splice(idx, 1);
        }
    }

    static removeKeys(keys) {
        keys.forEach(function (key) {
            Keyboard.removeKey(key);
        });
    }

    static addKey(key) {
        if (Keyboard.keys.indexOf(key) < 0) {
            Keyboard.keys.push(key);
        }
    }

    static addKeys(keys) {
        keys.forEach(function (key) {
            Keyboard.addKey(key);
        })
    }

    static setKeys(keys) {
        Keyboard.keys = keys;
    }

    static clearKeys() {
        Keyboard.keys = [];
    }

    static getState() {
        return new KeyboardState(Keyboard.keys);
    }

    /**
     * Gets if the given key is currently being pressed
     * @param key
     * @returns {boolean}
     */
    static isKeyDown(key) {
        return Keyboard.keys.indexOf(key) >= 0;
    }

    /**
     * Gets if the given key is not currently being pressed
     * @param key
     * @returns {boolean}
     */
    static isKeyUp(key) {
        return Keyboard.keys.indexOf(key) < 0;
    }

    //#endregion

    //#endregion

}

// internal key data:
//Keyboard._keys = [];


