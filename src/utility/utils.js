import Game from "core/game";
import GameScene from "core/gameScene";

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
}
