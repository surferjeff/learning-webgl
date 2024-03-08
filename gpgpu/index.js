// Copied from https://webglfundamentals.org/webgl/lessons/webgl-gpgpu.html
import * as util from "../util.js";

const vs = `#version 300 es

in vec4 position;

void main() {
  gl_Position = position;
}
`;
 
const fs = `#version 300 es
precision highp float;
 
uniform sampler2D srcTex;
uniform vec2 srcDimensions;
out vec4 color;
 
void main() {
  vec2 texcoord = gl_FragCoord.xy / srcDimensions;
  vec4 value = texture(srcTex, texcoord);
  color = value * 2.0;
}
`;
 
const dstWidth = 6;
const dstHeight = 1;
 
const canvas = document.createElement('canvas');
canvas.width = dstWidth;
canvas.height = dstHeight;
 
const gl = canvas.getContext('webgl2');
 
const program =  util.getProgram(gl, vs, fs);
const positionLoc = gl.getAttribLocation(program, 'position');
const srcTexLoc = gl.getUniformLocation(program, 'srcTex');
const srcDimensionsLoc = gl.getUniformLocation(program, 'srcDimensions');
 
// setup a full canvas clip space quad
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1, -1,
   1, -1,
  -1,  1,
  -1,  1,
   1, -1,
   1,  1,
]), gl.STATIC_DRAW);
 
// setup our attributes to tell WebGL how to pull
// the data from the buffer above to the position attribute
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(
    positionLoc,
    2,         // size (num components)
    gl.FLOAT,  // type of data in buffer
    false,     // normalize
    0,         // stride (0 = auto)
    0,         // offset
);
 
// create our source texture
const srcWidth = dstWidth;
const srcHeight = dstHeight;
util.createDataTextureRGBA(gl, srcWidth, srcHeight,
    new Uint8Array([
        1, 2, 3, 5,
        7, 11, 13, 17,
        19, 23, 29, 31,
        37, 41, 43, 47,
        53, 59, 61, 67,
        71, 73, 79, 83,
    ]));
 
gl.useProgram(program);
gl.uniform1i(srcTexLoc, 0);  // tell the shader the src texture is on texture unit 0
gl.uniform2f(srcDimensionsLoc, srcWidth, srcHeight);
 
gl.drawArrays(gl.TRIANGLES, 0, 6);  // draw 2 triangles (6 vertices)
 
// get the result
const results = new Uint8Array(dstWidth * dstHeight * 4);
gl.readPixels(0, 0, dstWidth, dstHeight, gl.RGBA, gl.UNSIGNED_BYTE, results);
 
// print the results
for (let i = 0; i < 4 * dstWidth * dstHeight; i += 4) {
  console.log(...results.slice(i, i + 4));
}