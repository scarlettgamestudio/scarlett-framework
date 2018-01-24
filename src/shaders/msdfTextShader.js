import Shader from "./shader";

/**
 * MSDFTextShader Class
 */
export default class MSDFTextShader extends Shader {
  static get shaderContent() {
    return {
      vertex: [
        "attribute vec2 aPos;",
        "attribute vec2 aTexCoord;",

        "uniform mat4 uMatrix;",
        "uniform mat4 uTransform;",
        "uniform vec2 uTexSize;",

        "varying vec2 vTexCoord;",

        "void main() {",
        "   gl_Position = uMatrix * uTransform * vec4(aPos, 0, 1);",
        "   vTexCoord = aTexCoord / uTexSize;",
        "}"
      ].join("\n"),
      fragment: [
        "#ifdef GL_OES_standard_derivatives",
        "#extension GL_OES_standard_derivatives : enable",
        "#endif",

        "precision highp float;",

        "uniform sampler2D uTexture;",
        "uniform vec4 uColor;",
        "uniform float uGamma;",
        "uniform float uOutlineDistance;",
        "uniform vec4 uOutlineColor;",

        "uniform vec4 uDropShadowColor;",
        "uniform float uDropShadowSmoothing;",
        "uniform vec2 uDropShadowOffset;",

        "uniform float uDebug;",
        "uniform float uDropShadow;",
        "uniform float uOutline;",

        "varying vec2 vTexCoord;",

        "float median(float r, float g, float b) {",
        "return max(min(r, g), min(max(r, g), b));",
        "}",

        "float aastep(float value) {",
        "  #ifdef GL_OES_standard_derivatives",
        "    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;",
        "  #else",
        "    float afwidth = (1.0 / 72.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));",
        "  #endif",
        "  return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);",
        "}",

        "void main() {",
        "vec3 sample = texture2D(uTexture, vTexCoord).rgb;",
        "float sigDist = median(sample.r, sample.g, sample.b) - 0.5;",
        //"float opacity = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);",
        //
        "gl_FragColor = mix(uColor, uOutlineColor, 1.0);",
        "}"
      ].join("\n"),
      uniforms: {
        uMatrix: { type: "mat4", value: new Float32Array(16) },
        uTransform: { type: "mat4", value: new Float32Array(16) },
        uTexture: { type: "tex", value: 0 },
        uTexSize: { type: "1i", value: 24 },
        uColor: [1.0, 0.0, 0.0, 1.0],
        uOutlineColor: [1.0, 1.0, 1.0, 1.0],
        uDropShadowColor: [0.0, 0.0, 0.0, 1.0],
        uDropShadowSmoothing: { type: "1i", value: 0 },
        uDropShadowOffset: [0.0, 0.0],
        uOutlineDistance: { type: "1i", value: 0 },
        uGamma: { type: "1i", value: 0 },
        uDebug: { type: "1i", value: 1 },
        uDropShadow: { type: "1i", value: 1 },
        uOutline: { type: "1i", value: 1 }
      },
      attributes: {
        aPos: 0,
        aTexCoord: 0
      }
    };
  }

  constructor() {
    let content = MSDFTextShader.shaderContent;

    super(content.vertex, content.fragment, content.uniforms, content.attributes);
  }
}
