/**
 * Scarlett @ DevTeam
 * This javascript file will include global utility functions that can be called from any context
 */

/**
 * This function will return true if there is something assigned to the given object and false if it isn't
 * @param obj
 * @returns {boolean}
 */
function isObjectAssigned(obj) {
    return (typeof obj !== "undefined" && obj !== null);
}

/**
 * Validates if the given object is a string
 * @param obj
 * @returns {boolean}
 */
function isString(obj) {
    return typeof obj === "string";
}

/**
 * Validates if the given object is a number
 * @param obj
 * @returns {boolean}
 */
function isNumber(obj) {
    return typeof obj === "number";
}

/**
 * Validates if the given object is a game object
 * @param obj
 * @returns {boolean}
 */
function isGame(obj) {
    return obj instanceof Game;
}

/**
 * Validates if the given object is a game scene
 * @param obj
 * @returns {boolean}
 */
function isGameScene(obj) {
    return obj instanceof GameScene;
}

/**
 * Validates if the given object is a texture2d
 * @param obj
 * @returns {boolean}
 */
function isTexture2D(obj) {
    return obj instanceof Texture2D;
}

/**
 * Validates if the given object is a function
 * @param obj
 * @returns {boolean}
 */
function isFunction(obj) {
    return typeof obj === "function";
}

/**
 * Validates if the given object is a sprite
 * @param obj
 * @returns {boolean}
 */
function isSprite(obj) {
    return obj instanceof Sprite;
}

/**
 * Creates inheritance between classes by cloning the prototype
 * @param child
 * @param parent
 */
function inheritsFrom(child, parent) {
    child.prototype = Object.create(parent.prototype);
}

/**
 * Generates a unique natural number
 * @type {number}
 * @private
 */
var _SS_UID = 0;
function generateUID() {
    return ++_SS_UID;
}

/**
 * Capitalizes a string
 * @param string
 * @returns {*}
 */
function capitalize(string) {
    if (string.length >= 2) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else if (string.length == 1) {
        return string.charAt(0).toUpperCase();
    }
    return string;
}

/**
 * Split camel case
 * @param string
 * @returns {string}
 */
function splitCamelCase(string) {
    return string.replace(/([a-z](?=[A-Z]))/g, '$1 ');
}

/**
 * Gets the type of the object
 * @param object
 * @returns {*}
 */
function getType(object) {
    if (object === null) return "[object Null]"; // special case
    if (object.getType) return object.getType();
    return object.constructor.name || Object.prototype.toString.call(object);
}

/**
 * The following function compares both given objects applying the 'equal' function if it exist in the first
 * @param a
 * @param b
 */
function isEqual(a, b) {
    if (isFunction(a.equals)) {
        return a.equals(b);
    }

    return a === b;
}
