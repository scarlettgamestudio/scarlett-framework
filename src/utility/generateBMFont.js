/* @flow */

import fs from "fs";
import async from "async";
import GameManager from "core/gameManager";
import path from "path";

/**
 * This is a node specific class
 * Calling generate function will return null otherwise
 */
export default class GenerateBMFont {
  static get BMFontOptions(): {} {
    return {
      outputType: "json",
      distanceRange: 10,
      smartSize: true,
      pot: true,
      fontSize: 50,
      texturePadding: 8
    };
  }

  static _writeTextures(textures: Array<{ filename: string, texture: Uint8Array }>, callback: Function) {
    async.every(
      textures,
      (texture, callback) => {
        fs.writeFile(texture.filename + ".png", texture.texture, callback);
      },
      (err, result) => {
        callback(err, result);
      }
    );
  }

  static _generateAsync(fontPath: string, options: {}, generate: Function): Promise<boolean> {
    return new Promise((resolve, reject) => {
      generate(fontPath, options, (err, textures, font) => {
        if (err) reject(err);
        async.parallel(
          [async.apply(GenerateBMFont._writeTextures, textures), async.apply(fs.writeFile, font.filename, font.data)],
          err => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          }
        );
      });
    });
  }

  static async tryToGenerateAsync(fontPath: string, options: {}, generate: Function): Promise<?boolean> {
    if (!window || !window.process || !window.process.type) {
      console.warn("This module cannot be used in the browser. Use through node instead.");
      return null;
    }

    const projectPath = path.join(GameManager._activeProjectPath, fontPath);

    try {
      return await GenerateBMFont._generateAsync(projectPath, options, generate);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
