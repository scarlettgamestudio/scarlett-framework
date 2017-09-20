import { isString } from "common/utils";
import BMFontParseASCII from "parse-bmfont-ascii";
import BMFontParseXML from "parse-bmfont-xml";
import Utils from "utility/utils";

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
    if (!Utils.isFileContext(fileContext)) {
      console.error("Expected FileContext argument");
      return null;
    }

    let result;
    let contentType = fileContext.headers["content-type"];

    // if content type isn't valid,
    if (!isString(contentType)) {
      // make it an empty string and try to parse without it (fallback to ASCII)
      contentType = "";
    }

    let content = fileContext.content;

    if (!isString(content) || content.trim().length === 0) {
      console.error("Invalid file context content");
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
