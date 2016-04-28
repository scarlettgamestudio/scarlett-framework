/**
 * WebGL Context class
 */
var WebGLContext = (function () {

    // private properties
    var _this = {};

    /**
     * @constructor
     */
    function WebGLContext(params) {
        params = params || {};

        // public properties:


        // private properties:
        _this.logger = new Logger(arguments.callee.name);
        _this.gl = null;
        if (isObjectAssigned(params.renderContainer)) {
            this.assignContextFromContainer(params.renderContainer);
        }
    }

    WebGLContext.prototype.setVirtualResolution = function(width, height) {
      if(isObjectAssigned(_this.gl)) {
          _this.gl.viewport(0, 0, width, height);
      }
    };

    WebGLContext.prototype.assignContextFromContainer = function(renderContainer) {
        // let's try to get the webgl context from the given container:
        var gl = _this.gl = renderContainer.getContext("experimental-webgl") || renderContainer.getContext("webgl");

        if (!isObjectAssigned(_this.gl)) {
            _this.logger.warn("WebGL not supported, find a container that does (eg. Chrome, Firefox)");
        }

        // default settings
        //gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
    };

    WebGLContext.prototype.getName = function() {
        return SCARLETT.WEBGL;
    };

    WebGLContext.prototype.getContext = function() {
        return _this.gl;
    };

    WebGLContext.prototype.unload = function () {
        _this = null;
    };

    return WebGLContext;

})();