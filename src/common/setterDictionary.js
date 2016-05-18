/**
 * Attribute dictionary for property definitions
 * @constructor
 */
var SetterDictionary  = function () {};
SetterDictionary._rules = {};

/**
 *
 * @param context
 * @param rule
 * @returns {boolean}
 */
SetterDictionary.addRule = function (context, rule) {
	if(isObjectAssigned(context)) {
		context = context.toLowerCase();
		SetterDictionary._rules[context] = rule;
		return true;
	}

	return false;
};

/**
 *
 * @param typeName
 * @returns {*}
 */
SetterDictionary.getRule = function (typeName) {
	typeName = typeName.toLowerCase();
	if (SetterDictionary._rules[typeName]) {
		return SetterDictionary._rules[typeName];
	}
};