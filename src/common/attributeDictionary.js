import { isObjectAssigned } from "./utils";

// unique key
const _attributeDictionarySingleton = Symbol('attributeDictionarySingleton');

/**
 * Attribute Dictionary Singleton Class
 * Attribute dictionary for property definitions
 */
class AttributeDictionarySingleton {

    //#region Constructors

    constructor(attributeDictionarySingletonToken) {
        if (_attributeDictionarySingleton !== attributeDictionarySingletonToken) {
            throw new Error('Cannot instantiate directly.');
        }

        this._rules = {};
        this._inheritance = {};
    }

    //#endregion

    //#region Methods

    //#region Static Methods

    static get instance() {
        if (!this[_attributeDictionarySingleton]) {
            this[_attributeDictionarySingleton] = new AttributeDictionarySingleton(_attributeDictionarySingleton);
        }

        return this[_attributeDictionarySingleton];
    }

    //#endregion

    /**
     *
     * @param context
     * @param propertyName
     * @param rule
     * @returns {boolean}
     */
    addRule(context, propertyName, rule) {
        if (isObjectAssigned(context)) {
            context = context.toLowerCase();

            if (!isObjectAssigned(this._rules[context])) {
                this._rules[context] = {}
            }

            this._rules[context][propertyName] = rule;

            return true;
        }

        return false;
    }

    /**
     *
     * @param context
     * @param propertyName
     * @returns {*}
     */
    getRule(context, propertyName) {
        context = context.toLowerCase();

        // first check the first order rules:
        if (this._rules[context] && this._rules[context][propertyName]) {
            return this._rules[context][propertyName];
        }

        // maybe the parents have this rule?
        if (this._inheritance[context]) {
            // recursively try to get the rule from the parents:
            for (let i = 0; i < this._inheritance[context].length; ++i) {
                let result = this.getRule(this._inheritance[context][i], propertyName);
                if (result != null) {
                    return result;
                }
            }
        }

        return null;
    }

    /**
     *
     * @param typeName
     * @param parent
     */
    inherit(context, parent) {
        context = context.toLowerCase();
        parent = parent.toLowerCase();

        if (!isObjectAssigned(this._inheritance[context])) {
            this._inheritance[context] = [];
        }

        this._inheritance[context].push(parent);
    }

    //#endregion

}

/**
 * Attribute Dictionary alias to Attribute Dictionary Singleton instance
 * Attribute dictionary for property definitions
 */
export const AttributeDictionary = AttributeDictionarySingleton.instance;