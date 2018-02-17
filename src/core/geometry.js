// @flow

import GameObject from "core/gameObject";
import Shader from "shaders/shader";
import BasicShader from "shaders/basicShader";
import GameManager from "core/gameManager";
import Color from "core/color";

export default class Geometry extends GameObject {
  constructor(
    params: {
      name: string,
      meshVertices: Array<Array<number>>,
      color: Color,
      shader: Shader
    } = {
      name: "Geometry",
      meshVertices: [[0.0, 0.5], [-0.5, -0.5], [0.5, -0.5]],
      color: Color.fromRGBA(0, 0, 0, 1.0),
      shader: new BasicShader()
    }
  ) {
    super(params);
    this._shader = params.shader;
    // flatten the array
    this._triangleVertices = params.meshVertices.reduce((a, b) => a.concat(b));
    this._color = params.color;

    // use text shader

    this._gl = GameManager.renderContext.getContext();
    this._program = this._shader.getProgram();
    this._gl.useProgram(this._program);

    this._vertexBuffer = null;
    this._positionAttribLocation = null;

    this._shader.attributes.aPos = this._shader.attributes.aPos === undefined ? null : this._shader.attributes.aPos;
    this._shader.uniforms.uColor = this._shader.uniforms.uColor === undefined ? null : this._shader.uniforms.uColor;

    this.setup();
  }

  setup() {
    if (this._shader.attributes.aPos !== null) {
      // buffer
      this._vertexBuffer = this._gl.createBuffer();
      this._gl.enableVertexAttribArray(this._shader.attributes.aPos);
      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);
      this._gl.bufferData(this._gl.ARRAY_BUFFER, new Float32Array(this._triangleVertices), this._gl.STATIC_DRAW);
      this._gl.vertexAttribPointer(this._shader.attributes.aPos, 2, this._gl.FLOAT, false, 0, 0);
    }

    if (this._shader.uniforms.uColor !== null) {
      this._gl.uniform4fv(this._shader.uniforms.uColor._location, [
        this._color.r,
        this._color.g,
        this._color.b,
        this._color.a
      ]);
    }
  }

  unload() {
    if (this._vertexBuffer !== null) {
      this._gl.deleteBuffer(this._vertexBuffer);
    }
  }

  render(delta, spritebatch) {
    if (this._shader.attributes.aPos !== null) {
      this._gl.useProgram(this._program);

      this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuffer);
      this._gl.vertexAttribPointer(this._shader.attributes.aPos, 2, this._gl.FLOAT, false, 0, 0);
      this._gl.enableVertexAttribArray(this._shader.attributes.aPos);

      this._gl.drawArrays(this._gl.TRIANGLES, 0, this._triangleVertices.length / 2);
    }
    super.render(delta, spritebatch);
  }
}
