/* @flow */

import { ContentLoader } from "common/contentLoader";
import Path from "utility/path";
import { FontSupportedTypes } from "utility/fontSupportedTypes";
import FontStyle from "core/fontStyle";
import BMFontParser from "utility/bmFontParser";
import GenerateBMFont from "utility/generateBMFont";

/**
 * FontLoader Utility Class
 */
export default class FontLoader {
  static isExtensionSupported(extension: string): boolean {
    return FontSupportedTypes.includes(extension);
  }

  static async validateFont(
    path: string,
    contentLoader: ContentLoader
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

    if (!await FontLoader.textureAndSpecExist(imagePath, specPath, contentLoader)) {
      return null;
    }
    return { imagePath, specPath };
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

  static async loadFontAsync(path: string, contentLoader: ContentLoader = ContentLoader): Promise<?FontStyle> {
    const validationResult = await FontLoader.validateFont(path, contentLoader);

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
