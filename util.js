
/**
 * Compiles and links a shader programs.
 * 
 * @param {WebGL2RenderingContext}} gl 
 * @param {string} vsSource 
 * @param {string} fsSource 
 * @returns {WebGLProgram}
 */
export function getProgram(gl, vsSource, fsSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource)

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program);
    throw new Error(`Unable to initialize the shader program: ${error}`)
  }

  return program
}

/**
 * @param {WebGL2RenderingContext} gl 
 * @param {number} kind 
 * @param {string} source 
 * @returns {WebGLShader}
 */
function compileShader(gl, kind, source) {
  const shader = gl.createShader(kind)

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader)
    throw new Error(`An error occurred compiling the shaders: ${error}`)
  }

  return shader
}

/**
 * @param {WebGL2RenderingContext} gl 
 * @param {number} bufferKind 
 * @param {ArrayBufferView} data 
 * @param {number} usage 
 * @returns {WebGLBuffer}
 */
export function createAndBindBuffer(gl, bufferKind, data, usage) {
  const buffer = gl.createBuffer()
  gl.bindBuffer(bufferKind, buffer)
  gl.bufferData(bufferKind, data, usage)
  gl.bindBuffer(bufferKind, null)
  return buffer
}


/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {WebGLProgram} program 
 * @param {string} gpuVariable 
 * @param {WebGLBuffer} buffer
 * @returns {number}
 */
export function linkBuffer(gl, program, gpuVariable, buffer) {
  const v = gl.getAttribLocation(program, gpuVariable)
  gl.enableVertexAttribArray(gpuVariable)
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  return v
}

/**
 * Returns a list of coordidates for triangle fragments for a rectangle.
 * 
 * @param {number} startX 
 * @param {number} startY 
 * @param {number} endX 
 * @param {number} endY 
 * @returns {Array<number>}
 */
export function triangleCoordsFromRect(startX, startY, endX, endY) {
  return [
    startX, startY, endX, endY, startX, endY,
    startX, startY, endX, endY, endX, startY
  ]
}

/**
 * 
 * @param {WebGL2RenderingContext} gl 
 * @param {HTMLImageElement} image 
 * @returns {WebGLTexture}
 */
export function createAndBindTexture(gl, image) {
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return texture;
}