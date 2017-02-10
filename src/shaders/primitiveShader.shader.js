/**
 * PrimitiveShader class
 * @depends shader.js
 */
function PrimitiveShader() {
    Shader.call(this,
        // inline-vertex shader:
        [
            'attribute vec2 aVertexPosition;',

            'uniform mat4 uMatrix;',
            'uniform mat4 uTransform;',
            'uniform float uPointSize;',

            'void main(void) {',
            '   gl_PointSize = uPointSize;',
            '   gl_Position = uMatrix * uTransform * vec4(aVertexPosition, 0.0, 1.0);',
            '}'
        ].join('\n'),
        // inline-fragment shader
        [
            'precision mediump float;',

            'uniform vec4 uColor;',

            'void main(void) {',
            '   gl_FragColor = uColor;',
            '}'
        ].join('\n'),
        // uniforms:
        {
            uMatrix: {type: 'mat4', value: new Float32Array(16)},
            uTransform: {type: 'mat4', value: new Float32Array(16)},
            uColor: [0.0, 0.0, 0.0, 1.0],
            uPointSize: 2
        },
        // attributes:
        {
            aVertexPosition: 0
        });
}

inheritsFrom(PrimitiveShader, Shader);