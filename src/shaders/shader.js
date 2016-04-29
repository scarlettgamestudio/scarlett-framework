/**
 * Shader class
 * Some cool code ideas were applied from Pixi.JS Shader class
 */
var Shader = (function () {

    // private properties
    var _this = {};

    /**
     * @constructor
     */
    function Shader(vertexScript, fragmentScript, uniforms, attributes) {
        if (!isObjectAssigned(vertexScript) || !isObjectAssigned(fragmentScript)) {
            throw new Error("Vertex and Fragment scripts are required to create a shader, discarding..");
        }

        if (!isObjectAssigned(GameManager.renderContext)) {
            throw new Error("The WebGL render context is not yet set, can't create shader.");
        }

        // public properties:
        this.uniforms = uniforms || {};
        this.attributes = attributes || {};

        // private properties:
        _this.gl = GameManager.renderContext.getContext();
        _this.program = null;
        _this.vertexScript = vertexScript;
        _this.fragmentScript = fragmentScript;
        _this.textureCount = 1;
        _this.uid = generateUID();

        // setup the shader:
        this.setup();
    }

    /**
     * Setup shader logic
     */
    Shader.prototype.setup = function () {
        if (this.compile()) {
            _this.gl.useProgram(_this.program);

            // cache some script locations:
            this.cacheUniformLocations(Object.keys(this.uniforms));
            this.cacheAttributeLocations(Object.keys(this.attributes));
        } else {
            debug.error("Shader setup failed");
        }
    };

    /**
     * Compiles the shader and generates the shader program
     * @returns {boolean}
     */
    Shader.prototype.compile = function () {
        var program = glu.createProgramFromScripts(_this.gl, _this.vertexScript, _this.fragmentScript);

        if (isObjectAssigned(program)) {
            _this.program = program;

            return true;
        } else {
            program = null;
        }

        return false;
    };

    /**
     * Gets the unique id of this shader instance
     */
    Shader.prototype.getUID = function() {
        return _this.uid;
    };

    /**
     * Cache the uniform locations for faster re-utilization
     * @param keys
     */
    Shader.prototype.cacheUniformLocations = function (keys) {
        for (var i = 0; i < keys.length; ++i) {
            this.uniforms[keys[i]]._location = _this.gl.getUniformLocation(_this.program, keys[i]);
        }
    };

    /**
     * Cache the attribute locations for faster re-utilization
     * @param keys
     */
    Shader.prototype.cacheAttributeLocations = function (keys) {
        for (var i = 0; i < keys.length; ++i) {
            this.attributes[keys[i]] = _this.gl.getAttribLocation(_this.program, keys[i]);
        }
    };

    /**
     * Syncs all the uniforms attached to this shader
     */
    Shader.prototype.syncUniforms = function () {
        _this.textureCount = 1;

        for (var key in this.uniforms) {
            this.syncUniform(this.uniforms[key]);
        }
    };

    /**
     * Synchronizes/updates the values for the given uniform
     * @param uniform
     */
    Shader.prototype.syncUniform = function (uniform) {
        var location = uniform._location,
            value = uniform.value,
            gl = _this.gl;

        // depending on the uniform type, WebGL has different ways of synchronizing values
        // the values can either be a Float32Array or JS Array object
        switch (uniform.type) {
            case 'b':
            case 'bool':
                gl.uniform1i(location, value ? 1 : 0);
                break;
            case 'i':
            case '1i':
                gl.uniform1i(location, value);
                break;
            case '2i':
                gl.uniform2i(location, value[0], value[1]);
                break;
            case '3i':
                gl.uniform3i(location, value[0], value[1], value[2]);
                break;
            case '4i':
                gl.uniform4i(location, value[0], value[1], value[2], value[3]);
                break;
            case 'f':
            case '1f':
                gl.uniform1f(location, value);
                break;
            case '2f':
                gl.uniform2f(location, value[0], value[1]);
                break;
            case '3f':
                gl.uniform3f(location, value[0], value[1], value[2]);
                break;
            case '4f':
                gl.uniform4f(location, value[0], value[1], value[2], value[3]);
                break;
            case 'm2':
            case 'mat2':
                gl.uniformMatrix2fv(location, uniform.transpose, value);
                break;
            case 'm3':
            case 'mat3':
                gl.uniformMatrix3fv(location, uniform.transpose, value);
                break;
            case 'm4':
            case 'mat4':
                gl.uniformMatrix4fv(location, uniform.transpose, value);
                break;
            case 'tex':
                if (!isTexture2D(uniform.value) || !uniform.value.isReady()) {
                    debug.warn("Could not assign texture uniform because the texture isn't ready.");
                    break;
                }

                gl.activeTexture(gl["TEXTURE" + _this.textureCount]);

                var texture = uniform.value.getImageData()._glTextures[gl.id];

                // the texture was already sampled?
                if (!isObjectAssigned(texture)) {

                }

                break;
            default:
                debug.warn("Unknown uniform type: " + uniform.type);
                break;
        }
    };

    Shader.prototype.getProgram = function() {
      return _this.program;
    };

    Shader.prototype.initSampler2D = function (uniform) {
        if (!isTexture2D(uniform.value) || !uniform.value.isReady()) {
            debug.warn("Could not initialize sampler2D because the texture isn't ready.");
            return;
        }

        var gl = _this.gl;
        var imgData = uniform.value.getImageData();

        var texture = imgData.baseTexture;

    };

    Shader.prototype.unload = function () {
        // clean up program using WebGL flow
        _this.gl.deleteProgram(_this.program);

        _this = null;
    };

    return Shader;

})();