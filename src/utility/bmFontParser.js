import { isString } from "common/utils";
import BMFontParseASCII from "parse-bmfont-ascii";
import BMFontParseXML from "parse-bmfont-xml";

/**
 * BM Font Parser Utility Class
 * Based on load-bmfont package under MIT License:
 * see http://github.com/Jam3/load-bmfont/blob/master/LICENSE.md for details.
 */
export default class BMFontParser {
  /**
     *
     * @param {FileContext} fileContext
     */
  static parse(fileContext) {
    let result;
    let contentType = fileContext.headers["content-type"];

    // no need to go further if content type isn't a string
    if (!isString(contentType)) {
      // TODO: throw new error
      //return null;
    }

    let content = fileContext.content;

    if (!isString(content) || content.trim().length === 0) {
      return null;
    }

    try {
      if (/json/.test(contentType) || content.charAt(0) === "{") {
        result = JSON.parse(content);
      } else if (/xml/.test(contentType) || content.charAt(0) === "<") {
        result = BMFontParseXML(content);
      } else {
        result = BMFontParseASCII(content);
      }
    } catch (error) {
      console.error("Something went wrong while attempting to parse bmfont file.\n" + error);
      result = null;
    }

    return result;
  }
}
