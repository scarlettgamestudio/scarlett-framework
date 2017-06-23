import Shader from "./shader";

/**
 * TextureShader Class
 */
export default class TextureShader extends Shader {
  static get shaderContent() {
    return {
      vertex: [
        "precision mediump float;",

        "attribute vec2 aVertexPosition;",
        "attribute vec2 aTextureCoord;",

        "attribute vec4 aColor;",

        "uniform mat4 uMatrix;",

        "varying vec2 vTextureCoord;",
        "varying vec4 vColor;",

        "void main(void) {",
        "   vTextureCoord = aTextureCoord;",
        "   gl_Position = uMatrix * vec4(aVertexPosition, 0.0, 1.0);",
        "   vColor = aColor;",
        "}"
      ].join("\n"),
      fragment: [
        "precision mediump float;",

        "varying vec2 vTextureCoord;",
        "varying vec4 vColor;",

        "uniform sampler2D uSampler;",

        "void main(void){",
        "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;",
        "}"
      ].join("\n"),
      uniforms: {
        uSampler: { type: "tex", value: 0 },
        uMatrix: { type: "mat4", value: new Float32Array(16) }
      },
      attributes: {
        aVertexPosition: -1,
        aTextureCoord: -1,
        aColor: -1
      }
    };
  }

  constructor() {
    let content = TextureShader.shaderContent;

    super(content.vertex, content.fragment, content.uniforms, content.attributes);
  }
}
