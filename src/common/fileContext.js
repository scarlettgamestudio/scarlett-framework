/**
 * File Context Class
 */
export default class FileContext {
  /**
     *
     * @param {*} headers
     * @param {String} content
     */
  constructor(headers, content) {
    this.headers = headers;
    this.content = content;
  }

  /**
     * Creates a file context from a XHR object
     * @param {XMLHttpRequest} xhr
     * @returns {FileContext}
     */
  static fromXHR(xhr) {
    let headers = {};

    // iterate through every header line
    xhr
      .getAllResponseHeaders()
      .split("\r\n")
      .forEach(headerLine => {
        let index = headerLine.indexOf(":");

        // if ':' character does not exist,
        // no need to go further on this iteration
        if (index === -1) {
          return;
        }

        let key = headerLine
          .slice(0, index)
          .toLowerCase()
          .trim();
        let value = headerLine.slice(index + 1).trim();

        headers[key] = value;
      });

    return new FileContext(headers, xhr.responseText);
  }
}
