/**
 * Inserts an element at a desirable position
 * @param index
 * @param item
 */
if (!Array.prototype.insert) {
	Array.prototype.insert = function (index, item) {
		this.splice(index, 0, item);
	};
}

/**
 * Ends Width Polyfill
 */

if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(searchString, position) {
		var subjectString = this.toString();
		if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
			position = subjectString.length;
		}
		position -= searchString.length;
		var lastIndex = subjectString.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};
}

/**
 * Running the following code before any other code will create Array.isArray() if it's not natively available.
 */
if (!Array.isArray) {
	Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

/**
 * Adds index of object to arrays, uses the object "equals()" function if available
 * @param search
 * @returns {number}
 */
Array.prototype.indexOfObject = function arrayObjectIndexOf(search) {
	for (var i = 0, len = this.length; i < len; i++) {
		if (isEqual(this[i], search)) return i;
	}
	return -1;
};