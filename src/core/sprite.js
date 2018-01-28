import GameObject from "core/gameObject";
import Transform from "core/transform";
import Color from "core/color";
import { WrapMode } from "core/wrapMode";
import Texture2D from "core/texture2D";
import Objectify from "utility/objectify";
import Path from "utility/path";
import Vector2 from "math/vector2";
import { AttributeDictionary } from "common/attributeDictionary";
import { ContentLoader } from "common/contentLoader";
import { EventManager } from "common/eventManager";
import { CONSTANTS } from "common/constants";
import Logger from "common/logger";
import { isObjectAssigned } from "common/utils";

AttributeDictionary.inherit("sprite", "gameobject");
AttributeDictionary.addRule("sprite", "_source", {
  displayName: "Source",
  editor: "filepath"
});
AttributeDictionary.addRule("sprite", "_tint", { displayName: "Tint" });
AttributeDictionary.addRule("sprite", "_texture", { visible: false });
// temporary while we don't have cb's in editor
AttributeDictionary.addRule("sprite", "_wrapMode", { visible: false });
AttributeDictionary.addRule("sprite", "_atlasRegion", {
  displayName: "Region",
  available() {
    return isObjectAssigned(this._atlas);
  }
});

/**
 * Sprite class
 */
export default class Sprite extends GameObject {
  //#region Constructors

  /**
     * Class constructor
     * @param {Object} params
     */
  constructor(params) {
    params = params || {};
    params.name = params.name || "Sprite";

    super(params);

    // private properties:
    this._source = "";
    this._atlasRegion = "";
    this._tint = params.tint || Color.fromRGB(255, 255, 255);
    this._textureWidth = 0;
    this._textureHeight = 0;
    this._origin = new Vector2(0.5, 0.5);
    this._wrapMode = WrapMode.CLAMP;
    this._atlas = null;
    this._logger = new Logger("Sprite");

    this.setTexture(params.texture);
  }

  //#endregion

  //#region Public Methods

  //#region Static Methods

  static async restore(data) {
    let sprite = new Sprite({
      name: data.name,
      transform: Transform.restore(data.transform),
      children: await Objectify.restoreArray(data.children),
      components: await Objectify.restoreArray(data.components)
    });
    await sprite.setSource(data.src);

    return sprite;
  }

  //#endregion

  getBaseWidth() {
    return this._textureWidth;
  }

  getBaseHeight() {
    return this._textureHeight;
  }

  getMatrix() {
    let x, y, width, height;

    x = this.transform.getPosition().x;
    y = this.transform.getPosition().y;
    width = this._textureWidth * this.transform.getScale().x;
    height = this._textureHeight * this.transform.getScale().y;

    this._transformMatrix.identity();

    if (this._wrapMode !== WrapMode.REPEAT) {
      this._transformMatrix.translate([x - width * this._origin.x, y - height * this._origin.y, 0]);
    } else {
      this._transformMatrix.translate([-width * this._origin.x, -height * this._origin.y, 0]);
    }

    this._transformMatrix.translate([width * this._origin.x, height * this._origin.y, 0]);
    this._transformMatrix.rotate([0.0, 0.0, 1.0], this.transform.getRotation());
    this._transformMatrix.translate([-width * this._origin.x, -height * this._origin.y, 0]);
    this._transformMatrix.scale([width, height, 0]);

    return this._transformMatrix.asArray();
  }

  setWrapMode(wrapMode) {
    this._wrapMode = wrapMode;
  }

  getWrapMode() {
    return this._wrapMode;
  }

  setOrigin(origin) {
    this._origin = origin;
  }

  getOrigin() {
    return this._origin;
  }

  setTint(color) {
    this._tint = color;
  }

  getTint() {
    return this._tint;
  }

  async setSource(path) {
    this._source = path;

    if (path == null || path.length <= 0) {
      this._logger.error("Invalid path");
      this.setTexture(null);
      return;
    }

    const ext = Path.getFileExtension(path);

    if (ext != CONSTANTS.CONTENT_EXTENSIONS.ATLAS) {
      this._atlas = null;
      return await this._assignTextureFromPath(path);
    }

    // if it's not an atlas
    const fileContext = await ContentLoader.loadFile(path);

    // if something went wrong with loading
    if (fileContext === false) {
      return;
    }

    let atlas = Objectify.restoreFromString(fileContext);

    // is this a valid atlas?
    if (atlas == null || !isObjectAssigned(atlas.sourcePath)) {
      this._logger.error("Couldn't restore atlas");
      return;
    }

    this._atlas = atlas;

    // FIXME: change to a more appropriate event?
    // this is currently being used so the property editor refreshes the view after the atlas
    // is asynchronously loaded.
    EventManager.emit(CONSTANTS.EVENTS.CONTENT_ASSET_LOADED, path);

    return await this._assignTextureFromPath(this._atlas.sourcePath);
  }

  getAtlasRegion() {
    return this._atlasRegion;
  }

  setAtlasRegion(value) {
    this._atlasRegion = value;
  }

  getSource() {
    return this._source;
  }

  getType() {
    return "Sprite";
  }

  getTexture() {
    return this._texture;
  }

  setTexture(texture) {
    // is this a ready texture?
    if (!texture || !texture.isReady()) {
      this._texture = null;
      this._textureWidth = 0;
      this._textureHeight = 0;
      return;
    }

    this._texture = texture;

    // cache the dimensions
    this._textureWidth = this._texture.getWidth();
    this._textureHeight = this._texture.getHeight();
  }

  render(delta, spriteBatch) {
    if (!this.enabled) {
      return;
    }

    // just store the sprite to render on flush:
    spriteBatch.storeSprite(this);

    // parent render function:
    super.render(delta, spriteBatch);
  }

  // functions:
  objectify() {
    let superObjectify = super.objectify();
    return Objectify.extend(superObjectify, {
      src: this._source,
      tint: this._tint.objectify()
    });
  }

  unload() {}

  //#endregion

  //#region Private Methods

  async _assignTextureFromPath(path) {
    const texture = await Texture2D.fromPath(path);

    if (texture == null) {
      return;
    }

    this.setTexture(texture);
  }

  //#endregion
}
