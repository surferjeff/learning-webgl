let canvas = document.getElementById('canvas');
let context = canvas.getContext('webgl2');
context.clearColor(0.1, 0.2, 0.3, 1.0);
context.clear(context.COLOR_BUFFER_BIT|context.DEPTH_BUFFER_BIT);

let triangleCoords = [0.0, -1.0, 0.0, 1.0, 1.0, -1.0];

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
let vs = context.createShader(context.VERTEX_SHADER);
context.shaderSource(vs, vertexShader);
context.compileShader(vs);
if (!context.getShaderParameter(vs, context.COMPILE_STATUS)) {
    throw new Error(context.getShaderInfoLog(vs));
}
let fs = context.createShader(context.FRAGMENT_SHADER);
context.shaderSource(fs, fragmentShader);
context.compileShader(fs);
if (!context.getShaderParameter(fs, context.COMPILE_STATUS)) {
    throw new Error(context.getShaderInfoLog(fs));
}
let program = context.createProgram();
context.attachShader(program, vs);
context.attachShader(program, fs);
context.linkProgram(program);
if (!context.getProgramParameter(program, context.LINK_STATUS)) {
    throw new Error(context.getProgramInfoLog(program));
}

// Step 3: Create buffers
let buffer = context.createBuffer();
context.bindBuffer(context.ARRAY_BUFFER, buffer);
context.bufferData(context.ARRAY_BUFFER, new Float32Array(triangleCoords),
    context.STATIC_DRAW);
context.bindBuffer(context.ARRAY_BUFFER, null);

// Step 4: Link GPU variable to CPU and sending data 
context.useProgram(program);
let position = context.getAttribLocation(program, 'position');
context.bindBuffer(context.ARRAY_BUFFER, buffer);
context.enableVertexAttribArray(position);
context.vertexAttribPointer(position, 2, context.FLOAT, context.FALSE, 0, 0);

// Step 5: Render triangle
context.drawArrays(context.TRIANGLES, 0, 3);