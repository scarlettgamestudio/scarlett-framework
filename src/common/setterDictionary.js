/**
 * Attribute dictionary for property definitions
 * @constructor
 */
var SetterDictionary = function () {};

SetterDictionary._rules = {};

SetterDictionary.addRule = function (context, rule) {
	if(isObjectAssigned(context)) {
		context = context.toLowerCase();
		SetterDictionary._rules[context] = rule;
		return true;
	}

	return false;
};

SetterDictionary.getRule = function (typeName) {
	if (SetterDictionary._rules[typeName]) {
		return SetterDictionary._rules[typeName];
	}
};