/**
 * Scarlett @ DevTeam
 * This javascript file will include global utility functions that can be called from any context
 */

export {
    isObjectAssigned,
    isString,
    isNumber,
    //isGame,
    //isGameScene,
    //isTexture2D,
    isFunction,
    //isSprite,
    inheritsFrom,
    generateUID,
    splitCamelCase,
    capitalize,
    getType,
    isEqual
};

/**
 * This function will return true if there is something assigned to the given object and false if it isn't
 * @param obj
 * @returns {boolean}
 */
function isObjectAssigned(obj: any): boolean {
    return (typeof obj !== "undefined" && obj !== null);
}

/**
 * Validates if the given object is a string
 * @param obj
 * @returns {boolean}
 */
function isString(obj: any): boolean {
    return typeof obj === "string";
}

/**
 * Validates if the given object is a number
 * @param obj
 * @returns {boolean}
 */
function isNumber(obj: any): boolean {
    return typeof obj === "number";
}

/**
 * Validates if the given object is a game object
 * @param obj
 * @returns {boolean}
 */
function isGame(obj) {
    //return obj instanceof Game;
}

/**
 * Validates if the given object is a game scene
 * @param obj
 * @returns {boolean}
 */
function isGameScene(obj) {
    //return obj instanceof GameScene;
}

/**
 * Validates if the given object is a texture2d
 * @param obj
 * @returns {boolean}
 */
function isTexture2D(obj) {
    //return obj instanceof Texture2D;
}

/**
 * Validates if the given object is a function
 * @param obj
 * @returns {boolean}
 */
function isFunction(obj: any): boolean {
    return typeof obj === "function";
}

/**
 * Validates if the given object is a sprite
 * @param obj
 * @returns {boolean}
 */
function isSprite(obj) {
    //return obj instanceof Sprite;
}

/**
 * Creates inheritance between classes by cloning the prototype
 * @param child
 * @param parent
 */
function inheritsFrom(child, parent): void {
    child.prototype = Object.create(parent.prototype);
}

/**
 * Generates a unique natural number
 * @type {number}
 * @private
 */
let _SS_UID = 0;
function generateUID(): number {
    return ++_SS_UID;
}

/**
 * Capitalizes a string
 * @param string
 * @returns {*}
 */
function capitalize(str: string): string {
    if (str.length >= 2) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    } else if (str.length == 1) {
        return str.charAt(0).toUpperCase();
    }
    return str;
}

/**
 * Split camel case
 * @param string
 * @returns {string}
 */
function splitCamelCase(str: string): string {
    return str.replace(/([a-z](?=[A-Z]))/g, '$1 ');
}

/**
 * Gets the type of the object
 * @param object
 * @returns {*}
 */
function getType(object): string {
    if (object === null){
        // special case
        return "[object Null]"; 
    } 
    else if (object.getType) {
        return object.getType();
    }

    return object.constructor.name || Object.prototype.toString.call(object);
}

/**
 * The following function compares both given objects applying the 'equal' function if it exist in the first
 * @param a
 * @param b
 */
function isEqual(a: any, b: any): boolean {
    if (isFunction(a.equals)) {
        return a.equals(b);
    }

    return a === b;
}
