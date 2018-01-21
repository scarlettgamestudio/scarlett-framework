/* @flow */

import { ContentLoader } from "common/contentLoader";

/**
 * FontLoader Utility Class
 */
export default class FontLoader {
  static async LoadTrueTypeAsync(path: string, contentLoader: ContentLoader = ContentLoader): Promise<boolean> {
    const textureExists: Promise<boolean> = await contentLoader.fileExistsAsync(path);

    return textureExists;
  }
}
