/**
 * Attribute dictionary for property definitions
 * @constructor
 */
var AttributeDictionary = function () {};

AttributeDictionary._rules = {};

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

AttributeDictionary.getRule = function (typeName, propertyName) {
	if (AttributeDictionary._rules[typeName]) {
		return AttributeDictionary._rules[typeName][propertyName];
	}
};