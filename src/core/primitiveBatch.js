import { isGame } from "common/utils";
import PrimitiveShader from "shaders/primitiveShader.shader";
import Matrix4 from "math/matrix4";

/**
 * PrimitiveBatch class for on demand direct drawing
 */
export default class PrimitiveBatch {
  //#region Constructors

  /**
     *
     * @param game
     */
  constructor(game) {
    if (!isGame(game)) {
      throw new Error(
        "Cannot create primitive render, " +
          "the Game object is missing from the parameters"
      );
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

    this._transformMatrix = new Matrix4();
    this._rectangleData = new Float32Array([
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      1.0,
      1.0,
      0.0,
      1.0,
      1.0
    ]);
  }

  //#endregion

  //#region Methods

  unload() {
    this._gl.deleteBuffer(this._vertexBuffer);
    this._gl.deleteBuffer(this._colorBuffer);

    this._primitiveShader.unload();
  }

  begin() {
    //let gl = this._gl;
    // bind buffers
    //gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
  }

  clear() {
    this._rectangleVertexData = [];
    this._rectangleColorData = [];
    this._rectangleCount = 0;
  }

  flush() {
    let gl = this._gl;
    let cameraMatrix = this._game.getActiveCamera().getMatrix();

    this._game.getShaderManager().useShader(this._primitiveShader);

    // draw rectangles?
    if (this._rectangleCount > 0) {
      // position buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, this._rectangleData, gl.STATIC_DRAW);

      gl.enableVertexAttribArray(
        this._primitiveShader.attributes.aVertexPosition
      );
      gl.vertexAttribPointer(
        this._primitiveShader.attributes.aVertexPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );

      // set uniforms
      gl.uniformMatrix4fv(
        this._primitiveShader.uniforms.uMatrix._location,
        false,
        cameraMatrix
      );

      for (let i = 0; i < this._rectangleCount; i++) {
        this._transformMatrix.identity();
        this._transformMatrix.translate([
          this._rectangleVertexData[i].x,
          this._rectangleVertexData[i].y,
          0
        ]);
        this._transformMatrix.scale([
          this._rectangleVertexData[i].width,
          this._rectangleVertexData[i].height,
          0
        ]);

        gl.uniformMatrix4fv(
          this._primitiveShader.uniforms.uTransform._location,
          false,
          this._transformMatrix.asArray()
        );
        gl.uniform4f(
          this._primitiveShader.uniforms.uColor._location,
          this._rectangleColorData[i].r,
          this._rectangleColorData[i].g,
          this._rectangleColorData[i].b,
          this._rectangleColorData[i].a
        );

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    }

    this.clear();
  }

  drawPoint(vector, size, color) {}

  storeRectangle(rectangle, color) {
    this._rectangleColorData.push(color);
    this._rectangleVertexData.push(rectangle);
    this._rectangleCount++;
  }

  drawLine(vectorA, vectorB, thickness, color) {}

  //#endregion
}
