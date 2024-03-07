"use strict";
import * as util from '../util.js';
let canvas = document.getElementById('canvas');
canvas.width = 100;
canvas.height = 8;
let gl = canvas.getContext('webgl2');
gl.clearColor(0.1, 0.2, 0.3, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

// Step 1: Write shaders
let vertexShader = `#version 300 es
precision mediump float;
in float index;
void main() {
  gl_Position = vec4(index / 50.0 - 1.0, 0.0, 0.0, 1.0);
  gl_PointSize = 1.0;
}
`;

let fragmentShader = `#version 300 es
precision mediump float;
out vec4 color;
void main() {
  color = vec4(0.0, gl_FragCoord.x / 100.0, 0.0, 1.0);
}
`;

// Step 2: Create program from shaders
let program = util.getProgram(gl, vertexShader, fragmentShader);

// Step 3: Create buffers
let indices = new Float32Array(100);
for (let i = 0; i < 100; i++) {
  indices[i] = i;
}
let buffer = util.createAndBindBuffer(gl, gl.ARRAY_BUFFER, indices,
  gl.STATIC_DRAW);

// Step 4: Link GPU variable to CPU and sending data
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
gl.useProgram(program)
const index = util.linkVariable(gl, program, 'index');
gl.vertexAttribPointer(index, 1, gl.FLOAT, gl.FALSE, 0, 0);

// Step 5: Render points
gl.drawArrays(gl.POINTS, 0, indices.length);