import PrimitiveShader from "shaders/primitiveShader";
import Utils from "utility/utils";

export default class PrimitiveBatch {
  /**
   * 
   * @param {Game} game 
   */
  constructor(game) {
    if (!Utils.isGame(game)) {
      throw new Error("Cannot create primitive render the Game object is missing from the parameters");
    }

    this._game = game;
    this._gl = game.getRenderContext().getContext();
    this._shader = new PrimitiveShader();

    this._renderBuffer = this._gl.createBuffer();

    this._lineMaxPerBatch = 2048;
    this._lineSingleDataLength = 12;
    this._lineStride = 24;
    this._lineData = new Float32Array(this._lineMaxPerBatch * this._lineSingleDataLength);
    this._lineDataIdx = 0;

    this._rectangleMaxPerBatch = 2048;
    this._rectangleSingleDataLength = 36;
    this._rectangleStride = 24;
    this._rectangleData = new Float32Array(this._rectangleMaxPerBatch * this._rectangleSingleDataLength);
    this._rectangleDataIdx = 0;
  }

  unload() {
    // delete buffers and unload shaders:
    this._gl.deleteBuffer(this._renderBuffer);

    this._shader.unload();
  }

  begin() {
    this._clear();
  }

  _clear() {
    this._lineDataIdx = 0;
    this._rectangleDataIdx = 0;
  }

  storeRectangle(rectangle, color) {
    let topLeftX = rectangle.x;
    let topLeftY = rectangle.y;
    let topRightX = rectangle.x + rectangle.width;
    let topRightY = rectangle.y;
    let bottomLeftX = rectangle.x;
    let bottomLeftY = rectangle.y + rectangle.height;
    let bottomRightX = rectangle.x + rectangle.width;
    let bottomRightY = rectangle.y + rectangle.height;

    this._rectangleData[this._rectangleDataIdx++] = bottomLeftX;
    this._rectangleData[this._rectangleDataIdx++] = bottomLeftY;
    this._rectangleData[this._rectangleDataIdx++] = color.r;
    this._rectangleData[this._rectangleDataIdx++] = color.g;
    this._rectangleData[this._rectangleDataIdx++] = color.b;
    this._rectangleData[this._rectangleDataIdx++] = color.a;

    this._rectangleData[this._rectangleDataIdx++] = bottomRightX;
    this._rectangleData[this._rectangleDataIdx++] = bottomRightY;
    this._rectangleData[this._rectangleDataIdx++] = color.r;
    this._rectangleData[this._rectangleDataIdx++] = color.g;
    this._rectangleData[this._rectangleDataIdx++] = color.b;
    this._rectangleData[this._rectangleDataIdx++] = color.a;

    this._rectangleData[this._rectangleDataIdx++] = topLeftX;
    this._rectangleData[this._rectangleDataIdx++] = topLeftY;
    this._rectangleData[this._rectangleDataIdx++] = color.r;
    this._rectangleData[this._rectangleDataIdx++] = color.g;
    this._rectangleData[this._rectangleDataIdx++] = color.b;
    this._rectangleData[this._rectangleDataIdx++] = color.a;

    this._rectangleData[this._rectangleDataIdx++] = topLeftX;
    this._rectangleData[this._rectangleDataIdx++] = topLeftY;
    this._rectangleData[this._rectangleDataIdx++] = color.r;
    this._rectangleData[this._rectangleDataIdx++] = color.g;
    this._rectangleData[this._rectangleDataIdx++] = color.b;
    this._rectangleData[this._rectangleDataIdx++] = color.a;

    this._rectangleData[this._rectangleDataIdx++] = bottomRightX;
    this._rectangleData[this._rectangleDataIdx++] = bottomRightY;
    this._rectangleData[this._rectangleDataIdx++] = color.r;
    this._rectangleData[this._rectangleDataIdx++] = color.g;
    this._rectangleData[this._rectangleDataIdx++] = color.b;
    this._rectangleData[this._rectangleDataIdx++] = color.a;

    this._rectangleData[this._rectangleDataIdx++] = topRightX;
    this._rectangleData[this._rectangleDataIdx++] = topRightY;
    this._rectangleData[this._rectangleDataIdx++] = color.r;
    this._rectangleData[this._rectangleDataIdx++] = color.g;
    this._rectangleData[this._rectangleDataIdx++] = color.b;
    this._rectangleData[this._rectangleDataIdx++] = color.a;

    if (this._rectangleDataIdx >= this._rectangleData.length) {
      this._flushRectangles();
    }
  }

  _flushRectangles() {
    if (this._rectangleDataIdx === 0) {
      // nothing to do..
      return;
    }

    let gl = this._gl;
    let vertexCount = this._rectangleDataIdx / this._rectangleSingleDataLength;

    gl.bufferData(gl.ARRAY_BUFFER, this._rectangleData, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this._shader.attributes.aVertexPosition);
    gl.vertexAttribPointer(this._shader.attributes.aVertexPosition, 2, gl.FLOAT, false, this._rectangleStride, 0);

    gl.enableVertexAttribArray(this._shader.attributes.aVertexColorPosition);
    gl.vertexAttribPointer(this._shader.attributes.aVertexColorPosition, 4, gl.FLOAT, true, this._rectangleStride, 8);

    gl.drawArrays(gl.TRIANGLES, 0, vertexCount * 6);

    this._rectangleDataIdx = 0;
  }

  storeLine(vectorA, vectorB, colorA, colorB) {
    // first point..
    this._lineData[this._lineDataIdx++] = vectorA.x;
    this._lineData[this._lineDataIdx++] = vectorA.y;
    this._lineData[this._lineDataIdx++] = colorA.r;
    this._lineData[this._lineDataIdx++] = colorA.g;
    this._lineData[this._lineDataIdx++] = colorA.b;
    this._lineData[this._lineDataIdx++] = colorA.a;

    // second point..
    this._lineData[this._lineDataIdx++] = vectorB.x;
    this._lineData[this._lineDataIdx++] = vectorB.y;
    this._lineData[this._lineDataIdx++] = colorB.r;
    this._lineData[this._lineDataIdx++] = colorB.g;
    this._lineData[this._lineDataIdx++] = colorB.b;
    this._lineData[this._lineDataIdx++] = colorB.a;

    if (this._lineDataIdx >= this._lineData.length) {
      this._flushLines();
    }
  }

  _flushLines() {
    if (this._lineDataIdx === 0) {
      // nothing to do..
      return;
    }

    let gl = this._gl;
    let vertexCount = this._lineDataIdx / this._lineSingleDataLength;

    gl.bufferData(gl.ARRAY_BUFFER, this._lineData, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this._shader.attributes.aVertexPosition);
    gl.vertexAttribPointer(this._shader.attributes.aVertexPosition, 2, gl.FLOAT, false, this._lineStride, 0);

    gl.enableVertexAttribArray(this._shader.attributes.aVertexColorPosition);
    gl.vertexAttribPointer(this._shader.attributes.aVertexColorPosition, 4, gl.FLOAT, true, this._lineStride, 8);

    gl.drawArrays(gl.LINES, 0, vertexCount * 2);

    this._lineDataIdx = 0;
  }

  flush() {
    let gl = this._gl;

    this._game.getShaderManager().useShader(this._shader);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._renderBuffer);

    // camera matrix uniform
    gl.uniformMatrix4fv(this._shader.uniforms.uMatrix._location, false, this._game.getActiveCamera().getMatrix());

    this._flushLines();
    this._flushRectangles();
  }
}
