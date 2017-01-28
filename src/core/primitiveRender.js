/**
 * PrimitiveRender class for on demand direct drawing
 */
function PrimitiveRender(game) {
    if (!isGame(game)) {
        throw "Cannot create primitive render, the Game object is missing from the parameters";
    }

    // public properties:


    // private properties:
    this._game = game;
    this._gl = game.getRenderContext().getContext();
    this._primitiveShader = new PrimitiveShader();
    this._vertexBuffer = this._gl.createBuffer();
    this._transformMatrix = mat4.create();
    this._rectangleData = new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0
    ]);
    this._pointData = new Float32Array([
        0.0, 0.0
    ]);
}

PrimitiveRender.prototype.unload = function () {
    gl.deleteBuffer(this._vertexBuffer);

    this._primitiveShader.unload();
};

PrimitiveRender.prototype.drawPoint = function (vector, size, color) {
    // TODO: refactor this method
    var gl = this._gl;

    this._game.getShaderManager().useShader(this._primitiveShader);

    // position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._pointData, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this._primitiveShader.attributes.aVertexPosition);
    gl.vertexAttribPointer(this._primitiveShader.attributes.aVertexPosition, 2, this._gl.FLOAT, false, 0, 0);

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

PrimitiveRender.prototype.drawTriangle = function (vectorA, vectorB, vectorC, color) {
    var gl = this._gl;
    var transformMatrix = this._transformMatrix;

    this._game.getShaderManager().useShader(this._primitiveShader);

    var triangleData = new Float32Array([
        vectorA.x, vectorA.y,
        vectorB.x, vectorB.y,
        vectorC.x, vectorC.y
    ]);

    // position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleData, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this._primitiveShader.attributes.aVertexPosition);
    gl.vertexAttribPointer(this._primitiveShader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    // calculate transformation matrix (if not provided):
    mat4.identity(transformMatrix);

    // set uniforms
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uMatrix._location, false, this._game.getActiveCamera().getMatrix());
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uTransform._location, false, transformMatrix);
    gl.uniform4f(this._primitiveShader.uniforms.uColor._location, color.r, color.g, color.b, color.a);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
};

PrimitiveRender.prototype.drawCircle = function (position, radius, iterations, color) {
    var gl = this._gl;

    this._game.getShaderManager().useShader(this._primitiveShader);

    var triangleData = [];
    for (var i = 0; i < iterations; i++) {
        triangleData.push(position.x + (radius * Math.cos(i * MathHelper.PI2 / iterations)));
        triangleData.push(position.y + (radius * Math.sin(i * MathHelper.PI2 / iterations)));
    }
    triangleData = new Float32Array(triangleData);

    // position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangleData, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this._primitiveShader.attributes.aVertexPosition);
    gl.vertexAttribPointer(this._primitiveShader.attributes.aVertexPosition, 2, this._gl.FLOAT, false, 0, 0);

    mat4.identity(this._transformMatrix);

    // set uniforms
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uMatrix._location, false, this._game.getActiveCamera().getMatrix());
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uTransform._location, false, this._transformMatrix);
    gl.uniform4f(this._primitiveShader.uniforms.uColor._location, color.r, color.g, color.b, color.a);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, iterations);
};

PrimitiveRender.prototype.drawRectangle = function (rectangle, color, rotation) {
    var gl = this._gl;
    var transformMatrix = this._transformMatrix;

    this._game.getShaderManager().useShader(this._primitiveShader);

    // position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._rectangleData, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this._primitiveShader.attributes.aVertexPosition);
    gl.vertexAttribPointer(this._primitiveShader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    // calculate transformation matrix (if not provided):
    mat4.identity(transformMatrix);
    mat4.translate(transformMatrix, transformMatrix, [rectangle.x, rectangle.y, 0]);

    // rotate the rectangle?
    if (rotation) {
        mat4.translate(transformMatrix, transformMatrix, [rectangle.width / 2, rectangle.height / 2, 0]);
        mat4.rotate(transformMatrix, transformMatrix, rotation, [0.0, 0.0, 1.0]);
        mat4.translate(transformMatrix, transformMatrix, [-rectangle.width / 2, -rectangle.height / 2, 0]);
    }

    mat4.scale(transformMatrix, transformMatrix, [rectangle.width, rectangle.height, 0]);

    // set uniforms
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uMatrix._location, false, this._game.getActiveCamera().getMatrix());
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uTransform._location, false, transformMatrix);
    gl.uniform4f(this._primitiveShader.uniforms.uColor._location, color.r, color.g, color.b, color.a);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
};

PrimitiveRender.prototype.drawRectangleFromMatrix = function (matrix, color) {
    var gl = this._gl;

    this._game.getShaderManager().useShader(this._primitiveShader);

    // position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this._rectangleData, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this._primitiveShader.attributes.aVertexPosition);
    gl.vertexAttribPointer(this._primitiveShader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    // set uniforms
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uMatrix._location, false, this._game.getActiveCamera().getMatrix());
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uTransform._location, false, matrix);
    gl.uniform4f(this._primitiveShader.uniforms.uColor._location, color.r, color.g, color.b, color.a);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
};

PrimitiveRender.prototype.drawLine = function (vectorA, vectorB, thickness, color) {
    var gl = this._gl;
    //gl.lineWidth(thickness); // not all implementations support this

    this._game.getShaderManager().useShader(this._primitiveShader);

    var pointData = new Float32Array([
        vectorA.x, vectorA.y,
        vectorB.x, vectorB.y
    ]);

    // position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointData, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this._primitiveShader.attributes.aVertexPosition);
    gl.vertexAttribPointer(this._primitiveShader.attributes.aVertexPosition, 2, this._gl.FLOAT, false, 0, 0);

    mat4.identity(this._transformMatrix);

    // set uniforms
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uMatrix._location, false, this._game.getActiveCamera().getMatrix());
    gl.uniformMatrix4fv(this._primitiveShader.uniforms.uTransform._location, false, this._transformMatrix);
    gl.uniform4f(this._primitiveShader.uniforms.uColor._location, color.r, color.g, color.b, color.a);

    gl.drawArrays(gl.LINES, 0, 2);
};