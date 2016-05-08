/**
 * Inserts an element at a desirable position
 * @param index
 * @param item
 */
Array.prototype.insert = function (index, item) {
	this.splice(index, 0, item);
};