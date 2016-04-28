/**
 * PrimitiveShader class
 * @depends shader.js
 */
var PrimitiveShader = (function () {

    /**
     * @constructor
     */
    function PrimitiveShader() {
        Shader.call(this,
            // inline-vertex shader:
            [
                'attribute vec3 aVertexPosition;',
                'attribute vec4 aColor;',

                'uniform mat4 translationMatrix;',
                'uniform mat4 projectionMatrix;',

                'varying vec4 vColor;',

                'void main(void) {',
                '   gl_Position = projectionMatrix * translationMatrix * vec4(aVertexPosition, 1.0);',
                '   vColor = aColor;',
                '}'
            ].join('\n'),
            // inline-fragment shader
            [
                'precision mediump float;',

                'varying vec4 vColor;',

                'void main(void) {',
                '   gl_FragColor = vColor;',
                '}'
            ].join('\n'),
            // uniforms:
            {
                translationMatrix: {type: 'mat4', value: new Float32Array(16)},
                projectionMatrix: {type: 'mat4', value: new Float32Array(16)}
            },
            // attributes:
            {
                aVertexPosition: 0,
                aColor: 0
            });
    }

    inheritsFrom(PrimitiveShader, Shader);

    return PrimitiveShader;

})();