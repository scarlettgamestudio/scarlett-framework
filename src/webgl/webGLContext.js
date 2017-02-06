/**
 * WebGL Context class
 */
function WebGLContext(params) {
    params = params || {};

    // public properties:


    // private properties:
    this._logger = new Logger(arguments.callee.name);
    this._canvas = null;
    this._gl = null;

    if (isObjectAssigned(params.renderContainer)) {
        this.assignContextFromContainer(params.renderContainer);
    }
}

WebGLContext.prototype.setVirtualResolution = function (width, height) {
    if (isObjectAssigned(this._gl)) {
        this._canvas.width = width;
        this._canvas.height = height;

        this._gl.viewport(0, 0, width, height);
    }
};

WebGLContext.prototype.assignContextFromContainer = function (canvas) {
    // let's try to get the webgl context from the given container:
    // alpha is set to false to avoid webgl picking up the canvas color and place it on the alpha channel
    // see: http://webglfundamentals.org/webgl/lessons/webgl-and-alpha.html
    var gl = this._gl = canvas.getContext("experimental-webgl", {alpha: false}) ||
        canvas.getContext("webgl", {alpha: false}) ||
        canvas.getContext("webkit-3d", {alpha: false}) || canvas.getContext("moz-webgl", {alpha: false});

    if (!isObjectAssigned(this._gl)) {
        this._logger.warn("WebGL not supported, find a container that does (eg. Chrome, Firefox)");
        return;
    }

    this._canvas = canvas;

    // disable gl functions:
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.DEPTH_TEST);

    gl.blendFuncSeparate(
        gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA,
        gl.ONE, gl.ONE);

    // enable gl functions:
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};

WebGLContext.prototype.getName = function () {
    return SCARLETT.WEBGL;
};

WebGLContext.prototype.getContext = function () {
    return this._gl;
};

WebGLContext.prototype.unload = function () {

};