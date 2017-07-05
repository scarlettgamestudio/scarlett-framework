import Logger from "common/logger";

// unique key
const _scriptsSingleton = Symbol("scriptsSingleton");

/**
 * Scripts Singleton Class
 */
class ScriptsSingleton {
  //#region Constructors

  constructor(scriptsSingletonToken) {
    if (_scriptsSingleton !== scriptsSingletonToken) {
      throw new Error("Cannot instantiate directly.");
    }

    this._store = {};
    this._logger = new Logger("ScriptEngine");
  }

  //#endregion

  //#region Public Methods

  //#region Static Methods

  static get instance() {
    if (!this[_scriptsSingleton]) {
      this[_scriptsSingleton] = new ScriptsSingleton(_scriptsSingleton);
    }

    return this[_scriptsSingleton];
  }

  //#endregion

  /**
     * Clear all the stored scripts
     */
  clear() {
    this._store = {};
  }

  /**
     * Creates and stores a script code
     * @returns {ObjectComponent}
     */
  addScript(name, script) {
    this._store[name] = script;
  }

  /**
     * Generates and assigns a component to the given game object. T
     * he component is returned in the function call
     * @param scriptName
     * @param gameObject
     */
  assign(scriptName, gameObject) {
    let component = this.generateComponent(scriptName);

    if (component === null) {
      this._logger.warn("Could not generate script component: " + scriptName);
      return;
    }

    // add the script as a component of the desired game object:
    gameObject.addComponent(component);

    return component;
  }

  /**
     * Generates a component from one stored script
     * @param scriptName
     */
  generateComponent(scriptName) {
    if (!this._store[scriptName]) {
      this._logger.warn("No script is available under the name: " + scriptName);
      return null;
    }

    return new this._store[scriptName]();
  }

  //#endregion
}

/**
 *  Scripts alias to Scripts Singleton instance
 */
export const Scripts = ScriptsSingleton.instance;
