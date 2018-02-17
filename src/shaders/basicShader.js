import Shader from "./shader";

const shaderContent = {
  vertex: `
    precision mediump float;
	  attribute vec2 aPos;

	  void main()
	  {	
      gl_Position = vec4(aPos, 0.0, 1.0);
    }
    `,
  fragment: `
    precision mediump float;
    uniform vec4 uColor;

	  void main()
	  {
	    gl_FragColor = uColor;
	  }
    `,
  uniforms: {
    uColor: [0.0, 0.0, 0.0, 1.0]
  },
  attributes: {
    aPos: 0
  }
};

export default class BasicShader extends Shader {
  constructor() {
    super(shaderContent.vertex, shaderContent.fragment, shaderContent.uniforms, shaderContent.attributes);
  }
}
