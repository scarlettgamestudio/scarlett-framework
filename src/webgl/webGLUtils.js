import Logger from "common/logger";
import { isObjectAssigned } from "common/utils";

/**
 * WebGL Utils class
 *
 * Some boilerplate code fetched from Gregg Tavares webgl utilities
 * http://webglfundamentals.org/webgl/resources/webgl-utils.js
 */
export class WebGLUtils {
  //#region Constructors

  constructor() {
    // private fields
    this._logger = new Logger("WebGLUtils");
  }

  //#endregion

  //#region Methods

  /**
     * Compiles a shader
     * @param gl
     * @param shaderSource
     * @param shaderType
     */
  _compileShader(gl, shaderSource, shaderType) {
    // Create the shader object
    let shader = gl.createShader(shaderType);

    // Load the shader source
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check the compile status
    let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      // Something went wrong during compilation; get the error
      let lastError = gl.getShaderInfoLog(shader);

      this._logger.error(
        "Error compiling shader '" + shader + "':" + lastError
      );

      gl.deleteShader(shader);

      return null;
    }

    return shader;
  }

  /**
     * Creates a program from 2 shaders.
     * @param gl
     * @param vertexShader
     * @param fragmentShader
     * @returns {WebGLProgram}
     */
  createProgram(gl, vertexShader, fragmentShader) {
    // create a program.
    let program = gl.createProgram();

    // attach the shaders.
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link the program.
    gl.linkProgram(program);

    // Check if it linked.
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      // something went wrong with the link
      this._logger.error(
        "Program filed to link:" + gl.getProgramInfoLog(program)
      );
      // TEST: gl.getError() has more info?
    }

    return program;
  }

  /**
     * Creates a shader from the script string
     * @param gl
     * @param script
     * @param shaderType
     * @returns {null}
     */
  createShader(gl, script, shaderType) {
    // If we didn't pass in a type, use the 'type' from
    // the script tag.
    let glShaderType;
    if (shaderType === "vertex") {
      glShaderType = gl.VERTEX_SHADER;
    } else if (shaderType === "fragment") {
      glShaderType = gl.FRAGMENT_SHADER;
    } else if (!shaderType) {
      this._logger.warn("Shader type not set, discarding..");
      return null;
    }

    return this._compileShader(gl, script, glShaderType);
  }

  /**
     * Creates a shader from the content of a script tag
     * @param gl
     * @param scriptId
     * @param shaderType
     */
  createShaderFromScript(gl, scriptId, shaderType) {
    // look up the script tag by id.
    let shaderScriptElem = document.getElementById(scriptId);
    if (!shaderScriptElem) {
      this._logger.warn("Unknown script target element, discarding..");
      return null;
    }

    // extract the contents of the script tag.
    this.createShader(gl, shaderScriptElem.text, shaderType);
  }

  /**
     * Creates a program based on both vertex and fragment given scripts
     * @param gl
     * @param vertexScript
     * @param fragmentScript
     */
  createProgramFromScripts(gl, vertexScript, fragmentScript) {
    let vshader = this.createShader(gl, vertexScript, "vertex");
    let fshader = this.createShader(gl, fragmentScript, "fragment");

    if (isObjectAssigned(vshader) && isObjectAssigned(fshader)) {
      return this.createProgram(gl, vshader, fshader);
    } else {
      this._logger.warn(
        "Could not create program because" +
          " scripts could not be compiled, discarding.."
      );
    }

    // clean up shaders
    gl.deleteShader(vshader);
    gl.deleteShader(fshader);

    return null;
  }

  /**
     * Creates a program based on both vertex and fragment given elements
     * @param gl
     * @param vertexScriptId
     * @param fragmentScriptId
     */
  createProgramFromScriptElements(gl, vertexScriptId, fragmentScriptId) {
    let vshader = this.createShaderFromScript(gl, vertexScriptId, "vertex");
    let fshader = this.createShaderFromScript(gl, fragmentScriptId, "fragment");

    if (isObjectAssigned(vshader) && isObjectAssigned(fshader)) {
      return this.createProgram(gl, vshader, fshader);
    } else {
      this._logger.warn(
        "Could not create program because" +
          " scripts could not be compiled, discarding.."
      );
    }

    // clean up shaders
    gl.deleteShader(vshader);
    gl.deleteShader(fshader);

    return null;
  }

  //#endregion
}
