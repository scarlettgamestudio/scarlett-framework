import { isObjectAssigned } from './utils';

// unique key
const _setterDictionarySingleton = Symbol('setterDictionarySingleton');

/**
 * SetterDictionary Singleton Class
 * Attribute dictionary for property definitions
 */
class SetterDictionarySingleton {
  //#region Constructors

  constructor (setterDictionarySingletonToken) {
    if (_setterDictionarySingleton !== setterDictionarySingletonToken) {
      throw new Error('Cannot instantiate directly.');
    }
    this._rules = {};
  }

  //#endregion

  //#region Methods

  //#region Static Methods

  static get instance () {
    if (!this[_setterDictionarySingleton]) {
      this[_setterDictionarySingleton] = new SetterDictionarySingleton(
        _setterDictionarySingleton
      );
    }

    return this[_setterDictionarySingleton];
  }

  //#endregion

  /**
     *
     * @param context
     * @param rule
     * @returns {boolean}
     */
  addRule (context, rule) {
    if (isObjectAssigned(context)) {
      context = context.toLowerCase();
      this._rules[context] = rule;
      return true;
    }

    return false;
  }

  /**
     *
     * @param typeName
     * @returns {*}
     */
  getRule (typeName) {
    typeName = typeName.toLowerCase();
    if (this._rules[typeName]) {
      return this._rules[typeName];
    }
  }

  //#endregion
}

/**
 * Setter Dictionary alias to Setter Dictionary Singleton instance
 * Attribute dictionary for property definitions
 */
export const SetterDictionary = SetterDictionarySingleton.instance;
