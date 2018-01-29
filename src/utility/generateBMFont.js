/* @flow */

/**
 * This is a node specific class
 * Calling generate function will return null otherwise
 */
export default class GenerateBMFont {
  static generate() {
    if (typeof window !== "undefined") {
      console.warn("This module cannot be used in the browser. Use through node instead.");
      return null;
    }

    console.warn("node use!!!");
    return true;
  }
}
