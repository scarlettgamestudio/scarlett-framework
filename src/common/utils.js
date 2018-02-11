/**
 * Scarlett @ DevTeam
 * Includes global utility functions that can be called from any context
 */

/**
 * babel-plugin-lodash & lodash-webpack-plugin take care of cherry picking the used lodash modules
 * e.g., import isString from "lodash/isString"
 */
import _ from "lodash";

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
  indexOfArray
};

function indexOfArray(array, value) {
  return _.indexOf(array, value);
}

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

/**
 * Generates a unique string id
 * @type {number}
 * @private
 */
let _SS_UID = 0;
function generateUID() {
  return (++_SS_UID).toString();
}

/**
 * Capitalizes a string
 * @param string
 * @returns {*}
 */
function capitalize(string) {
  return _.upperFirst(string);
}

/**
 * Split camel case
 * TODO: change to loadash startCase?
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
  if (isFunction(a.equals)) {
    return a.equals(b);
  }

  return a === b;
}
