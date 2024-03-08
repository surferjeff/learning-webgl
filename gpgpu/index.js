// Copied from https://webglfundamentals.org/webgl/lessons/webgl-gpgpu.html
import * as util from "../util.js";

const vs = `#version 300 es

in vec4 position;

void main() {
  gl_Position = position;
}
`;
 
const fs = `#version 300 es
precision mediump float;
 
uniform sampler2D srcTex, plusTex;
uniform vec2 srcDimensions;
out vec4 color;
 
const float carry = 1.0 / 256.0;
const float uncarry = 1.0 + carry;

vec2 add16(vec2 a, vec2 b) {
    vec2 result = a + b;
    if (result.y > 1.0) {
        result.x += carry;
        result.y -= uncarry;
    }
    return result;
}

void main() {
  vec2 texcoord = gl_FragCoord.xy / srcDimensions;
  vec4 srcVec = texture(srcTex, texcoord);
  vec4 plusVec = texture(plusTex, texcoord);
  color = vec4(add16(srcVec.rg, plusVec.rg), add16(srcVec.ba, plusVec.ba));
}

`;
 
const dstWidth = 3;
const dstHeight = 1;
 
const canvas = document.createElement('canvas');
canvas.width = dstWidth;
canvas.height = dstHeight;
 
const gl = canvas.getContext('webgl2');
 
const program =  util.getProgram(gl, vs, fs);
const positionLoc = gl.getAttribLocation(program, 'position');
const srcTexLoc = gl.getUniformLocation(program, 'srcTex');
const plusTexLoc = gl.getUniformLocation(program, 'plusTex');
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
const texPrimes = util.linearDataTextureFromI16(gl, new Int16Array([
        1, 2, 3, 5, 7, 2011
]));
 
const texHundreds = util.linearDataTextureFromI16(gl, [
        100, 200, 300, 400, 500, 3000,
]);
    

gl.useProgram(program);
gl.uniform1i(srcTexLoc, 0);  // tell the shader the src texture is on texture unit 0
gl.uniform1i(plusTexLoc, 1);  // tell the shader the plus texture is on texture unit 1
gl.uniform2f(srcDimensionsLoc, srcWidth, srcHeight);

gl.activeTexture(gl.TEXTURE0 + 0);
gl.bindTexture(gl.TEXTURE_2D, texPrimes);
gl.activeTexture(gl.TEXTURE0 + 1);
gl.bindTexture(gl.TEXTURE_2D, texHundreds);


gl.drawArrays(gl.TRIANGLES, 0, 6);  // draw 2 triangles (6 vertices)
 
// get the result
const results = new Uint8Array(dstWidth * dstHeight * 4);
gl.readPixels(0, 0, dstWidth, dstHeight, gl.RGBA, gl.UNSIGNED_BYTE, results);
const shorts = util.rgbaPixelsToI16(results);
console.log(...shorts);
