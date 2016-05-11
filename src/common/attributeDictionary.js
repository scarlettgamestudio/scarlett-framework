/**
 * Attribute dictionary for property definitions
 * @constructor
 */
var AttributeDictionary = function () {};
AttributeDictionary._rules = {};

/**
 *
 * @param context
 * @param propertyName
 * @param rule
 * @returns {boolean}
 */
AttributeDictionary.addRule = function (context, propertyName, rule) {
	if(isObjectAssigned(context)) {
		var contextName = getType(context);

		if(!isObjectAssigned(AttributeDictionary._rules[contextName])) {
			AttributeDictionary._rules[contextName] = {}
		}

		AttributeDictionary._rules[contextName][propertyName] = rule;

		return true;
	}

	return false;
};

/**
 * 
 * @param typeName
 * @param propertyName
 * @returns {*}
 */
AttributeDictionary.getRule = function (typeName, propertyName) {
	if (AttributeDictionary._rules[typeName]) {
		return AttributeDictionary._rules[typeName][propertyName];
	}
};