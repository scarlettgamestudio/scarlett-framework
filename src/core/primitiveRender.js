/**
 * PrimitiveRender class for on demand direct drawing
 */
function PrimitiveRender(game) {
    if (!isGame(game)) {
        throw error("Cannot create primitive render, the Game object is missing from the parameters");
    }

    // public properties:


    // private properties:
    this._game = game;
    this._gl = game.getRenderContext().getContext();
    this._primitiveShader = new PrimitiveShader();
    this._vertexBuffer = this._gl.createBuffer();
    this._transformMatrix = mat4.create();
}

PrimitiveRender.prototype.unload = function () {
    gl.deleteBuffer(this._vertexBuffer);
    gl.deleteBuffer(this._colorBuffer);

    this._primitiveShader.unload();
};

PrimitiveRender.prototype.drawPoint = function (vector, size, color) {
    var gl = this._gl;

    var vertices = [
        0.0, 0.0, 0.0
    ];

    this._game.getShaderManager().useShader(this._primitiveShader);

    // position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this._primitiveShader.attributes.aVertexPosition);
    gl.vertexAttribPointer(this._primitiveShader.attributes.aVertexPosition, 3, this._gl.FLOAT, false, 0, 0);

    // calculate transformation matrix:
    mat4.identity(this._transformMatrix);
    mat4.translate(this._transformMatrix, this._transformMatrix, [vector.x, vector.y, 0]);

    // set uniforms
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uMatrix._location, false, this._game.getActiveCamera().getMatrix());
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uTransform._location, false, this._transformMatrix);
    gl.uniform4f(this._primitiveShader.uniforms.uColor._location, color.r, color.g, color.b, color.a);
    gl.uniform1f(this._primitiveShader.uniforms.uPointSize._location, size);

    gl.drawArrays(gl.POINTS, 0, 1);
};

PrimitiveRender.prototype.drawRectangle = function (rectangle, color) {
    var gl = this._gl;

    var vertices = [
        0.0, 1.0, 0.0,                                              // TOP LEFT
        0.0, 0.0, 0.0,                                              // BOTTOM LEFT
        1.0, 0.0, 0.0,                                              // BOTTOM RIGHT

        1.0, 1.0, 0.0,                                              // TOP RIGHT
        0.0, 1.0, 0.0,                                              // TOP LEFT
        1.0, 0.0, 0.0                                               // BOTTOM RIGHT
    ];

    this._game.getShaderManager().useShader(this._primitiveShader);

    // position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this._primitiveShader.attributes.aVertexPosition);
    gl.vertexAttribPointer(this._primitiveShader.attributes.aVertexPosition, 3, this._gl.FLOAT, false, 0, 0);

    // calculate transformation matrix:
    mat4.identity(this._transformMatrix);
    mat4.translate(this._transformMatrix, this._transformMatrix, [rectangle.x, rectangle.y, 0]);
    mat4.scale(this._transformMatrix, this._transformMatrix, [rectangle.width, rectangle.height, 0]);

    // set uniforms
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uMatrix._location, false, this._game.getActiveCamera().getMatrix());
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uTransform._location, false, this._transformMatrix);
    gl.uniform4f(this._primitiveShader.uniforms.uColor._location, color.r, color.g, color.b, color.a);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
};

PrimitiveRender.prototype.drawLine = function (vectorA, vectorB, thickness, color) {

};