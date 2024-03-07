import * as util from '../util.js';
let canvas = document.getElementById('canvas');
let gl = canvas.getContext('webgl2');
gl.clearColor(0.1, 0.2, 0.3, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

let vertices = [-0.6, 0.6, 0.6, 0.7,
  -0.6, -0.6, 0.6, -0.5];

// Step 1: Write shaders
let vertexShader = `#version 300 es
precision mediump float;
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
let fragmentShader = `#version 300 es
precision mediump float;
out vec4 color;
void main() {
  color = vec4(0.0, 1.0, 0.0, 1.0);
}
`;

// Step 2: Create program from shaders
let program = util.getProgram(gl, vertexShader, fragmentShader);

// Step 3: Create buffers
let buffer = util.createAndBindBuffer(gl, gl.ARRAY_BUFFER,
    new Float32Array(vertices), gl.STATIC_DRAW);

// Step 4: Link GPU variable to CPU and sending data 
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
const position = util.linkVariable(gl, program, 'position');
gl.vertexAttribPointer(position, 2, gl.FLOAT, gl.FALSE, 0, 0);

// Step 5: Render triangle
gl.drawArrays(gl.LINES, 0, vertices.length / 2);