/**
 * SpriteBatch class
 */
class SpriteBatch {

    //#region Constructors

    constructor(game) {
        if (!isGame(game)) {
            throw new Error("Cannot create sprite render, the Game object is missing from the parameters");
        }

        // private properties:
        this._game = game;
        this._gl = game.getRenderContext().getContext();
        this._vertexBuffer = this._gl.createBuffer();
        this._texBuffer = this._gl.createBuffer();
        this._textureShader = new TextureShader();
        this._sprites = [];
        this._rectangleData = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0
        ]);
        /*

         Texture coordinates in WebGL goes like this:

         0,1----1,1
         #--------#
         #--------#
         #--------#
         0,0----1,0

         */
        this._textureData = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0
        ]);
    }

    //#endregion

    //#region Methods

    clear() {
        this._sprites = [];
    }

    storeSprite(sprite) {
        this._sprites.push(sprite);
    }

    flush() {
        if (this._sprites.length === 0) {
            return;
        }

        let gl = this._gl;
        let cameraMatrix = this._game.getActiveCamera().getMatrix();
        let lastTextureId = -1, texture, tint;

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

        for (let i = 0; i < this._sprites.length; i++) {
            texture = this._sprites[i].getTexture();

            if (texture && texture.isReady()) {
                tint = this._sprites[i].getTint();

                // for performance sake, consider if the texture is the same so we don't need to bind again
                // TODO: maybe it's a good idea to group the textures somehow (depth should be considered)
                // TODO: correct this when using textures outside spritebatch...
                if (lastTextureId !== texture.getUID()) {
                    texture.bind();
                    lastTextureId = texture.getUID();
                }

                // TODO: fix wrap modes:
                switch (this._sprites[i].getWrapMode()) {
                    case WrapMode.REPEAT:
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
                        break;

                    case WrapMode.CLAMP:
                    default:
                        break;
                }

                gl.uniformMatrix4fv(this._textureShader.uniforms.uTransform._location, false, this._sprites[i].getMatrix());

                if (tint) {
                    gl.uniform4f(this._textureShader.uniforms.uColor._location, tint.r, tint.g, tint.b, tint.a);
                }

                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }
        }

        this.clear();
    }

    unload() {
        this._gl.deleteBuffer(this._vertexBuffer);
        this._gl.deleteBuffer(this._texBuffer);

        this._textureShader.unload();
    }

    //#endregion

}