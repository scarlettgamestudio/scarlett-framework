/**
 * Attribute dictionary for property definitions
 * @constructor
 */
var AttributeDictionary = function () {
};
AttributeDictionary._rules = {};
AttributeDictionary._inheritance = {};

/**
 *
 * @param context
 * @param propertyName
 * @param rule
 * @returns {boolean}
 */
AttributeDictionary.addRule = function (context, propertyName, rule) {
    if (isObjectAssigned(context)) {
        context = context.toLowerCase();

        if (!isObjectAssigned(AttributeDictionary._rules[context])) {
            AttributeDictionary._rules[context] = {}
        }

        AttributeDictionary._rules[context][propertyName] = rule;

        return true;
    }

    return false;
};

/**
 *
 * @param context
 * @param propertyName
 * @returns {*}
 */
AttributeDictionary.getRule = function (context, propertyName) {
    context = context.toLowerCase();

    // first check the first order rules:
    if (AttributeDictionary._rules[context] && AttributeDictionary._rules[context][propertyName]) {
        return AttributeDictionary._rules[context][propertyName];
    }

    // maybe the parents have this rule?
    if (AttributeDictionary._inheritance[context]) {
        // recursively try to get the rule from the parents:
        for (var i = 0; i < AttributeDictionary._inheritance[context].length; ++i) {
            var result = AttributeDictionary.getRule(AttributeDictionary._inheritance[context][i], propertyName);
            if (result != null) {
                return result;
            }
        }
    }

    return null;
};

/**
 *
 * @param typeName
 * @param parent
 */
AttributeDictionary.inherit = function (context, parent) {
    context = context.toLowerCase();
    parent = parent.toLowerCase();

    if (!isObjectAssigned(AttributeDictionary._inheritance[context])) {
        AttributeDictionary._inheritance[context] = [];
    }

    AttributeDictionary._inheritance[context].push(parent);
};