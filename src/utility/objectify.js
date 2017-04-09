/**
 * Objectify utility class
 */
class Objectify {

    //#region Static Properties

    //#endregion

    //#region Constructors

    constructor() {

    }

    //#endregion

    //#region Static Methods

    /**
     * Objectify an array:
     * @param array
     */
    static array(array) {
        let result = [];
        array.forEach(function (elem) {
            // this element has objectify implemented?
            if (isFunction(elem.objectify)) {
                try {
                    let obj = Objectify.create(elem);
                    if (obj) {
                        result.push(obj);
                    }

                } catch (ex) {
                    Objectify._logger.error("Failed to objectify element: " + ex);
                }
            }
        });

        return result;
    }

    /**
     * Restores to the original state an array of objectified data
     * @param array
     */
    static restoreArray(array) {
        let result = [];
        array.forEach(function (elem) {
            if (elem._otype) {
                result.push(Objectify.restore(elem, elem._otype));
            }
        });

        return result;
    }

    /**
     * Creates a valid JSON "stringify" data object
     * @param object
     * @param beautify
     */
    static createDataString(object, beautify) {
        if (beautify) {
            return JSON.stringify(Objectify.create(object), null, 4);
        }

        return JSON.stringify(Objectify.create(object));
    }

    /**
     * Checks if a given object contains the objectify method
     * @param object
     */
    static hasObjectify(object) {
        return isObjectAssigned(object) && isFunction(object.objectify);
    }

    /**
     * Creates an objectify valid data object
     * @param object
     */
    static create(object) {
        let type = getType(object);
        let result;

        // this object has objectify?
        if (Objectify.hasObjectify(object)) {
            result = object.objectify();

        } else {
            // nope, we can force to get the public properties then:
            result = JSON.parse(JSON.stringify(object));
        }

        result._otype = type;

        return result;
    }

    /**
     * Restores an object of a given type
     * @param data (the data to restore)
     * @param typeName (the name of the type to restore - optional if _otype is defined in data)
     */
    static restore(data, typeName) {
        try {
            let type = isObjectAssigned(typeName) ? typeName : data._otype;
            type = eval(type);
            if (type && type.restore) {
                return type.restore(data);
            }
        } catch (ex) {
            Objectify._logger.error("Failed to restore element: " + ex);
        }
    }

    /**
     * Restores an object from a string
     * @param jsonString
     * @param typeName
     */
    static restoreFromString(jsonString, typeName) {
        return Objectify.restore(JSON.parse(jsonString), typeName);
    }

    /**
     * Extends the properties of the objA with the properties of objB
     * @param objA
     * @param objB
     * @returns {*}
     */
    static extend(objA, objB) {
        Object.keys(objB).forEach(function (prop) {
            objA[prop] = objB[prop];
        });

        return objA
    }

    //#endregion

}

//  TODO: place in constructor and add a static get for it? test in editor...
Objectify._logger = new Logger("Objectify");