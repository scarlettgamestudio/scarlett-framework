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
            'attribute vec4 aColor;',

            'uniform mat4 uMatrix;',
            'uniform mat4 uTransform;',

            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',

            'void main(void){',
            '   gl_Position = uMatrix * uTransform * vec4(aVertexPosition, 0.0, 1.0);',
            '   vTextureCoord = aTextureCoord;',
            //'   //vColor = vec4(aColor.rgb * aColor.a, aColor.a);',
            '   vColor = aColor;',
            '}'
        ].join('\n'),
        // inline-fragment shader
        [
            'precision mediump float;',

            'varying vec2 vTextureCoord;',
            'varying vec4 vColor;',

            'uniform sampler2D uSampler;',

            'void main(void){',
            '   gl_FragColor = texture2D(uSampler, vTextureCoord) ;',
            '}'
        ].join('\n'),
        // uniforms:
        {
            uSampler: {type: 'tex', value: 0},
            uMatrix: {type: 'mat4', value: mat4.create()},
            uTransform: {type: 'mat4', value: mat4.create()}
        },
        // attributes:
        {
            aVertexPosition:    0,
            aTextureCoord:      0,
            aColor:             0
        });
}

inheritsFrom(TextureShader, Shader);