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
        _this.gl = null;
        if (isObjectAssigned(params.renderContainer)) {
            this.assignContextFromContainer(params.renderContainer);
        }
    }

    WebGLContext.prototype.assignContextFromContainer = function(renderContainer) {
        // let's try to get the webgl context from the given container:
        _this.gl = renderContainer.getContext("experimental-webgl") || renderContainer.getContext("webgl");
    };

    WebGLContext.prototype.getContext = function() {
        return _this.gl;
    };

    WebGLContext.prototype.unload = function () {
        _this = null;
    };

    return WebGLContext;

})();