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