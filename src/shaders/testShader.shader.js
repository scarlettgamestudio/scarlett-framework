/**
 * Created by Luis on 16/12/2016.
 */
function TestShader() {
    Shader.call(this,
        // inline-vertex shader:
        [
            // an attribute will receive data from a buffer
            'attribute vec4 a_position;',

            // all shaders have a main function
            'void main() {',
                // gl_Position is a special variable a vertex shader
                // is responsible for setting
                'gl_Position = a_position;',
            '}'
        ].join('\n'),
        // inline-fragment shader
        [
            // fragment shaders don't have a default precision so we need
            // to pick one. mediump is a good default
            'precision mediump float;',

            'void main() {',
                // gl_FragColor is a special variable a fragment shader
                // is responsible for setting
                'gl_FragColor = vec4(1, 0, 0.5, 1);',
            '}'
        ].join('\n'),
        // uniforms:
        {

        },
        // attributes:
        {
            a_position:    0
        });
}

inheritsFrom(TestShader, Shader);