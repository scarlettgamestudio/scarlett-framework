/**
 * TextureShader class
 * @depends shader.js
 */
function TextureShader() {
    Shader.call(this,
        // inline-vertex shader:
        [
            'precision mediump float;',

            'attribute vec2 aVertexPosition;',
            'attribute vec2 aTextureCoord;',

            'uniform mat4 uMatrix;',
            'uniform mat4 uTransform;',

            'varying vec2 vTextureCoord;',

            'void main(void){',
            '   gl_Position = uMatrix * uTransform * vec4(aVertexPosition, 0.0, 1.0);',
            '   vTextureCoord = aTextureCoord;',
            '}'
        ].join('\n'),
        // inline-fragment shader
        [
            'precision mediump float;',

            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',

            'uniform sampler2D uSampler;',
            'uniform vec4 uColor;',

            'void main(void){',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;',
            '}'
        ].join('\n'),
        // uniforms:
        {
            uSampler: {type: 'tex', value: 0},
            uMatrix: {type: 'mat4', value: new Float32Array(16)},
            uTransform: {type: 'mat4', value: new Float32Array(16)},
            uColor: [1.0, 1.0, 1.0, 1.0]
        },
        // attributes:
        {
            aVertexPosition:    0,
            aTextureCoord:      0
        });
}

inheritsFrom(TextureShader, Shader);