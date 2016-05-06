/**
 * PrimitiveBatch class for on demand direct drawing
 */
function PrimitiveBatch(game) {
	if (!isGame(game)) {
		throw error("Cannot create primitive render, the Game object is missing from the parameters");
	}

	// public properties:


	// private properties:
	this._game = game;
	this._gl = game.getRenderContext().getContext();
	this._primitiveShader = new PrimitiveShader();
	this._vertexBuffer = this._gl.createBuffer();
	this._colorBuffer = this._gl.createBuffer();

	this._rectangleVertexData = [];
	this._rectangleColorData = [];
	this._rectangleCount = 0;
	this._transformMatrix = mat4.create();
	this._rectangleData = [
		0.0,  0.0,
		1.0,  0.0,
		0.0,  1.0,
		0.0,  1.0,
		1.0,  0.0,
		1.0,  1.0
	];
}

PrimitiveBatch.prototype.unload = function () {
	gl.deleteBuffer(this._vertexBuffer);
	gl.deleteBuffer(this._colorBuffer);

	this._primitiveShader.unload();
};

PrimitiveBatch.prototype.begin = function() {
	var gl = this._gl;

	// bind buffers
	//gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
};

PrimitiveBatch.prototype.clear = function() {
	this._rectangleVertexData = [];
	this._rectangleColorData = [];
	this._rectangleCount = 0;
};

PrimitiveBatch.prototype.flush = function() {
	var gl = this._gl;
	var cameraMatrix = this._game.getActiveCamera().getMatrix();

	this._game.getShaderManager().useShader(this._primitiveShader);

	// draw rectangles?
	if(this._rectangleCount > 0) {
		// position buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._rectangleData), gl.STATIC_DRAW);

		gl.enableVertexAttribArray(this._primitiveShader.attributes.aVertexPosition);
		gl.vertexAttribPointer(this._primitiveShader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

		// set uniforms
		gl.uniformMatrix4fv(this._primitiveShader.uniforms.uMatrix._location, false, cameraMatrix);

		for(var i = 0; i < this._rectangleCount; i++) {
			mat4.identity(this._transformMatrix);
			mat4.translate(this._transformMatrix, this._transformMatrix, [this._rectangleVertexData[i].x, this._rectangleVertexData[i].y, 0]);
			mat4.scale(this._transformMatrix, this._transformMatrix, [this._rectangleVertexData[i].width, this._rectangleVertexData[i].height, 0]);

			gl.uniformMatrix4fv(this._primitiveShader.uniforms.uTransform._location, false, this._transformMatrix);
			gl.uniform4f(this._primitiveShader.uniforms.uColor._location, this._rectangleColorData[i].r, this._rectangleColorData[i].g, this._rectangleColorData[i].b, this._rectangleColorData[i].a);

			gl.drawArrays(gl.TRIANGLES, 0, 6);
		}
	}

	this.clear();
};

PrimitiveBatch.prototype.drawPoint = function (vector, size, color) {

};

PrimitiveBatch.prototype.storeRectangle = function (rectangle, color) {
	this._rectangleColorData.push(color);
	this._rectangleVertexData.push(rectangle);
	this._rectangleCount++;
};

PrimitiveBatch.prototype.drawLine = function (vectorA, vectorB, thickness, color) {

};