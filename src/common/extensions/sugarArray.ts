import { isEqual } from "common/utils";

export default class SugarArray<T> extends Array<T> {
	
	constructor (...items: T[]){
		super(...items);
		// Set the prototype explicitly.
        Object.setPrototypeOf(this, SugarArray.prototype);
	}

	// TODO:
	/*
	static isArray(arg): boolean {
		return Object.prototype.toString.call(arg) === '[object Array]';
	}*/

	/**
	 * Inserts an element at a desirable position
	 * @param index
	 * @param item
	 */
	insert (index: number, item: any): void{
		this.splice(index, 0, item);
	}

	/**
	 * Adds index of object to arrays, uses the object "equals()" function if available
	 * @param search
	 * @returns {number}
	 */
	indexOfObject (search: any): number{
		for (let i = 0, len = this.length; i < len; i++) {
			if (isEqual(this[i], search)) {
				return i;
			}
		}
		return -1;
	}
}
