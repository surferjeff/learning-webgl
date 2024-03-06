
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
 * @param {gl.VERTEX_SHADER|gl.FRAGMENT_SHADER} kind 
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