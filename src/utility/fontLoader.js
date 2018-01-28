/* @flow */

import { ContentLoader } from "common/contentLoader";
import Path from "utility/path";
import { FontSupportedTypes } from "utility/fontSupportedTypes";
import FontStyle from "core/fontStyle";
import BMFontParser from "utility/bmFontParser";

/**
 * FontLoader Utility Class
 */
export default class FontLoader {
  static isExtensionSupported(extension: string): boolean {
    return FontSupportedTypes.includes(extension);
  }

  static async loadFontAsync(path: string, contentLoader: ContentLoader = ContentLoader): Promise<?FontStyle> {
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

    const textureExists: boolean = await contentLoader.fileExistsAsync(imagePath);
    const specExists: boolean = await contentLoader.fileExistsAsync(specPath);

    // no need to go further if either texture or spec cannot be found
    if (!textureExists || !specExists) {
      return null;
    }

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
