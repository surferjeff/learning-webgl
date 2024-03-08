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
uniform sampler2D tex;
void main() {
  color = texture(tex, vec2(gl_FragCoord.x / 100.0, gl_FragCoord.y / 8.0));
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

// Create a texture: 2 lines of 100 pixels each
let texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
let data = new Uint8Array(100 * 2 * 4);
// red line.
for (let i = 0; i < 400; i += 4) {
  data[i] = 255;
  data[i + 1] = 0;
  data[i + 2] = 0;
  data[i + 3] = 255;
}
// green line.
for (let i = 400; i < 800; i += 4) {
  data[i] = 0;
  data[i + 1] = 255;
  data[i + 2] = 0;
  data[i + 3] = 255;
}

gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 100, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)


// Step 4: Link GPU variable to CPU and sending data
gl.useProgram(program)
const index = util.linkBuffer(gl, program, 'index', buffer);
gl.vertexAttribPointer(index, 1, gl.FLOAT, gl.FALSE, 0, 0);

// Step 5: Render points
gl.drawArrays(gl.POINTS, 0, indices.length);