/**
 * Created by luisf on 29/04/2017.
 */

/**
 * BM Font Parser Utility Class
 * Based on load-bmfont package under MIT License:
 * see http://github.com/Jam3/load-bmfont/blob/master/LICENSE.md for details.
 */
class BMFontParser {

    /**
     *
     * @param {FileContext} fileContext
     */
    static parse(fileContext) {
        let result;
        let contentType = fileContext.headers['content-type'];

        // no need to go further if content type isn't a string
        if (!isString(contentType)) {
            // TODO: throw new error
            //return null;

        }

        let content = fileContext.content;

        if (!isString(content) || content.trim().length === 0) {
            return null;

        }


        if (/json/.test(contentType) || content.charAt(0) === '{') {
            result = JSON.parse(content);

        } else if (/xml/.test(contentType) || content.charAt(0) === '<') {
            // TODO: parse xml bm font

        }
        else {
            result = BMFontParserAscii.parseASCII(content);

        }

        return result;
    }
}