/**
 * PrimitiveRender class for on demand direct drawing
 */
var PrimitiveRender = (function () {

    // private properties
    var _this = {};

    /**
     * @constructor
     */
    function PrimitiveRender(game) {
        if (!isGame(game)) {
            throw error("Cannot create primitive render, the Game object is missing from the parameters");
        }

        // public properties:


        // private properties:
        _this.game = game;
        _this.gl = game.getRenderContext().getContext();
        _this.primitiveShader = new PrimitiveShader();
        _this.vertexBuffer = _this.gl.createBuffer();
        _this.colorBuffer = _this.gl.createBuffer();
    }

    PrimitiveRender.prototype.unload = function () {
        gl.deleteBuffer(_this.vertexBuffer);
        gl.deleteBuffer(_this.colorBuffer);

        _this = null;
    };

    PrimitiveRender.prototype.drawPoint = function (vector, size, color) {
        var gl = _this.gl;

        // FIXME: improve the following code and add size functionality
        var colorArr = new Float32Array(color.toArray());

        var vertices = [
            vector.x, vector.y, 0.0
        ];

        _this.game.getShaderManager().useShader(_this.primitiveShader);

        // position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(_this.primitiveShader.attributes.aVertexPosition);
        gl.vertexAttribPointer(_this.primitiveShader.attributes.aVertexPosition, 3, _this.gl.FLOAT, false, 0, 0);

        // color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colorArr, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(_this.primitiveShader.attributes.aColor);
        gl.vertexAttribPointer(_this.primitiveShader.attributes.aColor, 4, _this.gl.FLOAT, false, 0, 0);

        // set uniforms
        gl.uniformMatrix4fv(_this.primitiveShader.uniforms.uMatrix._location, false, _this.game.getActiveCamera().getMatrix());

        gl.drawArrays(gl.POINTS, 0, 1);
    };

    PrimitiveRender.prototype.drawRectangle = function (rectangle, color) {
        var gl = _this.gl;

        // FIXME: improve the following code
        var colorArr = new Float32Array(color.toArray().concat(color.toArray()).concat(color.toArray()).concat(color.toArray()));

        var vertices = [
            rectangle.x, rectangle.y, 0.0,                                              // TOP LEFT
            rectangle.x, rectangle.y + rectangle.height, 0.0,                           // BOTTOM LEFT
            rectangle.x + rectangle.width, rectangle.y, 0.0,                        // TOP RIGHT
            rectangle.x + rectangle.width, rectangle.y + rectangle.height, 0.0        // BOTTOM RIGHT
        ];

        _this.game.getShaderManager().useShader(_this.primitiveShader);

        // position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(_this.primitiveShader.attributes.aVertexPosition);
        gl.vertexAttribPointer(_this.primitiveShader.attributes.aVertexPosition, 3, _this.gl.FLOAT, false, 0, 0);

        // color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colorArr, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(_this.primitiveShader.attributes.aColor);
        gl.vertexAttribPointer(_this.primitiveShader.attributes.aColor, 4, _this.gl.FLOAT, false, 0, 0);

        // set uniforms
        gl.uniformMatrix4fv(_this.primitiveShader.uniforms.uMatrix._location, false, _this.game.getActiveCamera().getMatrix());

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    PrimitiveRender.prototype.drawLine = function (vectorA, vectorB, thickness, color) {
        var gl = _this.gl;

        // FIXME: improve the following code
        var colorArr = new Float32Array(color.toArray().concat(color.toArray()));

        var vertices = [
            vectorA.x, vectorA.y, 0.0,
            vectorB.x, vectorB.y, 0.0
        ];

        _this.game.getShaderManager().useShader(_this.primitiveShader);

        gl.lineWidth(thickness);

        // position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(_this.primitiveShader.attributes.aVertexPosition);
        gl.vertexAttribPointer(_this.primitiveShader.attributes.aVertexPosition, 3, _this.gl.FLOAT, false, 0, 0);

        // color buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colorArr, gl.STATIC_DRAW);

        gl.enableVertexAttribArray(_this.primitiveShader.attributes.aColor);
        gl.vertexAttribPointer(_this.primitiveShader.attributes.aColor, 4, _this.gl.FLOAT, false, 0, 0);

        // set uniforms
        gl.uniformMatrix4fv(_this.primitiveShader.uniforms.uMatrix._location, false, _this.game.getActiveCamera().getMatrix());

        gl.drawArrays(gl.LINES, 0, 2);
    };

    return PrimitiveRender;

})();