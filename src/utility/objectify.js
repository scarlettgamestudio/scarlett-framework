/**
 * Objectify utility class
 */
var Objectify = function () {
};
Objectify._logger = new Logger("Objectify");

/**
 * Objectify an array:
 * @param array
 */
Objectify.array = function (array) {
    var result = [];
    array.forEach(function (elem) {
        // this element has objectify implemented?
        if (isFunction(elem.objectify)) {
            try {
                var obj = Objectify.create(elem);
                if (obj) {
                    result.push(obj);
                }

            } catch (ex) {
                Objectify._logger.error("Failed to objectify element: " + ex);
            }
        }
    });

    return result;
};

/**
 * Restores to the original state an array of objectified data
 * @param array
 */
Objectify.restoreArray = function (array) {
    var result = [];
    array.forEach(function (elem) {
        if (elem._otype) {
            result.push(Objectify.restore(elem, elem._otype));
        }
    });

    return result;
};

/**
 * Creates a valid JSON "stringify" data object
 * @param object
 */
Objectify.createDataString = function (object, beautify) {
    if (beautify) {
        return JSON.stringify(Objectify.create(object), null, 4);
    }

    return JSON.stringify(Objectify.create(object));
};

/**
 * Checks if a given object contains the objectify method
 * @param object
 */
Objectify.hasObjectify = function (object) {
    return isObjectAssigned(object) && isFunction(object.objectify);
};

/**
 * Creates an objectify valid data object
 * @param object
 */
Objectify.create = function (object) {
    var type = getType(object);
    var result;

    // this object has objectify?
    if (Objectify.hasObjectify(object)) {
        result = object.objectify();

    } else {
        // nope, we can force to get the public properties then:
        result = JSON.parse(JSON.stringify(object));
    }

    result._otype = type;

    return result;
};

/**
 * Restores an object of a given type
 * @param data (the data to restore)
 * @param typeName (the name of the type to restore - optional if _otype is defined in data)
 */
Objectify.restore = function (data, typeName) {
    try {
        var type = isObjectAssigned(typeName) ? typeName : data._otype;
        type = eval(type);
        if (type && type.restore) {
            return type.restore(data);
        }
    } catch (ex) {
        Objectify._logger.error("Failed to restore element: " + ex);
    }
};

/**
 * Restores an object from a string
 * @param jsonString
 * @param typeName
 */
Objectify.restoreFromString = function (jsonString, typeName) {
    return Objectify.restore(JSON.parse(jsonString), typeName);
};

/**
 * Extends the properties of the objA with the properties of objB
 * @param objA
 * @param objB
 * @returns {*}
 */
Objectify.extend = function (objA, objB) {
    Object.keys(objB).forEach(function (prop) {
        objA[prop] = objB[prop];
    });

    return objA
};