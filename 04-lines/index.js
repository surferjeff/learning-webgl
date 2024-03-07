import * as util from '../util.js';
let canvas = document.getElementById('canvas');
let context = canvas.getContext('webgl2');
context.clearColor(0.1, 0.2, 0.3, 1.0);
context.clear(context.COLOR_BUFFER_BIT|context.DEPTH_BUFFER_BIT);

let linesCoords = [-0.6, 0.6, 0.6, 0.7];

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
let program = util.getProgram(context, vertexShader, fragmentShader);

// Step 3: Create buffers
let buffer = util.createAndBindBuffer(context, context.ARRAY_BUFFER,
    new Float32Array(linesCoords), context.STATIC_DRAW);

// Step 4: Link GPU variable to CPU and sending data 
context.bindBuffer(context.ARRAY_BUFFER, buffer)
const position = util.linkVariable(context, program, 'position');
context.vertexAttribPointer(position, 2, context.FLOAT, context.FALSE, 0, 0);

// Step 5: Render triangle
context.drawArrays(context.LINES, 0, linesCoords.length / 2);