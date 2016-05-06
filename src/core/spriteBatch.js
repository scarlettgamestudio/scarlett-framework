/**
 * SpriteBatch class
 */
function SpriteBatch(game) {
	if (!isGame(game)) {
		throw error("Cannot create sprite render, the Game object is missing from the parameters");
	}

	// public properties:
	

	// private properties:
	this._game = game;
	this._gl = game.getRenderContext().getContext();
	this._vertexBuffer = this._gl.createBuffer();
	this._texBuffer = this._gl.createBuffer();
	this._transformMatrix = mat4.create();
	this._textureShader = new TextureShader();
	this._sprites = [];
	this._rectangleData = [
		0.0,  0.0,
		1.0,  0.0,
		0.0,  1.0,
		0.0,  1.0,
		1.0,  0.0,
		1.0,  1.0
	];
	this._textureData = [
		0.0,  0.0,
		1.0,  0.0,
		0.0,  1.0,
		0.0,  1.0,
		1.0,  0.0,
		1.0,  1.0
	];
}

SpriteBatch.prototype.clear = function() {
	this._sprites = [];
};

SpriteBatch.prototype.storeSprite = function (sprite) {
	this._sprites.push(sprite);
};

SpriteBatch.prototype.flush = function() {
	if(this._sprites.length == 0) {
		return;
	}

	var gl = this._gl;
	var cameraMatrix = this._game.getActiveCamera().getMatrix();

	this._game.getShaderManager().useShader(this._textureShader);

	// position buffer attribute
	gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._rectangleData), gl.STATIC_DRAW);

	gl.enableVertexAttribArray(this._textureShader.attributes.aVertexPosition);
	gl.vertexAttribPointer(this._textureShader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

	// texture attribute
	gl.bindBuffer(gl.ARRAY_BUFFER, this._texBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._textureData), gl.STATIC_DRAW);
	gl.enableVertexAttribArray(this._textureShader.attributes.aTextureCoord);
	gl.vertexAttribPointer(this._textureShader.attributes.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

	// set uniforms
	gl.uniformMatrix4fv(this._textureShader.uniforms.uMatrix._location, false, cameraMatrix);

	for(var i = 0; i < this._sprites.length; i++) {
		var texture = this._sprites[i].getTexture();
		if(texture && texture.isReady()) {
			var spritePosition = this._sprites[i].transform.getPosition();
			var spriteScale = this._sprites[i].transform.getScale();
			var width = texture.getImageData().width * spriteScale.x;
			var height = texture.getImageData().height * spriteScale.y;

			mat4.identity(this._transformMatrix);
			mat4.translate(this._transformMatrix, this._transformMatrix, [spritePosition.x, spritePosition.y, 0]);
			mat4.scale(this._transformMatrix, this._transformMatrix, [width, height, 0]);

			gl.uniformMatrix4fv(this._textureShader.uniforms.uTransform._location, false, this._transformMatrix);
			//gl.uniform4f(this._primitiveShader.uniforms.uColor._location, this._rectangleColorData[i].r, this._rectangleColorData[i].g, this._rectangleColorData[i].b, this._rectangleColorData[i].a);

			gl.drawArrays(gl.TRIANGLES, 0, 6);
		}
	}

	this.clear();
};

SpriteBatch.prototype.unload = function () {
	gl.deleteBuffer(this._vertexBuffer);
	gl.deleteBuffer(this._texBuffer);

	this._textureShader.unload();
};