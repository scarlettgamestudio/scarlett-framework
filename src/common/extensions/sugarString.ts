
export default class SugarString extends String {

	/**
 	* Ends With Polyfill
 	*/
	endsWith (searchString, position){
		
		let subjectString: string = this.toString();
		if (position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
			position = subjectString.length;
		}
		position -= searchString.length;
		let lastIndex = subjectString.indexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	}
}