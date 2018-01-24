/* @flow */

import { ContentLoader } from "common/contentLoader";
import Path from "utility/path";
import { FontSupportedTypes } from "utility/fontSupportedTypes";
import FontStyle from "core/fontStyle";
import BMFontParser from "utility/bmFontParser";
import FileContext from "common/fileContext";

/**
 * FontLoader Utility Class
 */
export default class FontLoader {
  static isExtensionSupported(extension: string): boolean {
    return FontSupportedTypes.includes(extension);
  }

  static async loadFontAsync(path: string, contentLoader: ContentLoader = ContentLoader): Promise<boolean | FontStyle> {
    const basename = Path.getBasename(path);
    const extension = Path.getFileExtension(basename);

    // no need to go further if extension is not supported
    if (basename.length <= 0 || !FontLoader.isExtensionSupported(extension)) {
      return false;
    }

    // now that we know the path ends with a valid extension, we can replace it
    const baseFilePath = path.substring(0, path.length - extension.length);
    const texturePath = baseFilePath + ".png";
    const specPath = baseFilePath + ".json";

    const textureExists: boolean = await contentLoader.fileExistsAsync(texturePath);
    const specExists: boolean = await contentLoader.fileExistsAsync(specPath);

    // no need to go further if either texture or spec cannot be found
    if (!textureExists || !specExists) {
      return false;
    }

    const texture = await contentLoader.loadImage(texturePath, texturePath);
    const specFileContext = await contentLoader.loadFile(specPath, specPath);

    if (texture === false || specFileContext === false) {
      return false;
    }

    const spec = BMFontParser.parse(specFileContext);

    if (spec === null) {
      return false;
    }

    return new FontStyle(spec, specPath, texture);
  }
}
