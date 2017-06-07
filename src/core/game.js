import Matter from "matter-js";
import { CONSTANTS } from "common/constants";
import Logger from "common/logger";
import GameManager from "./gameManager";
import WebGLContext from "webgl/webGLContext";
import ShaderManager from "shaders/shaderManager";
import Keys from "input/keys";
import { Keyboard } from "input/keyboard";
import { isString, isObjectAssigned, isFunction } from "common/utils";
import { isGameScene } from "core/gameScene";

/**
 * Validates if the given object is a game object
 * @param obj
 * @returns {boolean}
 */
export function isGame(obj) {
  return obj instanceof Game;
}

/**
 * GameScene Class
 */
export default class Game {
  //#region Constructors

  constructor(params) {
    params = params || {};

    let DEFAULT_VIRTUAL_WIDTH = 800;
    let DEFAULT_VIRTUAL_HEIGHT = 640;

    // public properties:

    // private properties:
    this._renderContext = null;
    this._logger = new Logger("Game");
    this._initialized = false;
    this._gameScene = params.scene;
    this._totalElapsedTime = null;
    this._virtualResolution = null;
    this._shaderManager = null;
    this._executionPhase = CONSTANTS.EXECUTION_PHASES.WAITING;
    this._physicsEngine = Matter.Engine.create();
    this._physicsEngine.enableSleeping = true;
    this._renderExtensions = {};
    this._paused = false;
    this._swapScene = null; // used to contain a temporary scene before swapping
    this._swappingScenes = false;
    this._inputHandlersBinded = false;

    Matter.Engine.run(this._physicsEngine);

    // set the default virtual resolution
    this.setVirtualResolution(DEFAULT_VIRTUAL_WIDTH, DEFAULT_VIRTUAL_HEIGHT);

    // the target container is defined?
    if (isString(params.target)) {
      this.setTarget(params.target);
    }
  }

  //#endregion

  //#region Public Methods

  /**
     *
     * @param name
     * @param extension
     */
  addRenderExtension(name, extension) {
    this._renderExtensions[name] = extension;
  }

  /**
     *
     * @param name
     */
  removeRenderExtension(name) {
    delete this._renderExtensions[name];
  }

  /**
     *
     */
  clearRenderExtensions() {
    this._renderExtensions = [];
  }

  /**
     *
     * @returns {engine|*}
     */
  getPhysicsEngine() {
    return this._physicsEngine;
  }

  pauseGame() {
    this._paused = true;
  }

  resumeGame() {
    this._paused = false;
  }

  getShaderManager() {
    return this._shaderManager;
  }

  getActiveCamera() {
    return this._gameScene ? this._gameScene.getCamera() : null;
  }

  getExecutionPhase() {
    return this._executionPhase;
  }

  init(params) {
    params = params || {};

    // context initialization
    if (!isObjectAssigned(this._canvas)) {
      this._logger.warn(
        "Cannot initialize game, " +
          "the render display target was not provided or is invalid."
      );
      return;
    }

    // request to begin the animation frame handling
    this._onAnimationFrame(0);

    // set this as the active game:
    GameManager.activeGame = this;

    if (!params.ignoreInputHandler) {
      this._bindInputHandlers();
    }

    this._initalized = true;
  }

  /**
     * Set this as the active game
     */
  setActive() {
    GameManager.activeGame = this;
  }

  setVirtualResolution(width, height) {
    this._virtualResolution = {
      width: width,
      height: height
    };

    if (isObjectAssigned(this._renderContext)) {
      this._renderContext.setVirtualResolution(width, height);

      // update camera view size:
      this.getActiveCamera().setViewSize(width, height);
    }
  }

  refreshVirtualResolution() {
    this._renderContext.setVirtualResolution(
      this._virtualResolution.width,
      this._virtualResolution.height
    );

    let camera = this.getActiveCamera();
    if (camera) {
      camera.setViewSize(
        this._virtualResolution.width,
        this._virtualResolution.height
      );
    }
  }

  getVirtualResolution() {
    return this._virtualResolution;
  }

  getRenderContext() {
    return this._renderContext;
  }

  setTarget(target) {
    this._canvas = isString(target) ? document.getElementById(target) : null;

    if (isObjectAssigned(this._canvas)) {
      // OPTIONAL: for now there is only WebGL Context, add more if needed:
      // assign the render context..
      this._renderContext = new WebGLContext({
        renderContainer: this._canvas
      });

      // setting the global active render as the one selected for this game:
      GameManager.renderContext = this._renderContext;
      this._shaderManager = new ShaderManager(this);

      this.refreshVirtualResolution();
    }
  }

  changeScene(scene) {
    if (!isGameScene(scene)) {
      return;
    }

    // is it safe to swap scenes now?
    if (this._executionPhase == CONSTANTS.EXECUTION_PHASES.WAITING) {
      // flag the swapping state
      this._swappingScenes = true;

      if (this._gameScene) {
        // unload the active scene:
        this._gameScene.unload();
      }

      this._gameScene = scene;
      this._gameScene.setGame(this);

      GameManager.activeScene = scene;
      this.refreshVirtualResolution();

      // the user defined the game scene initialize function?
      if (isFunction(this._gameScene.initialize)) {
        // call user defined update function:
        this._gameScene.initialize();
      }

      this._swappingScenes = false;
    } else {
      // nope, store this scene to change in the next animation frame start
      this._swapScene = scene;
    }
  }

  getTotalElapsedTime() {
    return this._totalElapsedTime;
  }

  unload() {
    if (this._inputHandlersBinded) {
      this._unbindInputHandlers();
    }
  }

  //#endregion

  //#region Private Methods

  /**
     *
     * @private
     */
  _bindInputHandlers() {
    window.addEventListener("keyup", this._keyUpListener.bind(this), false);
    window.addEventListener("keydown", this._keyDownListener.bind(this), false);
    this._inputHandlersBinded = true;
  }

  /**
     *
     * @private
     */
  _unbindInputHandlers() {
    window.removeEventListener("keyup", this._keyUpListener.bind(this), false);
    window.removeEventListener(
      "keydown",
      this._keyDownListener.bind(this),
      false
    );
    this._inputHandlersBinded = false;
  }

  /**
     *
     * @param e
     * @private
     */
  _keyUpListener(e) {
    let keys = [e.keyCode];

    if (e.ctrlKey) {
      keys.push(Keys.Ctrl);
    }

    if (e.shiftKey) {
      keys.push(Keys.Shift);
    }

    // update the keyboard data:
    Keyboard.removeKeys(keys);
  }

  /**
     *
     * @param e
     * @private
     */
  _keyDownListener(e) {
    let keys = [e.keyCode];

    if (e.ctrlKey) {
      keys.push(Keys.Ctrl);
    }

    if (e.shiftKey) {
      keys.push(Keys.Shift);
    }

    // update the keyboard data:
    Keyboard.addKeys(keys);
  }

  /**
     *
     * @param timestamp
     * @private
     */
  _onAnimationFrame(timestamp) {
    // is this the first run?
    if (this._totalElapsedTime === null) {
      this._totalElapsedTime = timestamp;
    }

    // any scene waiting to be swapped?
    if (this._swapScene && !this._swappingScenes) {
      this.changeScene(this._swapScene);
      this._swapScene = null;
    }

    // calculate the current delta time value:
    let delta = (timestamp - this._totalElapsedTime) / 1000;
    let self = this;
    this._totalElapsedTime = timestamp;

    if (
      !this._paused &&
      isGameScene(this._gameScene) &&
      !this._swappingScenes
    ) {
      // handle the active game scene interactions here:

      // TODO: before release, add the try here..
      //try {
      // the user defined the game scene update function?
      if (isFunction(this._gameScene.update)) {
        // call user defined update function:
        this._executionPhase = CONSTANTS.EXECUTION_PHASES.UPDATE;
        this._gameScene.update(delta);
      }

      this._gameScene.sceneUpdate(delta);

      if (isFunction(this._gameScene.lateUpdate)) {
        // call user defined update function:
        this._executionPhase = CONSTANTS.EXECUTION_PHASES.LATE_UPDATE;
        this._gameScene.lateUpdate(delta);
      }

      this._gameScene.sceneLateUpdate(delta);

      // prepare the webgl context for rendering:
      this._gameScene.prepareRender();

      // render extensions?
      let renderExtensions = Object.keys(this._renderExtensions);
      renderExtensions.forEach(function(name) {
        self._renderExtensions[name].render(delta);
      });

      // the user defined the game scene early-render function?
      if (isFunction(this._gameScene.render)) {
        this._executionPhase = CONSTANTS.EXECUTION_PHASES.RENDER;
        this._gameScene.render(delta);
      }

      // call internal scene render function:
      this._executionPhase = CONSTANTS.EXECUTION_PHASES.SCENE_RENDER;
      this._gameScene.sceneRender(delta);

      this._gameScene.flushRender();

      // the user defined the game scene pre-render function?
      if (isFunction(this._gameScene.lateRender)) {
        this._executionPhase = CONSTANTS.EXECUTION_PHASES.LATE_RENDER;
        this._gameScene.lateRender(delta);
        this._gameScene.flushRender();
      }

      //} catch (ex) {
      //    this._logger.error(ex);
      //}

      this._executionPhase = CONSTANTS.EXECUTION_PHASES.WAITING;
    }

    // request a new animation frame:
    if (!this._paused) {
      requestAnimationFrame(this._onAnimationFrame.bind(this));
    } else {
      // when the game is paused it's a good idea to wait a
      // few ms before requesting a new animation frame to
      // save some machine resources...
      setTimeout(function() {
        requestAnimationFrame(self._onAnimationFrame.bind(self));
      }, 100);
    }
  }

  //#endregion
}
