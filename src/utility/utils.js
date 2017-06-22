import Game from "core/game";
import GameScene from "core/gameScene";
import Sprite from "core/sprite";

/**
 * IO Path utility class
 */
export default class Utils {
  //#region Static Properties

  /**
     *
     * @type {boolean}
     * @private
     */
  static isGame(obj) {
    return obj instanceof Game;
  }

  /**
     * 
     * @param {*} obj 
     */
  static isGameScene(obj) {
    return obj instanceof GameScene;
  }

  /**
 * Validates if the given object is a sprite
 * @param obj
 * @returns {boolean}
 */
  static isSprite(obj) {
    return obj instanceof Sprite;
  }
}
