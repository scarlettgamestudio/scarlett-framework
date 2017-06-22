/**
 * TextUtils Class
 */
export default class TextUtils {
  //#region Static Methods

  /**
     * Measures a given character's width based on the provided font style
     * @param {string} char character to measure
     * @param {FontStyle} fontStyle font style to measure with
     * @returns {number} the character width if valid and 0 if invalid
     * @public
     */
  static measureCharacterWidth(fontStyle, char) {
    // don't go further if parameters are invalid
    if (!fontStyle || !char) {
      return 0;
    }

    let scale = fontStyle.getScale();

    // if scale is invalid (0 or null)
    if (!scale) {
      return 0;
    }

    // retrieve character ID
    let charID = fontStyle.findCharID(char);

    // don't go further if char id is invalid
    if (charID === null) {
      return 0;
    }

    // calculate character 'width'
    // xadvance is based not only on the width but also
    // on the padding, thus being used instead of width (?)
    let charWidth = fontStyle.getFontDescription().chars[charID].xadvance * scale;

    return charWidth;
  }

  /**
     * Measures the given text string width based on the provided font style
     * @param {FontStyle} fontStyle font style to measure with
     * @param {string} textStr text string to measure
     * @returns {number} the given text string width if valid and 0 if invalid
     * @public
     */
  static measureTextWidth(fontStyle, textStr) {
    // don't go further if parameters or scale are invalid
    if (!fontStyle || !textStr || !fontStyle.getScale()) {
      return 0;
    }

    // set initial width
    let width = 0;
    // set initial letter spacing (for the first character, basically)
    let currentLetterSpacing = 0;
    // just to keep track of reverting to the original
    // letter spacing value, so we only do it once
    let revertedToOriginalValue = false;

    // iterate through every character
    for (let c = 0; c < textStr.length; c++) {
      // retrieve character at position c
      let char = textStr[c];

      // if there is already one or more valid characters,
      // then we can use the actual letter spacing value
      if (!revertedToOriginalValue && width > 0) {
        // revert to original value
        currentLetterSpacing = fontStyle.getLetterSpacing();
        // make sure we only enter this condition once
        revertedToOriginalValue = true;
      }

      // store character's width temporarily
      let tempWidth = TextUtils.measureCharacterWidth(fontStyle, char);

      // if valid
      if (tempWidth > 0) {
        // add its width
        // if tempWidth was 0, adding letter spacing wouldn't make much sense.
        width += tempWidth + currentLetterSpacing;
      }
    }

    // return total width
    return width;
  }

  static wrapWordsShortVersion(fontStyle, textStr, maxLineWidth) {
    let result = [];

    if (!fontStyle || !textStr || !maxLineWidth || maxLineWidth <= 0) {
      return result;
    }

    // retrieve words
    let words = textStr.split(" ");

    // no need to go further if there is only 1 word
    if (words.length == 1) {
      return words;
    }

    let whitespace = " ";
    // get first word and remove it from the array
    let currentLine = words.shift();

    // iterate through the words
    for (let w = 0; w < words.length; w++) {
      // retrieve word
      let word = words[w];

      // simulate line width with the current word and whitespaces in between
      let tempLine = currentLine + whitespace + word;

      let tempWidth = TextUtils.measureTextWidth(fontStyle, tempLine);

      if (tempWidth > maxLineWidth) {
        result.push(currentLine);
        currentLine = word;
      } else {
        currentLine += whitespace + word;
      }
    }

    // push last line
    result.push(currentLine);

    return result;
  }

  /**
     * Wraps the words of a given text depending 
     * on a maximum width and font style
     * @param {FontStyle} fontStyle font style to measure with
     * @param {string} textStr text string to wrap
     * @param {number} maxLineWidth maximum width per line
     * @param {boolean} characterWrap whether it should character wrap or not
     * @returns {Array} wrapped text in lines
     * @public
     */
  static wrapWordsLongVersion(fontStyle, textStr, maxLineWidth, characterWrap) {
    let result = [];

    if (!fontStyle || !textStr || !maxLineWidth || maxLineWidth <= 0) {
      return result;
    }

    // retrieve words
    let words = textStr.split(" ");

    // get first word and remove it from the array
    //words.shift();
    let currentLine = "";
    // store its width
    //TextUtils.measureTextWidth(currentLine, scale);
    let currentLineWordWidth = 0;

    // " ";
    let whitespace = "";
    //TextUtils.measureCharacterWidth(whitespace, scale);
    let whitespaceWidth = 0;
    // just to keep track of reverting whitespace to its original value
    // (its real width)
    let revertedToOriginalValue = false;

    // iterate through the words
    for (let w = 0; w < words.length; w++) {
      // retrieve word
      let word = words[w];

      // just a way to not consider whitespace and its width
      // (along with a possible letter spacing value)
      // if there aren't any characters or words already in the current line.
      if (!revertedToOriginalValue && currentLineWordWidth > 0) {
        whitespace = " ";
        // letter spacing also affects the whitespace width
        // when there is at least 1 word
        whitespaceWidth = TextUtils.measureCharacterWidth(fontStyle, whitespace) + fontStyle.getLetterSpacing();
        // make sure we only enter this condition once (per line)
        revertedToOriginalValue = true;
      }

      // calculate word width according to the text scale
      // (not characters length!)
      let wordWidth = TextUtils.measureTextWidth(fontStyle, word);

      // TODO: think of a cleaner way of doing this?
      // maybe wrapTextByCharacter shouldn't return line objects?
      if (characterWrap && wordWidth > maxLineWidth) {
        let tempLine = currentLine + whitespace + word;

        let characterWrappedLines = TextUtils.wrapTextByCharacter(fontStyle, tempLine, maxLineWidth);

        // currentLine is the last line so maybe next word also fits
        currentLine = characterWrappedLines.splice(-1, 1)[0].chars.join("");
        currentLineWordWidth = TextUtils.measureTextWidth(fontStyle, currentLine);
        // reset whitespace values as currentLineWordWidth can be 0...
        // and would consider whitespace in the beginning of a new line
        // which we are trying to avoid (the reason of all this mess!)
        whitespace = "";
        whitespaceWidth = 0;
        revertedToOriginalValue = false;

        // push the others
        for (let cline = 0; cline < characterWrappedLines.length; cline++) {
          let characterLine = characterWrappedLines[cline].chars.join("");
          result.push(characterLine);
        }
        // no need to go further in this iteration
        continue;
      }

      // simulate line width with the current word,
      // a whitespace in between and also extra line spacing if any
      let tempWidth = currentLineWordWidth + wordWidth + whitespaceWidth;

      if (tempWidth > maxLineWidth) {
        result.push(currentLine);
        currentLine = word;
        currentLineWordWidth = wordWidth;
        // reset whitespace values as currentLineWordWidth can be 0...
        // and would consider whitespace in the beginning of a new line,
        // which we are trying to avoid (the reason of all this mess!)
        whitespace = "";
        whitespaceWidth = 0;
        revertedToOriginalValue = false;
      } else {
        currentLine += whitespace + word;
        currentLineWordWidth += whitespaceWidth + wordWidth;
      }
    }

    // push last line
    result.push(currentLine);

    return result;
  }

  /**
     * Wraps the characters of a given text 
     * depending on a maximum width and text scale
     * @param {FontStyle} fontStyle font style to measure with
     * @param {string} textStr text string to wrap
     * @param {number} maxLineWidth maximum width per line
     * @returns {Array} wrapped text in lines
     * @public
     */
  static wrapTextByCharacter(fontStyle, textStr, maxLineWidth) {
    // create empty array
    let lines = [];

    // TODO: trim?
    // if parameters are invalid, no need to go further
    if (!fontStyle || !textStr || !maxLineWidth || maxLineWidth <= 0) {
      return lines;
    }

    // create first line, since it's sure to have some text
    lines.push({
      chars: [],
      width: 0
    });

    // set initial value for letter spacing
    // (for the first character iteration, basically...)
    let currentLetterSpacing = 0;
    // just to keep track of reverting to letter spacing original value
    let revertedToOriginalValue = false;

    // iterate through text characters
    for (let c = 0; c < textStr.length; c++) {
      // retrieve text character
      let char = textStr[c];

      // store current line index
      let currentLine = lines.length - 1;

      // after the first (valid) character of current line,
      // get the actual value of letter spacing
      if (!revertedToOriginalValue && lines[currentLine].width > 0) {
        // revert to original value
        currentLetterSpacing = fontStyle.getLetterSpacing();
        // make sure we only enter this condition once
        // (per line, thus the resets down below)
        revertedToOriginalValue = true;
      }

      // retrieve character width
      let charWidth = TextUtils.measureCharacterWidth(fontStyle, char);

      // current width + char width + letter spacing
      // if there is at least 1 character
      let tempWidth = lines[currentLine].width + charWidth + currentLetterSpacing;

      // if current line width + the current character width
      // is > than the max width
      if (tempWidth > maxLineWidth) {
        // create a new and empty line
        lines.push({
          chars: [],
          width: 0
        });

        // update current line index
        currentLine++;
        // reset letter spacing!
        currentLetterSpacing = 0;
        // and the variable that keeps track of
        // reverting to actual letter spacing value
        revertedToOriginalValue = false;

        // skip if the character is a whitespace
        if (char === " ") {
          continue;
        }
      }

      // add character and its width to current line
      // (plus letter spacing if there is at least 1 character)
      lines[currentLine].width += charWidth + currentLetterSpacing;
      lines[currentLine].chars.push(char);
    }

    return lines;
  }

  /**
     * Converts a given text into a Line Object, 
     * with an array of characters and the line total width
     * @param {FontStyle} fontStyle font style to measure with
     * @param {string} textStr text string to convert into a line object
     * @returns {{chars: Array, width: number}}
     * @public
     */
  static convertTextStringToLineFormat(fontStyle, textStr) {
    // define empty line
    let line = {
      chars: Array(),
      width: 0
    };

    // return empty if any of the values or scale is invalid
    if (!fontStyle || !textStr || !fontStyle.getScale()) {
      return line;
    }

    // set line characters and width
    line.chars = textStr.split("");
    line.width = TextUtils.measureTextWidth(fontStyle, textStr);

    return line;
  }

  /**
     * Creates the definitive lines to draw onto the screen
     * @param {FontStyle} fontStyle font style to measure with
     * @param {string} textStr text string to draw
     * @param {number} maxLineWidth maximum line width
     * @param {boolean} wordWrap whether it should word wrap or not
     * @param {boolean} characterWrap whether it should character wrap or not
     * @returns {Array} text split into lines
     * @public
     */
  static measureText(fontStyle, textStr, maxLineWidth, wordWrap, characterWrap) {
    // create empty array
    let resultLines = [];

    // if parameters or scale are invalid, there is no need to go further
    if (!fontStyle || !textStr || !maxLineWidth || !fontStyle.getScale()) {
      return resultLines;
    }

    // create first line, since it's sure to have some text
    resultLines.push({
      chars: [],
      width: 0
    });

    // store original text
    let useText = textStr;

    // create array for user defined lines
    let userDefinedLines = [];

    // word wrap by inserting \n in the original text
    if (wordWrap) {
      // initialize resulting text
      let wrappedText = "";
      // split text into lines defined by the user
      userDefinedLines = useText.split(/(?:\r\n|\r|\n)/);

      // iterate through lines
      for (let l = 0; l < userDefinedLines.length; l++) {
        // wrap line
        let wrappedLine = TextUtils.wrapWordsLongVersion(
          fontStyle,
          userDefinedLines[l],
          maxLineWidth,
          characterWrap
        ).join("\n");
        // always insert a break at the end
        // since the split gets rid of the user defined breaks...
        wrappedLine += "\n";
        // concatenate to resulting wrapping text
        wrappedText += wrappedLine;
      }

      // assign useText to resulting wrapping text
      useText = wrappedText;
    }

    // split text into lines defined by the users (and also word wrapped now ;))
    userDefinedLines = useText.split(/(?:\r\n|\r|\n)/);

    // iterate through user defined lines (with special characters)
    for (let l = 0; l < userDefinedLines.length; l++) {
      let userDefinedLine = userDefinedLines[l];

      let preparedLines = [];

      // only perform character wrap
      // if word wrap isn't enabled in the first place
      if (!wordWrap && characterWrap) {
        preparedLines = TextUtils.wrapTextByCharacter(fontStyle, userDefinedLine, maxLineWidth);
      } else {
        preparedLines.push(TextUtils.convertTextStringToLineFormat(fontStyle, userDefinedLine));
      }

      // extended result array (does not create a new array such as concat)
      Array.prototype.push.apply(resultLines, preparedLines);
    }

    return resultLines;
  }

  //#endregion
}
