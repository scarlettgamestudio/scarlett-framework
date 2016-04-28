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
 * Creates inheritance between classes by cloning the prototype
 * @param child
 * @param parent
 */
function inheritsFrom(child, parent) {
    child.prototype = Object.create(parent.prototype);
}