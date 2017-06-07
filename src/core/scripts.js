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
  addScript(name) {
    let script = function instance() {};
    this._store[name] = script;
    this._setupScript(script);
    return script;
  }

  /**
     * Generates and assigns a component to the given game object. T
     * he component is returned in the function call
     * @param scriptName
     * @param gameObject
     */
  assign(scriptName, gameObject) {
    let component = this.generateComponent(scriptName);
    gameObject.addComponent(component);
    return component;
  }

  /**
     * Generates a component from one stored script
     * @param scriptName
     */
  generateComponent(scriptName) {
    if (!this._store[scriptName]) {
      return null;
    }

    let component = Object.create(this._store[scriptName].prototype);
    component._name = scriptName;

    // now we need to assign all the instance properties defined:
    let properties = this._store[scriptName].properties.getAll();
    let propertyNames = Object.keys(properties);

    if (propertyNames && propertyNames.length > 0) {
      propertyNames.forEach(function(propName) {
        // assign the default value if exists:
        component[propName] = properties[propName].default;
      });
    }

    return component;
  }

  //#endregion

  //#region Private Methods

  /**
     * Setup a script adding event handlers and such
     * @private
     */
  _setupScript(script) {
    script.properties = {
      _store: {},
      _target: script,
      add: function(name, attr) {
        // save on the target's properties store the attributes:
        this._store[name] = attr;
      },
      get: function(name) {
        return this._store[name];
      },
      getAll: function() {
        return this._store;
      }
    };
  }

  //#endregion
}

/**
 *  Scripts alias to Scripts Singleton instance
 */
export const Scripts = ScriptsSingleton.instance;
