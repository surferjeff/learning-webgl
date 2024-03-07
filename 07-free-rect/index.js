import * as util from '../util.js';
import { watchMouseDragging } from './events.js';

let canvas = document.getElementById('canvas');
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let gl = canvas.getContext('webgl2');
gl.clearColor(0.1, 0.2, 0.3, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

// Step 1: Write shaders
let vertexShader = `#version 300 es
precision mediump float;
uniform float flipY;
in vec2 position;
void main() {
  gl_Position = vec4(position.x, position.y * flipY, 0.0, 1.0);
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

/**
 * 
 * @param {number} startX 
 * @param {number} startY 
 * @param {number} endX 
 * @param {number} endY 
 */
function updateRect(startX, startY, endX, endY) {
  startX = (startX / canvas.width) * 2 - 1;
  startY = (startY / canvas.height) * 2 - 1;
  endX = (endX / canvas.width) * 2 - 1;
  endY = (endY / canvas.height) * 2 - 1;
  let triangles = [
    startX, startY,
    endX, startY,
    endX, endY,
    startX, startY,
    endX, endY,
    startX, endY
  ];
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);
  let location = gl.getUniformLocation(program, 'flipY');
  gl.uniform1f(location, -1);
  let buffer = util.createAndBindBuffer(gl, gl.ARRAY_BUFFER,
      new Float32Array(triangles), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  const position = util.linkVariable(gl, program, 'position');
  gl.vertexAttribPointer(position, 2, gl.FLOAT, gl.FALSE, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, triangles.length / 2);
}

watchMouseDragging(canvas, updateRect);