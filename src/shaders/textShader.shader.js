/**
 * Created by Luis on 16/12/2016.
 */
/**
 * Created by Luis on 16/12/2016.
 */
function TextShader() {
    Shader.call(this,
        // inline-vertex shader:
        [
            'attribute vec2 a_pos;',
            'attribute vec2 a_texcoord;',

            'uniform mat4 u_matrix;',
            'uniform vec2 u_texsize;',

            'varying vec2 v_texcoord;',

            'void main() {',
                'gl_Position = u_matrix * vec4(a_pos.xy, 0, 1);',
                'v_texcoord = a_texcoord / u_texsize;',
            '}'
        ].join('\n'),
        // inline-fragment shader
        [
            '#ifdef GL_ES',
            '   precision mediump float;',
            '#endif',

            'uniform sampler2D u_texture;',
            'uniform vec4 u_color;',
            'uniform float u_buffer;',
            'uniform float u_gamma;',
            'uniform float u_debug;',

            'varying vec2 v_texcoord;',

            'void main() {',
            '  float dist = texture2D(u_texture, v_texcoord).a;',
            '  if (u_debug > 0.0) {',
            '     gl_FragColor = vec4(dist, dist, dist, 1);',
            '  } else {',
            '     float alpha = smoothstep(0.5 - u_gamma, 0.5 + u_gamma, dist);',
            '     gl_FragColor = vec4(u_color.rgb, u_color.a * alpha);',
            '  }',
            '}'
        ].join('\n'),
        // uniforms:
        {
            u_matrix: {type: 'mat4', value: mat4.create()},
            u_texture: {type: 'tex', value: 0},
            u_texsize: {type: '1i', value: 24},
            u_color: [1.0, 1.0, 1.0, 1.0],
            u_buffer: {type: '1i', value: 0},
            u_gamma: {type: '1i', value: 0},
            u_debug: {type: '1i', value: 1}
        },
        // attributes:
        {
            a_pos: 0,
            a_texcoord: 0
        });
}

inheritsFrom(TextShader, Shader);