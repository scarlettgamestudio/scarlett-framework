import TextureShader from "shaders/textureShader";
import Utils from "utility/utils";
import Vector2 from "math/vector2";

/**
 * SpriteBatch class
 */
export default class SpriteBatch {
  //#region Constructors

  constructor(game) {
    if (!Utils.isGame(game)) {
      throw new Error("Cannot create sprite render, the Game object " + "is missing from the parameters");
    }

    // private properties:
    this._game = game;
    this._gl = game.getRenderContext().getContext();
    this._renderBuffer = this._gl.createBuffer();
    this._textureShader = new TextureShader();

    this._stride = 32;
    this._singleDataLength = 48;
    this._maxSpritesPerBatch = 2048;
    this._spriteData = new Float32Array(this._singleDataLength * this._maxSpritesPerBatch);
    this._spriteDataIdx = 0;
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
    this._spriteDataIdx = 0;
  }

  begin() {
    this.clear();
  }

  storeSprite(sprite) {
    this._sprites.push(sprite);
  }

  _storeColor(r, g, b, a) {
    this._spriteData[this._spriteDataIdx++] = r;
    this._spriteData[this._spriteDataIdx++] = g;
    this._spriteData[this._spriteDataIdx++] = b;
    this._spriteData[this._spriteDataIdx++] = a;
  }

  _processSprite(sprite) {
    let magnitude = 1.0;
    let spriteMatrix = sprite.getMatrix();

    let bottomLeft = Vector2.transformMat4(new Vector2(0, 0), spriteMatrix);
    let bottomRight = Vector2.transformMat4(new Vector2(magnitude, 0), spriteMatrix);
    let topLeft = Vector2.transformMat4(new Vector2(0, magnitude), spriteMatrix);
    let topRight = Vector2.transformMat4(new Vector2(magnitude, magnitude), spriteMatrix);

    let tint = sprite.getTint();

    let tintR = tint.r;
    let tintG = tint.g;
    let tintB = tint.b;
    let tintA = tint.a;

    this._spriteData[this._spriteDataIdx++] = bottomLeft.x;
    this._spriteData[this._spriteDataIdx++] = bottomLeft.y;
    this._spriteData[this._spriteDataIdx++] = 0;
    this._spriteData[this._spriteDataIdx++] = 0;
    this._storeColor(tintR, tintG, tintB, tintA);

    this._spriteData[this._spriteDataIdx++] = bottomRight.x;
    this._spriteData[this._spriteDataIdx++] = bottomRight.y;
    this._spriteData[this._spriteDataIdx++] = 1;
    this._spriteData[this._spriteDataIdx++] = 0;
    this._storeColor(tintR, tintG, tintB, tintA);

    this._spriteData[this._spriteDataIdx++] = topLeft.x;
    this._spriteData[this._spriteDataIdx++] = topLeft.y;
    this._spriteData[this._spriteDataIdx++] = 0;
    this._spriteData[this._spriteDataIdx++] = 1;
    this._storeColor(tintR, tintG, tintB, tintA);

    this._spriteData[this._spriteDataIdx++] = topLeft.x;
    this._spriteData[this._spriteDataIdx++] = topLeft.y;
    this._spriteData[this._spriteDataIdx++] = 0;
    this._spriteData[this._spriteDataIdx++] = 1;
    this._storeColor(tintR, tintG, tintB, tintA);

    this._spriteData[this._spriteDataIdx++] = bottomRight.x;
    this._spriteData[this._spriteDataIdx++] = bottomRight.y;
    this._spriteData[this._spriteDataIdx++] = 1;
    this._spriteData[this._spriteDataIdx++] = 0;
    this._storeColor(tintR, tintG, tintB, tintA);

    this._spriteData[this._spriteDataIdx++] = topRight.x;
    this._spriteData[this._spriteDataIdx++] = topRight.y;
    this._spriteData[this._spriteDataIdx++] = 1;
    this._spriteData[this._spriteDataIdx++] = 1;
    this._storeColor(tintR, tintG, tintB, tintA);
  }

  _renderBatch() {
    if (this._spriteDataIdx === 0) {
      // nothing to do..
      return;
    }

    let gl = this._gl;

    gl.bufferData(gl.ARRAY_BUFFER, this._spriteData, gl.STATIC_DRAW);

    // vertex position attribute
    gl.enableVertexAttribArray(this._textureShader.attributes.aVertexPosition);
    gl.vertexAttribPointer(this._textureShader.attributes.aVertexPosition, 2, gl.FLOAT, false, this._stride, 0);

    // texture coordinate attribute
    gl.enableVertexAttribArray(this._textureShader.attributes.aTextureCoord);
    gl.vertexAttribPointer(this._textureShader.attributes.aTextureCoord, 2, gl.FLOAT, false, this._stride, 8);

    gl.enableVertexAttribArray(this._textureShader.attributes.aColor);
    gl.vertexAttribPointer(this._textureShader.attributes.aColor, 4, gl.FLOAT, false, this._stride, 16);

    gl.drawArrays(gl.TRIANGLES, 0, 6 * (this._spriteDataIdx / this._singleDataLength));

    this._spriteDataIdx = 0;
  }

  flush() {
    if (this._sprites.length === 0) {
      return;
    }

    let gl = this._gl;
    let lastTextureId = -1;
    let count = 0;
    let sprite;
    let texture;

    this._game.getShaderManager().useShader(this._textureShader);

    // since this is the only buffer...
    gl.bindBuffer(gl.ARRAY_BUFFER, this._renderBuffer);

    // camera matrix uniform
    gl.uniformMatrix4fv(
      this._textureShader.uniforms.uMatrix._location,
      false,
      this._game.getActiveCamera().getMatrix()
    );

    for (let i = 0; i < this._sprites.length; i++) {
      sprite = this._sprites[i];
      texture = sprite.getTexture();

      if (texture != null && texture.isReady()) {
        if (lastTextureId !== texture.getUID()) {
          // is this the first check?
          if (lastTextureId >= 0) {
            this._renderBatch(count);
            count = 0;
          }

          texture.bind();
          lastTextureId = texture.getUID();
        }

        this._processSprite(sprite);
        count++;
      }

      if (count >= this._maxSpritesPerBatch || i === this._sprites.length - 1) {
        this._renderBatch(count);
        count = 0;
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
