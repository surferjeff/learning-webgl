
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
 * @returns {number}
 */
export function linkVariable(gl, program, gpuVariable) {
  const position = gl.getAttribLocation(program, gpuVariable)
  gl.useProgram(program)
  gl.enableVertexAttribArray(gpuVariable)
  return position
}