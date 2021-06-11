import { VertexArray, IndexBuffer, DataBuffer, Program } from '../index';
console.log(VertexArray, IndexBuffer, DataBuffer, Program);

/* Step1: Prepare the canvas and get WebGL context */

let canvas = document.getElementById('canvas');
let gl = canvas.getContext('webgl2');

/* Step2: Define the geometry and store it in buffer objects */

// vao
const vao = new VertexArray({
  buffers: {
    position: new Float32Array([
      -0.5, 0.5, 0.0, -0.5, -0.5, 0.0, 0.5, -0.5, 0.0, 0.5, 0.5, 0.0,
    ]),
    index: new Uint16Array([3, 2, 1, 3, 1, 0]),
  },
  mode: 'TRIANGLES',
});
vao.bind(gl);

/* Step3: Create and compile Shader programs */

const program = new Program({
  // Vertex shader source code
  vertex: `attribute vec3 a_position;
  void main(void) {
    gl_Position = vec4(a_position, 1.0);
  }`,
  // Fragment shader source code
  fragment: `void main(void) {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.6);
  }`,
});
program.use(gl);

function draw() {
  // Clear the canvas
  gl.clearColor(0.5, 0.5, 0.5, 0.9);

  // Enable the depth test
  gl.enable(gl.DEPTH_TEST);

  // Clear the color buffer bit
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set the view port
  gl.viewport(0, 0, canvas.width, canvas.height);

  // draw Element
  vao.draw(gl, vao.indexBuffer.offset, vao.indexBuffer.count);
  requestAnimationFrame(() => draw());
}
draw();
