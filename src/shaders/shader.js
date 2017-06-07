import GameManager from "core/gameManager";
import { Debug } from "common/logger";
import { GLU } from "webgl/webGLUtils";
import { isObjectAssigned, generateUID, isTexture2D } from "common/utils";

/**
 * Shader Class
 * Some cool code ideas were applied from Pixi.JS Shader class
 */
export default class Shader {
  //#region Constructors

  constructor(vertexScript, fragmentScript, uniforms, attributes) {
    if (!isObjectAssigned(vertexScript) || !isObjectAssigned(fragmentScript)) {
      throw new Error(
        "Vertex and Fragment scripts are required" +
          " to create a shader, discarding..."
      );
    }

    if (!isObjectAssigned(GameManager.renderContext)) {
      throw new Error(
        "The WebGL render context is not yet set, can't create shader."
      );
    }

    // public properties:
    this.uniforms = uniforms || {};
    this.attributes = attributes || {};

    // private properties:
    this._gl = GameManager.renderContext.getContext();
    this._program = null;
    this._vertexScript = vertexScript;
    this._fragmentScript = fragmentScript;
    this._textureCount = 1;
    this._uid = generateUID();

    this.setup();
  }

  //#endregion

  //#region Methods

  /**
     * Setup shader logic
     */
  setup() {
    if (this.compile()) {
      let shaderManager = GameManager.activeGame.getShaderManager();
      if (shaderManager) {
        shaderManager.useShader(this);
      } else {
        this._gl.useProgram(this._program);
      }

      // cache some script locations:
      this.cacheUniformLocations(Object.keys(this.uniforms));
      this.cacheAttributeLocations(Object.keys(this.attributes));
    } else {
      Debug.error("Shader setup failed");
    }
  }

  /**
     * Compiles the shader and generates the shader program
     * @returns {boolean}
     */
  compile() {
    let program = GLU.createProgramFromScripts(
      this._gl,
      this._vertexScript,
      this._fragmentScript
    );

    if (isObjectAssigned(program)) {
      this._program = program;

      return true;
    } else {
      program = null;
    }

    return false;
  }

  /**
     * Gets the unique id of this shader instance
     */
  getUID() {
    return this._uid;
  }

  /**
     * Cache the uniform locations for faster re-utilization
     * @param keys
     */
  cacheUniformLocations(keys) {
    for (let i = 0; i < keys.length; ++i) {
      let type = typeof this.uniforms[keys[i]];

      if (type !== "object") {
        Debug.warn("Shader's uniform " + keys[i] + " is not an object.");
        continue;
      }

      this.uniforms[keys[i]]._location = this._gl.getUniformLocation(
        this._program,
        keys[i]
      );
    }
  }

  /**
     * Cache the attribute locations for faster re-utilization
     * @param keys
     */
  cacheAttributeLocations(keys) {
    for (let i = 0; i < keys.length; ++i) {
      this.attributes[keys[i]] = this._gl.getAttribLocation(
        this._program,
        keys[i]
      );
    }
  }

  /**
     * Syncs all the uniforms attached to this shader
     */
  syncUniforms() {
    this._textureCount = 1;

    for (let key in this.uniforms) {
      this.syncUniform(this.uniforms[key]);
    }
  }

  /**
     * Synchronizes/updates the values for the given uniform
     * @param uniform
     */
  syncUniform(uniform) {
    let location = uniform._location;
    let value = uniform.value;
    let gl = this._gl;

    // depending on the uniform type,
    // WebGL has different ways of synchronizing values
    // the values can either be a Float32Array or JS Array object
    switch (uniform.type) {
      case "b":
      case "bool": {
        gl.uniform1i(location, value ? 1 : 0);
        break;
      }
      case "i":
      case "1i": {
        gl.uniform1i(location, value);
        break;
      }
      case "2i": {
        gl.uniform2i(location, value[0], value[1]);
        break;
      }
      case "3i": {
        gl.uniform3i(location, value[0], value[1], value[2]);
        break;
      }
      case "4i": {
        gl.uniform4i(location, value[0], value[1], value[2], value[3]);
        break;
      }
      case "f":
      case "1f": {
        gl.uniform1f(location, value);
        break;
      }
      case "2f": {
        gl.uniform2f(location, value[0], value[1]);
        break;
      }
      case "3f": {
        gl.uniform3f(location, value[0], value[1], value[2]);
        break;
      }
      case "4f": {
        gl.uniform4f(location, value[0], value[1], value[2], value[3]);
        break;
      }
      case "m2":
      case "mat2": {
        // TODO: implement matrix2 transpose
        gl.uniformMatrix2fv(location, uniform.transpose, value);
        break;
      }
      case "m3":
      case "mat3": {
        // TODO: implement matrix3 transpose
        gl.uniformMatrix3fv(location, uniform.transpose, value);
        break;
      }
      case "m4":
      case "mat4": {
        // TODO: implement matrix4 transpose
        gl.uniformMatrix4fv(location, uniform.transpose, value);
        break;
      }
      case "tex": {
        if (!isTexture2D(uniform.value) || !uniform.value.isReady()) {
          Debug.warn(
            "Could not assign texture uniform because the texture isn't ready."
          );
          break;
        }

        gl.activeTexture(gl["TEXTURE" + this._textureCount]);

        let texture = uniform.value.getImageData()._glTextures[gl.id];

        // the texture was already sampled?
        if (!isObjectAssigned(texture)) {
          // TODO: do stuff here? :D
        }

        break;
      }
      default: {
        Debug.warn("Unknown uniform type: " + uniform.type);
        break;
      }
    }
  }

  getProgram() {
    return this._program;
  }

  initSampler2D(uniform) {
    if (!isTexture2D(uniform.value) || !uniform.value.isReady()) {
      Debug.warn(
        "Could not initialize sampler2D because the texture isn't ready."
      );
      return;
    }

    // TODO: check unused variables below
    //let imgData = uniform.value.getImageData();
    //let texture = imgData.baseTexture;
  }

  unload() {
    // clean up program using WebGL flow
    this._gl.deleteProgram(this._program);
  }

  //#endregion
}
