import Shader from "./shader";

/**
 * PrimitiveShader Class
 */
export default class PrimitiveShader extends Shader {
  static get shaderContent() {
    return {
      vertex: [
        "attribute vec2 aVertexPosition;",

        "uniform mat4 uMatrix;",
        "uniform mat4 uTransform;",
        "uniform float uPointSize;",

        "void main(void) {",
        "   gl_PointSize = uPointSize;",
        "   gl_Position = " +
          "uMatrix * uTransform * vec4(aVertexPosition, 0.0, 1.0);",
        "}"
      ].join("\n"),
      fragment: [
        "precision mediump float;",

        "uniform vec4 uColor;",

        "void main(void) {",
        "   gl_FragColor = uColor;",
        "}"
      ].join("\n"),
      uniforms: {
        uMatrix: { type: "mat4", value: new Float32Array(16) },
        uTransform: { type: "mat4", value: new Float32Array(16) },
        uColor: [0.0, 0.0, 0.0, 1.0],
        uPointSize: { type: "1i", value: 2 }
      },
      attributes: {
        aVertexPosition: 0
      }
    };
  }

  constructor() {
    let content = PrimitiveShader.shaderContent;

    super(
      content.vertex,
      content.fragment,
      content.uniforms,
      content.attributes
    );
  }
}
