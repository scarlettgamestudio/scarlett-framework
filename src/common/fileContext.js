/**
 * File Context Class
 */
class FileContext {

	/**
	 *
	 * @param headers
	 * @param content
	 */
	constructor (headers, content) {
		this.headers = headers;
		this.content = content;
	}

	/**
	 * Creates a file context from a XHR object
	 * @param xhr
	 * @returns {FileContext}
	 */
	static fromXHR(xhr) {

		let headers = {};

		// iterate through every header line
		xhr.getAllResponseHeaders().split('\r\n').forEach((headerLine) => {
            let index = headerLine.indexOf(':');
            let key = headerLine.slice(0, index).toLowerCase().trim();
			let value = headerLine.slice(index + 1).trim();

			headers[key] = value;
		});

		return new FileContext(headers, xhr.responseText);
	}
}