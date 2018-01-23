/* @flow */

import { ContentLoader } from "common/contentLoader";

/**
 * FontLoader Utility Class
 */
export default class FontLoader {
  static async loadFontAsync(path: string, contentLoader: ContentLoader = ContentLoader): Promise<boolean> {
    const textureExists: boolean = await contentLoader.fileExistsAsync(path);

    return textureExists;
  }
}
