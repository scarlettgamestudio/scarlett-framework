/* @flow */

import { ContentLoader } from "common/contentLoader";
import Path from "utility/path";
import { FontSupportedTypes } from "utility/fontSupportedTypes";
import FontStyle from "core/fontStyle";
import BMFontParser from "utility/bmFontParser";
import BMFontGenerator from "utility/bmFontGenerator";
import msdfGenerate from "scarlett-msdf-bmfont-xml";
import fs from "fs";
import promisify from "util.promisify";

/**
 * FontLoader Utility Class
 */
export default class FontLoader {
  static isExtensionSupported(extension: string): boolean {
    return FontSupportedTypes.includes(extension);
  }

  static async validateFont(
    path: string,
    contentLoader: ContentLoader,
    options: {},
    generate: Function,
    writeFileAsync: Function
  ): Promise<?{ imagePath: string, specPath: string }> {
    const basename = Path.getBasename(path);
    const extension = Path.getFileExtension(basename);

    // no need to go further if extension is not supported
    if (basename.length <= 0 || !FontLoader.isExtensionSupported(extension)) {
      return null;
    }

    // now that we know the path ends with a valid extension, we can replace it
    const baseFilePath = path.substring(0, path.length - extension.length);
    const imagePath = baseFilePath + ".png";
    const specPath = baseFilePath + ".json";

    const specExists = await FontLoader.textureAndSpecExist(imagePath, specPath, contentLoader);

    // try to generate if spec or texture does not exist
    if (specExists || (await BMFontGenerator.tryToGenerateAsync(path, options, generate, writeFileAsync))) {
      return { imagePath, specPath };
    } else {
      return null;
    }
  }

  static async textureAndSpecExist(
    imagePath: string,
    specPath: string,
    contentLoader: ContentLoader
  ): Promise<boolean> {
    const textureExists: boolean = await contentLoader.fileExistsAsync(imagePath);
    const specExists: boolean = await contentLoader.fileExistsAsync(specPath);

    return textureExists && specExists;
  }

  static async loadFontAsync(
    path: string,
    contentLoader: ContentLoader = ContentLoader,
    generate: Function = msdfGenerate || (() => true),
    writeFileAsync: Function = promisify ? promisify(fs.writeFile) : () => true,
    options: {} = BMFontGenerator.BMFontOptions
  ): Promise<?FontStyle> {
    const validationResult = await FontLoader.validateFont(path, contentLoader, options, generate, writeFileAsync);

    if (validationResult === null || !validationResult.imagePath || !validationResult.specPath) {
      return null;
    }

    const imagePath = validationResult.imagePath;
    const specPath = validationResult.specPath;

    const image = await contentLoader.loadImage(imagePath, imagePath);
    const specFileContext = await contentLoader.loadFile(specPath, specPath);

    if (image === false || specFileContext === false) {
      return null;
    }

    const spec = BMFontParser.parse(specFileContext);

    if (spec === null) {
      return null;
    }

    return new FontStyle(spec, specPath, image);
  }
}
