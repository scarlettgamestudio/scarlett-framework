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
		return new FileContext(xhr.headers, xhr.responseText);
	}
}