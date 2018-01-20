/**
 * Created by Luis on 16/12/2016.
 */

import Shader from "./shader";

/**
 * TextShader Class
 */
export default class TextShader extends Shader {
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

        "#ifdef GL_ES",
        "   precision mediump float;",
        "#endif",

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

        "float aastep(float value) {",
        "  #ifdef GL_OES_standard_derivatives",
        "    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;",
        "  #else",
        "    float afwidth = (1.0 / 72.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));",
        "  #endif",
        "  return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);",
        "}",

        "void main() {",
        "   float distance = texture2D(uTexture, vTexCoord).a;",
        "   vec4 finalColor = uColor;",
        "   if (uDebug > 0.0) {",
        "       gl_FragColor = vec4(distance, distance, distance, 1);",
        "       return;",
        "   }",
        // outline effect
        "   if (uOutline > 0.0) {",
        "       float outlineFactor = " + "smoothstep(0.5 - uGamma, 0.5 + uGamma, distance);",
        "       vec4 color = mix(uOutlineColor, uColor, outlineFactor);",
        "       float alpha = smoothstep(uOutlineDistance - uGamma, " + "uOutlineDistance + uGamma, distance);",
        "       finalColor = vec4(color.rgb, color.a * alpha);",
        "   } else {",
        "       float alpha = aastep(distance);",
        "       finalColor = vec4(uColor.rgb, uColor.a * alpha);",
        "   }",
        // drop shadow effect
        //'float alpha = smoothstep(0.5 - uGamma, 0.5 + uGamma, distance);',
        //'     vec4 text = vec4(uColor.rgb, uColor.a * alpha);',
        "   if (uDropShadow > 0.0) {",
        "       float shadowDistance = " + "texture2D(uTexture, vTexCoord - uDropShadowOffset).a;",
        "       float shadowAlpha = smoothstep(0.5 - uDropShadowSmoothing, " +
          "0.5 + uDropShadowSmoothing, shadowDistance);",
        "       vec4 shadow = " + "vec4(uDropShadowColor.rgb, uDropShadowColor.a * shadowAlpha);",
        //      inner effect is the other way around... text, shadow
        "       gl_FragColor = mix(shadow, finalColor, finalColor.a);",
        "       return;",
        "   }",
        "   gl_FragColor = finalColor;",
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
    let content = TextShader.shaderContent;

    super(content.vertex, content.fragment, content.uniforms, content.attributes);
  }
}
