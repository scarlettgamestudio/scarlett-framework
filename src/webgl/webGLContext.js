/**
 * WebGLContext Class
 */

import Logger from "common/logger";
import { CONSTANTS } from "common/constants";

import { isObjectAssigned } from "common/utils";

export default class WebGLContext {
  //#region Constructors

  constructor(params) {
    params = params || {};

    // public properties:

    // private properties:
    this._logger = new Logger("WebGLContext");
    this._canvas = null;
    this._gl = null;

    if (isObjectAssigned(params.renderContainer)) {
      this.assignContextFromContainer(params.renderContainer);
    }
  }

  //#endregion

  //#region Methods

  setVirtualResolution(width, height) {
    if (isObjectAssigned(this._gl)) {
      this._canvas.width = width;
      this._canvas.height = height;

      this._gl.viewport(0, 0, width, height);
    }
  }

  assignContextFromContainer(canvas) {
    // let's try to get the webgl context from the given container:
    // alpha is set to false to avoid webgl picking up the canvas color
    // and place it on the alpha channel
    // see: http://webglfundamentals.org/webgl/lessons/webgl-and-alpha.html
    let gl = (this._gl =
      canvas.getContext("experimental-webgl", { alpha: false }) ||
      canvas.getContext("webgl", { alpha: false }) ||
      canvas.getContext("webkit-3d", { alpha: false }) ||
      canvas.getContext("moz-webgl", { alpha: false }));

    if (!isObjectAssigned(this._gl)) {
      this._logger.warn(
        "WebGL not supported, find a container that does (eg. Chrome, Firefox)"
      );
      return;
    }

    this._canvas = canvas;

    // disable gl functions:
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);

    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);

    // enable gl functions:
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  getName() {
    return CONSTANTS.WEBGL;
  }

  getContext() {
    return this._gl;
  }

  unload() {}

  //#endregion
}
