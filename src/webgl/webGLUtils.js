/**
 * WebGL Utils class
 * 
 * Some code fetched from Gregg Tavares webgl utilities
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
     * Loads a shader
     * @param gl
     * @param shaderSource
     * @param shaderType
     */
    WebGLUtils.prototype.loadShader = function(gl, shaderSource, shaderType) {
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
    };


    return WebGLUtils;

})();

/* for simplicity sake, add a global instance of the webgl utils */
var glu = new WebGLUtils();

