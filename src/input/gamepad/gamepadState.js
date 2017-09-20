export default class GamepadState {
  constructor(gamepadInfo) {
    this.gamepadInfo = gamepadInfo;
  }

  /**
   * 
   * @param buttonIndex
   * @returns {*}
   */
  isButtonPressed(buttonIndex) {
    return this.gamepadInfo.buttons[buttonIndex] && this.gamepadInfo.buttons[buttonIndex].pressed;
  }

  /**
   * 
   * @param buttonIndex
   * @returns {number}
   */
  getButtonValue(buttonIndex) {
    if (!this.gamepadInfo.buttons[buttonIndex]) {
      return 0;
    }

    return this.gamepadInfo.buttons[buttonIndex].value;
  }

  /**
   * 
   * @param axisIndex
   */
  getAxisValue(axisIndex) {
    if (!this.gamepadInfo.axes[axisIndex]) {
      return 0;
    }

    return this.gamepadInfo.axes[axisIndex];
  }
}
