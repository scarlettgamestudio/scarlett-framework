/**
 * TextureShader class
 * @depends shader.js
 */
var TextureShader = (function () {

    /**
     * @constructor
     */
    function TextureShader() {
        Shader.call(this,
            // inline-vertex shader:
            [
                'precision lowp float;',

                'attribute vec2 aVertexPosition;',
                'attribute vec2 aTextureCoord;',
                'attribute vec4 aColor;',

                'uniform mat3 projectionMatrix;',

                'varying vec2 vTextureCoord;',
                'varying vec4 vColor;',

                'void main(void){',
                '   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);',
                '   vTextureCoord = aTextureCoord;',
                '   vColor = vec4(aColor.rgb * aColor.a, aColor.a);',
                '}'
            ].join('\n'),
            // inline-fragment shader
            [
                'precision lowp float;',

                'varying vec2 vTextureCoord;',
                'varying vec4 vColor;',

                'uniform sampler2D uSampler;',

                'void main(void){',
                '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
                '}'
            ].join('\n'),
            // uniforms:
            {
                uSampler: {type: 'tex', value: 0},
                projectionMatrix: {
                    type: 'mat3',
                    value: new Float32Array([1, 0, 0,
                            0, 1, 0,
                            0, 0, 1])
                }
            },
            // attributes:
            {
                aVertexPosition:    0,
                aTextureCoord:      0,
                aColor:             0
            });
    }

    inheritsFrom(TextureShader, Shader);

    return TextureShader;

})();