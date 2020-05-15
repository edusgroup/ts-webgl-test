const canvas = document.getElementById('canvas') as HTMLCanvasElement
const gl = canvas.getContext('webgl')
if (gl === null) {
  throw new Error('Webgl is not detected')
}

function createShader (gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (shader === null) {
    throw new Error('Can not create shader. Type: ' + type)
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }

  console.error(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)

  return null
}

function createProgram (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
  const program = gl.createProgram()
  if (program === null) {
    throw new Error('Error to create webgl program')
  }
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) {
    return program
  }

  console.log(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)

  return null
}

const vertexEl = document.getElementById('2d-vertex-shader') as HTMLScriptElement
const fragmentEl = document.getElementById('2d-fragment-shader') as HTMLScriptElement
const vertexShaderSource = vertexEl.text
const fragmentShaderSource = fragmentEl.text

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

if (vertexShader === null || fragmentShader === null) {
  throw new Error('Error to create fragments')
}

const program = createProgram(gl, vertexShader, fragmentShader)
if (program === null) {
  throw new Error('Error to create program')
}

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position')
console.log(positionAttributeLocation)
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
const positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
]
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)


gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.clearColor(0, 0, 0, 0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.useProgram(program);
gl.enableVertexAttribArray(positionAttributeLocation);

// Привязываем буфер положений
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// Указываем атрибуту, как получать данные от positionBuffer (ARRAY_BUFFER)
var size = 2;          // 2 компоненты на итерацию
var type = gl.FLOAT;   // наши данные - 32-битные числа с плавающей точкой
var normalize = false; // не нормализовать данные
var stride = 0;        // 0 = перемещаться на size * sizeof(type) каждую итерацию для получения следующего положения
var offset = 0;        // начинать с начала буфера
gl.vertexAttribPointer(
  positionAttributeLocation, size, type, normalize, stride, offset)

var primitiveType = gl.TRIANGLE_STRIP;
var offset = 0;
var count = 3;
gl.drawArrays(primitiveType, offset, count);

console.log(positionBuffer)


