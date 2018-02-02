/* @flow */

/**
 * This is a node specific class
 * Calling generate function will return null otherwise
 */
export default class GenerateBMFont {
  static get BMFontOptions(): {} {
    return {
      outputType: "json",
      distanceRange: 4,
      smartSize: true,
      pot: true
    };
  }

  static generate(fontPath: string): ?boolean {
    if (!window || !window.process || !window.process.type) {
      console.warn("This module cannot be used in the browser. Use through node instead.");
      return null;
    }

    const generateBMFont = require("msdf-bmfont-xml");
    const fs = require("fs");

    return generateBMFont(fontPath, GenerateBMFont.BMFontOptions, (error, textures, font) => {
      if (error) throw error;

      textures.forEach(texture => {
        fs.writeFile(texture.filename + ".png", texture.texture, err => {
          if (err) throw err;
        });
      });
      fs.writeFile(font.filename, font.data, err => {
        if (err) throw err;
      });

      return true;
    });
  }
}
