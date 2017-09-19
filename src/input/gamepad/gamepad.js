import { EventManager } from "common/eventManager";
import { CONSTANTS } from "common/constants";
import GamepadState from "./gamepadState";
import Logger from "common/logger";

// unique key
const _gamepadSingleton = Symbol("gamepadSingleton");

/**
 * Global Keyboard handler
 */
class GamepadSingleton {
  //#region Constructors

  constructor(_gamepadSingletonToken) {
    if (_gamepadSingleton !== _gamepadSingletonToken) {
      throw new Error("Cannot instantiate directly.");
    }

    // variables
    this._logger = new Logger("Gamepad");

    // initialize:
    this._initialize();
  }

  //#endregion

  //#region Public methods

  getGamepadState(index) {
    if (typeof navigator.getGamepads === "undefined") {
      this._logger.warn("Gamepad module not available on this system!");
      return;
    }

    let gamepads = navigator.getGamepads();

    if (!gamepads[index]) {
      return null;
    }

    return new GamepadState(gamepads[index]);
  }

  //#endregion

  //#region Private Methods

  _initialize() {
    // subscribe to game pad events:
    window.addEventListener("gamepadconnected", this._onGamepadConnected.bind(this), false);
    window.addEventListener("gamepaddisconnected", this._onGamepadDisconnected.bind(this), false);
  }

  _onGamepadConnected(e) {
    let gamepad = e.gamepad;

    this._logger.log("Gamepad [" + gamepad.index + "] connected");

    EventManager.emit(CONSTANTS.EVENTS.INPUT.GAMEPAD_CONNECTED, gamepad);
  }

  _onGamepadDisconnected(e) {
    let gamepad = e.gamepad;

    this._logger.log("Gamepad [" + gamepad.index + "] disconnected");

    EventManager.emit(CONSTANTS.EVENTS.INPUT.GAMEPAD_DISCONNECTED, gamepad);
  }

  //#endregion

  //#region Static Methods

  static get instance() {
    if (!this[_gamepadSingleton]) {
      this[_gamepadSingleton] = new GamepadSingleton(_gamepadSingleton);
    }

    return this[_gamepadSingleton];
  }

  //#endregion
}

export const Gamepad = GamepadSingleton.instance;
