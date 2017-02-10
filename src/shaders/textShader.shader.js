/**
 * Created by Luis on 16/12/2016.
 */
function TextShader() {
    Shader.call(this,
        // inline-vertex shader:
        [
            'attribute vec2 aPos;',
            'attribute vec2 aTexCoord;',

            'uniform mat4 uMatrix;',
            'uniform mat4 uTransform;',
            'uniform vec2 uTexSize;',

            'varying vec2 vTexCoord;',

            'void main() {',
                'gl_Position = uMatrix * uTransform * vec4(aPos.xy, 0, 1);',
                'vTexCoord = aTexCoord / uTexSize;',
            '}'
        ].join('\n'),
        // inline-fragment shader
        [
            '#ifdef GL_ES',
            '   precision mediump float;',
            '#endif',

            'uniform sampler2D uTexture;',
            'uniform vec4 uColor;',
            'uniform float uGamma;',
            'uniform float uOutlineDistance;',
            'uniform vec4 uOutlineColor;',

            'uniform vec4 uDropShadowColor;',
            'uniform float uDropShadowSmoothing;',
            'uniform vec2 uDropShadowOffset;',

            'uniform float uDebug;',

            'varying vec2 vTexCoord;',

            'void main() {',
            '  float distance = texture2D(uTexture, vTexCoord).a;',
            '  vec4 finalColor = uColor;',
            '  if (uDebug > 0.0) {',
            '     gl_FragColor = vec4(distance, distance, distance, 1);',
            '  } else {',
            // outline effect
            '       if (uOutlineDistance <= 0.5) {',
            '           float outlineFactor = smoothstep(0.5 - uGamma, 0.5 + uGamma, distance);',
            '           vec4 color = mix(uOutlineColor, uColor, outlineFactor);',
            '           float alpha = smoothstep(uOutlineDistance - uGamma, uOutlineDistance + uGamma, distance);',
            '           finalColor = vec4(color.rgb, color.a * alpha);',
            '       } else {',
            '           float alpha = smoothstep(0.5 - uGamma, 0.5 + uGamma, distance);',
            '           finalColor = vec4(uColor.rgb, uColor.a * alpha);',
            '       }',
            // drop shadow effect
            //'       float alpha = smoothstep(0.5 - uGamma, 0.5 + uGamma, distance);',
            //'       vec4 text = vec4(uColor.rgb, uColor.a * alpha);',

            '       float shadowDistance = texture2D(uTexture, vTexCoord - uDropShadowOffset).a;',
            '       float shadowAlpha = smoothstep(0.5 - uDropShadowSmoothing, 0.5 + uDropShadowSmoothing, shadowDistance);',
            '       vec4 shadow = vec4(uDropShadowColor.rgb, uDropShadowColor.a * shadowAlpha);',
            // inner effect is the other way around... text, shadow
            '       gl_FragColor = mix(shadow, finalColor, finalColor.a);',
            '  }',
            '}'
        ].join('\n'),
        // uniforms:
        {
            uMatrix: {type: 'mat4', value: new Float32Array(16)},
            uTransform: {type: 'mat4', value: new Float32Array(16)},
            uTexture: {type: 'tex', value: 0},
            uTexSize: {type: '1i', value: 24},
            uColor: [1.0, 0.0, 0.0, 1.0],
            uOutlineColor: [1.0, 1.0, 1.0, 1.0],
            uDropShadowColor: [0.0, 0.0, 0.0, 1.0],
            uDropShadowSmoothing: {type: '1i', value: 0},
            uDropShadowOffset: [0.0, 0.0],
            uOutlineDistance: {type: '1i', value: 0},
            uGamma: {type: '1i', value: 0},
            uDebug: {type: '1i', value: 1}
        },
        // attributes:
        {
            aPos: 0,
            aTexCoord: 0
        });
}

inheritsFrom(TextShader, Shader);