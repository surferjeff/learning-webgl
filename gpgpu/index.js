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
out float color;
 
void main() {
  vec2 texcoord = gl_FragCoord.xy / srcDimensions;
  float value = texture(srcTex, texcoord).x;
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

const redTex = util.createDataTexture(gl, srcWidth, srcHeight,
    new Float32Array([1, 2, 3, 5, 7, 11]));

const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texImage2D(
    gl.TEXTURE_2D,
    0,                // mip level
    gl.RGBA,     // internal format
    srcWidth,
    srcHeight,
    0,                // border
    gl.RGBA,     // format
    gl.UNSIGNED_BYTE, // type
    new Uint8Array([
        1, 2, 3, 5,
        7, 11, 13, 17,
        19, 23, 29, 31,
        37, 41, 43, 47,
        53, 59, 61, 67,
        71, 73, 79, 83,
    ]));
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
 
gl.useProgram(program);
gl.uniform1i(srcTexLoc, 0);  // tell the shader the src texture is on texture unit 0
gl.uniform2f(srcDimensionsLoc, srcWidth, srcHeight);
 
gl.drawArrays(gl.TRIANGLES, 0, 6);  // draw 2 triangles (6 vertices)
 
// get the result
const results = new Float32Array(dstWidth * dstHeight);
gl.readPixels(0, 0, dstWidth, dstHeight, gl.R32F, gl.FLOAT, results);
 
// print the results
for (let i = 0; i <dstWidth * dstHeight; i += 1) {
  console.log(results[i]);
}