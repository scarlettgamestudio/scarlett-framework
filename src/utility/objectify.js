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
            result.push(Objectify.restore(elem._otype, elem));
        }
    });

    return result;
};

/**
 * Creates an objectify valid data object
 * @param object
 */
Objectify.create = function (object) {
    var type = getType(object);
    var result;

    // this object has objectify?
    if (object.objectify) {
        result = object.objectify();

    } else {
        // nope, we can try to get the public properties then:
        result = JSON.parse(JSON.stringify(object));
    }

    result._otype = type;

    return result;
};

/**
 * Restores an object of a given type
 * @param typeName (the name of the type to restore)
 * @param data (the data to restore)
 */
Objectify.restore = function (typeName, data) {
    try {
        var type = eval(typeName);
        if (type && type.restore) {
            return type.restore(data);
        }
    } catch (ex) {
        Objectify._logger.error("Failed to restore element: " + ex);
    }
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