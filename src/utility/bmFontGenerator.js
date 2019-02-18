/* @flow */

import GameManager from "core/gameManager";
import path from "path";
import msdfGenerate from "scarlett-msdf-bmfont-xml";
import fs from "fs";
import promisify from "util.promisify";
import Utils from "utility/utils";

/**
 * This is a node specific class
 * Calling generate function will return null otherwise
 */
export default class BMFontGenerator {
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

  static async _writeTextures(textures: Array<{ filename: string, texture: Uint8Array }>, writeFileAsync: Function) {
    return await Promise.all(
      textures.map(async texture => {
        return await writeFileAsync(texture.filename + ".png", texture.texture);
      })
    );
  }

  static async _writeBMFontSpecFiles(
    textures: Array<{ filename: string, texture: Uint8Array }>,
    font: { filename: string, data: any },
    writeFileAsync: Function
  ) {
    const texturesPromise = BMFontGenerator._writeTextures(textures, writeFileAsync);
    const jsonSpecPromise = writeFileAsync(font.filename, font.data);
    return await Promise.all([texturesPromise, jsonSpecPromise]);
  }

  static async _generateAsync(
    fontPath: string,
    options: {},
    generate: Function,
    writeFileAsync: Function
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      generate(fontPath, options, async (err, textures, font) => {
        if (err) reject(err);

        try {
          await BMFontGenerator._writeBMFontSpecFiles(textures, font, writeFileAsync);
        } catch (error) {
          reject(error);
        }

        resolve(true);
      });
    });
  }

  static async tryToGenerateAsync(
    fontPath: string,
    options: {},
    generate: Function = msdfGenerate || (() => true),
    writeFileAsync: Function = promisify ? promisify(fs.writeFile) : () => true
  ): Promise<?boolean> {
    if (!Utils.isElectron()) {
      console.warn("BMFont Generator cannot be used in the browser. Use through node instead.");
      return null;
    }

    const projectPath = path.join(GameManager._activeProjectPath, fontPath);

    try {
      return await BMFontGenerator._generateAsync(projectPath, options, generate, writeFileAsync);
    } catch (error) {
      console.error(new Error("Could not create BMFont Spec and Texture files.\nDetails: " + error.message));
      return null;
    }
  }
}
