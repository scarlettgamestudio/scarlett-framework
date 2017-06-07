/**
 * Scarlett @ DevTeam
 * Includes global utility functions that can be called from any context
 */

import _ from "lodash";

/*
import { Game } from "core/game";
import { GameScene } from "core/gameScene";
import { Sprite } from "core/sprite";
import { Texture2D } from "core/texture2D";*/

export {
  isObjectAssigned,
  isString,
  isNumber,
  isFunction,
  inheritsFrom,
  generateUID,
  splitCamelCase,
  capitalize,
  getType,
  isEqual,
  isGame,
  isGameScene,
  isTexture2D,
  isSprite
};

/**
 * Returns true if there is something assigned to the given object
 * @param obj
 * @returns {boolean}
 */
function isObjectAssigned(obj) {
  return typeof obj !== "undefined" && obj !== null;
}

/**
 * Validates if the given object is a string
 * @param obj
 * @returns {boolean}
 */
function isString(obj) {
  return _.isString(obj);
}

/**
 * Validates if the given object is a number
 * @param obj
 * @returns {boolean}
 */
function isNumber(obj) {
  return _.isNumber(obj);
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
  return _.isFunction(obj);
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
let _SS_UID = 0;
function generateUID() {
  return ++_SS_UID;
}

/**
 * Capitalizes a string
 * @param string
 * @returns {*}
 */
function capitalize(string) {
  return _.capitalize(string);
}

/**
 * Split camel case
 * TODO: change to lodash startCase?
 * @param string
 * @returns {string}
 */
function splitCamelCase(string) {
  return _.startCase(string);
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
 * Compares by applying the 'equal' function if it exists in the first object
 * @param a
 * @param b
 */
function isEqual(a, b) {
  return _.isEqual(a, b);
}
