/**
 * SpriteBatch class
 */
class SpriteBatch {

    //#region Constructors

    constructor(game, maxBatchLength) {
        if (!isGame(game)) {
            throw new Error("Cannot create sprite render, the Game object is missing from the parameters");
        }

        // private properties:
        this._game = game;
        this._gl = game.getRenderContext().getContext();
        this._renderBuffer = this._gl.createBuffer();
        this._textureShader = new TextureShader();

        this._spriteData = [];
        this._spriteCount = 0;
        this._stride = 16;
        this._maxBatchLength = maxBatchLength || 4096;

        this._sprites = [];

        /*

         Coordinates in WebGL goes like this:

         0,1----1,1
         #--------#
         #--------#
         #--------#
         0,0----1,0

         */
    }

    //#endregion

    //#region Methods

    clear() {
        this._sprites = [];
        this._spriteData = [];
        this._spriteCount = 0;
    }

    begin() {
        this.clear();
    }

    storeSprite(sprite) {
        this._sprites.push(sprite);
    }

    _process() {
        let magnitude = 1.0;

        for (let i = 0; i < this._sprites.length; i++) {
            let sp = this._sprites[i];
            let spriteMatrix = sp.getMatrix();

            let bottomLeft = Vector2.transformMat4(new Vector2(0, 0), spriteMatrix);
            let bottomRight = Vector2.transformMat4(new Vector2(magnitude, 0), spriteMatrix);
            let topLeft = Vector2.transformMat4(new Vector2(0, magnitude), spriteMatrix);
            let topRight = Vector2.transformMat4(new Vector2(magnitude, magnitude), spriteMatrix);

            //console.log("bottom-left: " + bottomLeft.toString());
            //console.log("bottom-right: " + bottomRight.toString());
            //console.log("top-left: " + topLeft.toString());
            //console.log("top-right: " + topRight.toString());

            this._spriteData.push(bottomLeft.x);
            this._spriteData.push(bottomLeft.y);
            this._spriteData.push(0);
            this._spriteData.push(0);

            this._spriteData.push(bottomRight.x);
            this._spriteData.push(bottomRight.y);
            this._spriteData.push(1);
            this._spriteData.push(0);

            this._spriteData.push(topLeft.x);
            this._spriteData.push(topLeft.y);
            this._spriteData.push(0);
            this._spriteData.push(1);

            this._spriteData.push(topLeft.x);
            this._spriteData.push(topLeft.y);
            this._spriteData.push(0);
            this._spriteData.push(1);

            this._spriteData.push(bottomRight.x);
            this._spriteData.push(bottomRight.y);
            this._spriteData.push(1);
            this._spriteData.push(0);

            this._spriteData.push(topRight.x);
            this._spriteData.push(topRight.y);
            this._spriteData.push(1);
            this._spriteData.push(1);

            this._spriteCount++;
        }
    }

    _renderBatch(renderData, count) {
        let gl = this._gl;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(renderData), gl.STATIC_DRAW);

        // vertex position attribute
        gl.enableVertexAttribArray(this._textureShader.attributes.aVertexPosition);
        gl.vertexAttribPointer(this._textureShader.attributes.aVertexPosition, 2, gl.FLOAT, false, this._stride, 0);

        // texture coordinate attribute
        gl.enableVertexAttribArray(this._textureShader.attributes.aTextureCoord);
        gl.vertexAttribPointer(this._textureShader.attributes.aTextureCoord, 2, gl.FLOAT, false, this._stride, 8);

        gl.drawArrays(gl.TRIANGLES, 0, 6 * count);

        //console.log("rendering..." + count + ":" + renderData.length);
    }

    flush() {
        if (this._sprites.length === 0) {
            return;
        }

        this._process();

        let gl = this._gl;
        let lastTextureId = -1, texture;

        this._game.getShaderManager().useShader(this._textureShader);

        // since this is the only buffer...
        gl.bindBuffer(gl.ARRAY_BUFFER, this._renderBuffer);

        // camera matrix uniform
        gl.uniformMatrix4fv(this._textureShader.uniforms.uMatrix._location, false, this._game.getActiveCamera().getMatrix());

        let renderData = [], count = 0;
        for (let i = 0; i < this._sprites.length; i++) {
            let sp = this._sprites[i];
            texture = sp.getTexture();

            if (texture && texture.isReady() && lastTextureId !== texture.getUID()) {
                if (lastTextureId >= 0) {
                    this._renderBatch(renderData, count);
                }

                count = 0;
                renderData = [];
                texture.bind();
                lastTextureId = texture.getUID();
            }

            count++;
            for (let j = i * 24; j < (i * 24) + (24); j++) {
                renderData.push(this._spriteData[j]);
            }

            // flush?
            if (i === this._sprites.length - 1 || count >= this._maxBatchLength) {
                this._renderBatch(renderData, count);

                count = 0;
                renderData = [];
            }
        }
    }

    unload() {
        // delete buffers and unload shaders:
        this._gl.deleteBuffer(this._renderBuffer);

        this._textureShader.unload();
    }

    //#endregion

}