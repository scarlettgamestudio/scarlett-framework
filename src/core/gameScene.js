import Matter from "matter-js";
import { AttributeDictionary } from "common/attributeDictionary";
import Color from "core/color";
import Camera2D from "core/camera2D";
import GameManager from "core/gameManager";
import Objectify from "utility/objectify";
import SpriteBatch from "./spriteBatch";
import { generateUID, isObjectAssigned } from "common/utils";

AttributeDictionary.addRule("gameScene", "_game", { visible: false });
AttributeDictionary.addRule("gameScene", "_gameObjects", { visible: false });
AttributeDictionary.addRule("gameScene", "_camera", { visible: false });
AttributeDictionary.addRule("gameScene", "_spriteBatch", { visible: false });

/**
 * GameScene class
 */
export default class GameScene {
  //#region Constructors

  /**
     *
     * @param params
     */
  constructor(params) {
    params = params || {};

    if (!params.game) {
      throw new Error("Cannot create a game scene without the game parameter");
    }

    // public properties:

    this.name = params.name || "GameScene";

    // private properties:
    this._uid = generateUID();
    this._game = params.game || null;
    this._backgroundColor = params.backgroundColor || Color.CornflowerBlue;
    this._gameObjects = params.gameObjects || [];
    // the default scene camera
    this._camera =
      params.camera ||
      new Camera2D(0, 0, this._game.getVirtualResolution().width, this._game.getVirtualResolution().height);
    this._spriteBatch = new SpriteBatch(params.game);
  }

  //#endregion

  //#region Methods

  //#region Static Methods

  static restore(data) {
    return new GameScene({
      game: GameManager.activeGame,
      backgroundColor: Color.restore(data.backgroundColor),
      camera: Camera2D.restore(data.camera),
      gameObjects: Objectify.restoreArray(data.gameObjects)
    });
  }

  //#endregion

  getUID() {
    return this._uid;
  }

  getPhysicsWorld() {
    return this._game.getPhysicsEngine().world;
  }

  getCamera() {
    return this._camera;
  }

  setGame(game) {
    this._game = game;
  }

  getGame() {
    return this._game;
  }

  setBackgroundColor(color) {
    this._backgroundColor = color;
  }

  getBackgroundColor() {
    return this._backgroundColor;
  }

  addGameObject(gameObject, index) {
    // let's be safe, make sure to remove parent if any
    gameObject.removeParent();

    if (isObjectAssigned(index)) {
      this._gameObjects.insert(index, gameObject);
    } else {
      this._gameObjects.push(gameObject);
    }
  }

  getGameObjects() {
    return this._gameObjects;
  }

  removeGameObject(gameObject) {
    for (let i = this._gameObjects.length - 1; i >= 0; i--) {
      if (this._gameObjects[i].getUID() == gameObject.getUID()) {
        return this._gameObjects.splice(i, 1);
      }
    }
  }

  /**
     * Returns an array with all the game objects of this scene. 
     * All child game objects are included.
     */
  getAllGameObjects() {
    let result = [];

    // TODO: make it a private function
    function recursive(gameObjects) {
      gameObjects.forEach(function(elem) {
        result.push(elem);
        recursive(elem.getChildren());
      });
    }

    recursive(this._gameObjects);

    return result;
  }

  prepareRender() {
    let gl = this._game.getRenderContext().getContext();

    // set clear color and clear the screen:
    gl.clearColor(this._backgroundColor.r, this._backgroundColor.g, this._backgroundColor.b, this._backgroundColor.a);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this._spriteBatch.begin();
  }

  // eslint-disable-next-line
  sceneLateUpdate(delta) {
    Matter.Engine.update(this._game.getPhysicsEngine(), 1000 / 60);
  }

  sceneUpdate(delta) {
    // let's render all game objects on scene:
    for (let i = 0; i < this._gameObjects.length; i++) {
      this._gameObjects[i].update(delta);
    }
  }

  sceneRender(delta) {
    // let's render all game objects on scene:
    for (let i = 0; i < this._gameObjects.length; i++) {
      this._gameObjects[i].render(delta, this._spriteBatch);
    }
  }

  flushRender() {
    // all draw data was stored. let's actually render stuff into the screen!
    this._spriteBatch.flush();
  }

  objectify() {
    return {
      name: this.name,
      camera: this._camera.objectify(),
      backgroundColor: this._backgroundColor.objectify(),
      gameObjects: Objectify.array(this._gameObjects)
    };
  }

  unload() {}

  //#endregion
}
