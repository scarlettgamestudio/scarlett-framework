// unique key
import { isObjectAssigned } from "common/utils";

/**
 * SetterDictionary Singleton Class
 * Attribute dictionary for property definitions
 */
class SetterDictionarySingleton {

    //#region Fields

    private _rules: Object;

    //#endregion

    //#region Static Fields

    private static _instance: SetterDictionarySingleton;

    //#endregion

    //#region Constructors

    private constructor () {
        this._rules = {};
    }

    //#endregion

    //#region Methods

    //#region Static Methods

    static get instance(): SetterDictionarySingleton {
        return this._instance || (this._instance = new SetterDictionarySingleton());
    }

    //#endregion

    /**
     *
     * @param context
     * @param rule
     * @returns {boolean}
     */
    addRule(context: string, rule: Object): boolean {
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
    getRule(typeName: string): {Object} {
        typeName = typeName.toLowerCase();
        if (this._rules[typeName]) {
            return this._rules[typeName];
        }
    };

    //#endregion
}

/**
 * Setter Dictionary alias to Setter Dictionary Singleton instance
 * Attribute dictionary for property definitions
 */
export const SetterDictionary = SetterDictionarySingleton.instance;
