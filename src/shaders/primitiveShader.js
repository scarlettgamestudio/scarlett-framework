import Shader from "./shader";

/**
 * PrimitiveShader Class
 */
export default class PrimitiveShader extends Shader {
  static get shaderContent() {
    return {
      vertex: [
        "attribute vec2 aVertexPosition;",
        "attribute vec4 aVertexColorPosition;",

        "uniform mat4 uMatrix;",
        "uniform float uPointSize;",

        "varying vec4 vColor;",

        "void main(void) {",
        "   vColor = aVertexColorPosition;",
        "   gl_PointSize = uPointSize;",
        "   gl_Position = uMatrix * vec4(aVertexPosition, 0.0, 1.0);",
        "}"
      ].join("\n"),
      fragment: [
        "precision mediump float;",

        "varying vec4 vColor;",

        "void main(void) {",
        "   gl_FragColor = vColor;",
        "}"
      ].join("\n"),
      uniforms: {
        uMatrix: { type: "mat4", value: new Float32Array(16) },
        uPointSize: { type: "1i", value: 2 }
      },
      attributes: {
        aVertexPosition: -1,
        aVertexColorPosition: -1
      }
    };
  }

  constructor() {
    let content = PrimitiveShader.shaderContent;

    super(content.vertex, content.fragment, content.uniforms, content.attributes);
  }
}
