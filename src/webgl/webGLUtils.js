/**
 * WebGL Utils class
 *
 * Some boilerplate code fetched from Gregg Tavares webgl utilities
 * http://webglfundamentals.org/webgl/resources/webgl-utils.js
 */
var WebGLUtils = (function () {

    // private properties
    var _this = {};

    function WebGLUtils() {
        // private fields
        _this.logger = new Logger(arguments.callee.name);
    }

    /**
     * Compiles a shader
     * @param gl
     * @param shaderSource
     * @param shaderType
     */
    function compileShader(gl, shaderSource, shaderType) {
        // Create the shader object
        var shader = gl.createShader(shaderType);

        // Load the shader source
        gl.shaderSource(shader, shaderSource);

        // Compile the shader
        gl.compileShader(shader);

        // Check the compile status
        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            // Something went wrong during compilation; get the error
            var lastError = gl.getShaderInfoLog(shader);

            _this.logger.error("Error compiling shader '" + shader + "':" + lastError);

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
    WebGLUtils.prototype.createProgram = function (gl, vertexShader, fragmentShader) {
        // create a program.
        var program = gl.createProgram();

        // attach the shaders.
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);

        // link the program.
        gl.linkProgram(program);

        // Check if it linked.
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!success) {
            // something went wrong with the link
            _this.logger.error("Program filed to link:" + gl.getProgramInfoLog(program));
            // TEST: gl.getError() has more info?
        }

        return program;
    };

    /**
     * Creates a shader from the script string
     * @param gl
     * @param script
     * @param shaderType
     * @returns {null}
     */
    WebGLUtils.prototype.createShader = function (gl, script, shaderType) {
        // If we didn't pass in a type, use the 'type' from
        // the script tag.
        var glShaderType;
        if (shaderType === "vertex") {
            glShaderType = gl.VERTEX_SHADER;
        } else if (shaderType === "fragment") {
            glShaderType = gl.FRAGMENT_SHADER;
        } else if (!shaderType) {
            _this.logger.warn("Shader type not set, discarding..");
            return null;
        }

        return compileShader(gl, script, glShaderType);
    };

    /**
     * Creates a shader from the content of a script tag
     * @param gl
     * @param scriptId
     * @param shaderType
     */
    WebGLUtils.prototype.createShaderFromScript = function (gl, scriptId, shaderType) {
        // look up the script tag by id.
        var shaderScriptElem = document.getElementById(scriptId);
        if (!shaderScriptElem) {
            _this.logger.warn("Unknown script target element, discarding..");
            return null;
        }

        // extract the contents of the script tag.
        this.createShader(gl, shaderScriptElem.text, shaderType);
    };

    /**
     * Creates a program based on both vertex and fragment given scripts
     * @param gl
     * @param vertexScript
     * @param fragmentScript
     */
    WebGLUtils.prototype.createProgramFromScripts = function(gl, vertexScript, fragmentScript) {
        var vshader = this.createShader(gl, vertexScript, "vertex");
        var fshader = this.createShader(gl, fragmentScript, "fragment");

        if(isObjectAssigned(vshader) && isObjectAssigned(fshader)) {
            return this.createProgram(gl, vshader, fshader);
        } else {
            _this.logger.warn("Could not create program because scripts could not be compiled, discarding..");
        }

        // clean up shaders
        gl.deleteShader(vshader);
        gl.deleteShader(fshader);

        return null;
    };

    /**
     * Creates a program based on both vertex and fragment given elements
     * @param gl
     * @param vertexScriptId
     * @param fragmentScriptId
     */
    WebGLUtils.prototype.createProgramFromScriptElements = function(gl, vertexScriptId, fragmentScriptId) {
        var vshader = this.createShaderFromScript(gl, vertexScriptId, "vertex");
        var fshader = this.createShaderFromScript(gl, fragmentScriptId, "fragment");

        if(isObjectAssigned(vshader) && isObjectAssigned(fshader)) {
            return this.createProgram(gl, vshader, fshader);
        } else {
            _this.logger.warn("Could not create program because scripts could not be compiled, discarding..");
        }

        // clean up shaders
        gl.deleteShader(vshader);
        gl.deleteShader(fshader);

        return null;
    };

    return WebGLUtils;

})();

/* for simplicity sake, add a global instance of the webgl utils */
var glu = new WebGLUtils();

