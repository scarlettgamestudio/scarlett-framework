// unique key
import { isObjectAssigned } from "common/utils";

/**
 * Attribute Dictionary Singleton Class
 * Attribute dictionary for property definitions
 */
class AttributeDictionarySingleton {

    //#region Fields

    private _rules: Object;
    private _inheritance: Object;

    //#endregion

    //#region Static Fields

    private static _instance: AttributeDictionarySingleton;

    //#endregion

    //#region Constructors

    private constructor() {
        this._rules = {};
        this._inheritance = {};
    }

    //#endregion

    //#region Methods

    //#region Static Methods

    static get instance(): AttributeDictionarySingleton {
        return this._instance || (this._instance = new AttributeDictionarySingleton());
    }

    //#endregion

    /**
     *
     * @param context
     * @param propertyName
     * @param rule
     * @returns {boolean}
     */
    addRule(context: string, propertyName: string, rule: Object): boolean {
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
    getRule(context: string, propertyName: string): any {
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
    inherit(context: string, parent: string): void {
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