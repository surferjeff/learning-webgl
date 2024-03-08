"use strict";
import * as util from '../util.js';
let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;
let gl = canvas.getContext('webgl2');

gl.clearColor(0.9, 0.9, 0.9, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

// Step 1: Write shaders
let vertexShader = `#version 300 es
precision mediump float;
in vec2 position;
in vec2 texCoords;
out vec2 textureCoords;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
  textureCoords = texCoords;
  // Commenting the line above and uncommenting the line below
  // shows the image upside down, in the top, left quadrant.
  // textureCoords = position;
}
`;
let fragmentShader = `#version 300 es
precision mediump float;
in vec2 textureCoords;
uniform sampler2D uImage;
out vec4 color;
void main() {
  color = texture(uImage, textureCoords);
}
`;

// Step 2: Create program from shaders
let program = util.getProgram(gl, vertexShader, fragmentShader);

// Step 3: Create buffers
let vertices = util.triangleCoordsFromRect(-1, -1, 1, 1);
// Changing the numbers in texCoords has no effect!  Something is wrong here.
let texCoords = util.triangleCoordsFromRect(0, 0, 1, 1);

let buffer = util.createAndBindBuffer(gl, gl.ARRAY_BUFFER,
    new Float32Array(vertices), gl.STATIC_DRAW);
let texBuffer  = util.createAndBindBuffer(gl, gl.ARRAY_BUFFER,
    new Float32Array(texCoords), gl.STATIC_DRAW);

let image = new Image();
image.src = '../chicken.jpg';
image.onload = function() {
  let texture = util.createAndBindTexture(gl, image);

  // Step 4: Link GPU variable to CPU and sending data 
  gl.useProgram(program);

  const position = util.linkBuffer(gl, program, 'position', buffer);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, gl.FALSE, 0, 0);

  const texCoords = util.linkBuffer(gl, program, 'texCoords', texBuffer);
  gl.vertexAttribPointer(texCoords, 2, gl.FLOAT, gl.FALSE, 0, 0);

  console.log({position, texCoords}); 

  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Step 5: Render triangle
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
}

