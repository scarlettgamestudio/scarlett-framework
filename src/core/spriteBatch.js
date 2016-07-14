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
	this._lastTexUID = -1;
	this._drawData = [];
	this._rectangleData = new Float32Array([
		0.0,  0.0,
		1.0,  0.0,
		0.0,  1.0,
		0.0,  1.0,
		1.0,  0.0,
		1.0,  1.0
	]);
	this._textureData = new Float32Array([
		0.0,  0.0,
		1.0,  0.0,
		0.0,  1.0,
		0.0,  1.0,
		1.0,  0.0,
		1.0,  1.0
	]);
}

SpriteBatch.prototype.clear = function() {
	this._drawData = [];
};

SpriteBatch.prototype.storeSprite = function (sprite) {
	this._drawData.push({
		texture: sprite.getTexture(),
		x: sprite.transform.getPosition().x,
		y: sprite.transform.getPosition().y,
		scaleX: sprite.transform.getScale().x,
		scaleY: sprite.transform.getScale().y,
		rotation: sprite.transform.getRotation()
	});
};

SpriteBatch.prototype.store = function(texture, x, y, scaleX, scaleY, rotation) {
	this._drawData.push({
		texture: texture,
		x: x,
		y: y,
		scaleX: scaleX,
		scaleY: scaleY,
		rotation: rotation
	});
};

SpriteBatch.prototype.flush = function() {
	if(this._drawData.length == 0) {
		return;
	}

	var gl = this._gl;
	var cameraMatrix = this._game.getActiveCamera().getMatrix();

	this._game.getShaderManager().useShader(this._textureShader);

	// position buffer attribute
	gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this._rectangleData, gl.STATIC_DRAW);

	gl.enableVertexAttribArray(this._textureShader.attributes.aVertexPosition);
	gl.vertexAttribPointer(this._textureShader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

	// texture attribute
	gl.bindBuffer(gl.ARRAY_BUFFER, this._texBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, this._textureData, gl.STATIC_DRAW);
	gl.enableVertexAttribArray(this._textureShader.attributes.aTextureCoord);
	gl.vertexAttribPointer(this._textureShader.attributes.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

	// set uniforms
	gl.uniformMatrix4fv(this._textureShader.uniforms.uMatrix._location, false, cameraMatrix);

	for(var i = 0; i < this._drawData.length; i++) {
		var texture = this._drawData[i].texture;
		if(texture && texture.isReady()) {

			// for performance sake, consider if the texture is the same so we don't need to bind again
			// TODO: maybe it's a good idea to group the textures somehow (depth should be considered)
			if(this._lastTexUID != texture.getUID()) {
				texture.bind();
				this._lastTexUID = texture.getUID();
			}

			var width = texture.getImageData().width * this._drawData[i].scaleX;
			var height = texture.getImageData().height * this._drawData[i].scaleY;

			mat4.identity(this._transformMatrix);
			mat4.translate(this._transformMatrix, this._transformMatrix, [this._drawData[i].x, this._drawData[i].y, 0]);
			mat4.translate(this._transformMatrix, this._transformMatrix, [width/2, height/2, 0]);
			mat4.rotate(this._transformMatrix, this._transformMatrix, this._drawData[i].rotation, [0.0, 0.0, 1.0]);
			mat4.translate(this._transformMatrix, this._transformMatrix, [-width/2, -height/2, 0]);
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