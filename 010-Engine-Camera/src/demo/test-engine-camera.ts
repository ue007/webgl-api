import { mat4 } from 'gl-matrix';
import { GLContext } from 'src/core/gl/Context';

import {
  VertexArray,
  IndexBuffer,
  DataBuffer,
  Program,
  Data,
  geometries,
  vaos,
  Camera,
} from '../index';
console.log(VertexArray, IndexBuffer, DataBuffer, Program);

/* Step1: Prepare the canvas and get WebGL context */

let canvas = document.getElementById('canvas');
let gl = (canvas as HTMLCanvasElement).getContext('webgl2');

/* Step2: Define the geometry and store it in buffer objects */

// vao
let data = new Data();
data.on('change', (e) => {
  console.log(e);
});
data.type = 'cube';
const vao = data.vao;
vao.bind(gl as GLContext);

/* Step3: Create and compile Shader programs */
const program = new Program({
  // Vertex shader source code
  vertex: `attribute vec3 a_position;
    uniform mat4 u_projectionViewMatrix;
    uniform mat4 u_modelMatrix;
    attribute vec3 a_color; 
    varying vec3 v_color;
    void main(void) { 
        gl_Position = u_projectionViewMatrix * u_modelMatrix * vec4(a_position, 1.0);
        v_color = a_color;
    }`,

  // Fragment shader source code
  fragment: `precision mediump float;
    varying vec3 v_color;
    void main(void) {
        gl_FragColor = vec4(1.0,0.0,0.0, 1.0);
    }`,
});
program.use(gl as GLContext);

/*==================== MATRIX =====================*/
let modelMatrix = mat4.fromValues(
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1
);

let camera = new Camera();
camera.attach(canvas as HTMLCanvasElement);
camera.refresh();
camera.viewMatrix = mat4.fromValues(
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  -6,
  1
);

program.bindUniforms({
  u_projectionViewMatrix: camera.projectViewMatrix,
  u_modelMatrix: modelMatrix,
});

/*==================== Rotation ====================*/

function rotateZ(m: mat4, angle: number) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var mv0 = m[0],
    mv4 = m[4],
    mv8 = m[8];

  m[0] = c * m[0] - s * m[1];
  m[4] = c * m[4] - s * m[5];
  m[8] = c * m[8] - s * m[9];

  m[1] = c * m[1] + s * mv0;
  m[5] = c * m[5] + s * mv4;
  m[9] = c * m[9] + s * mv8;
}

function rotateX(m: mat4, angle: number) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var mv1 = m[1],
    mv5 = m[5],
    mv9 = m[9];

  m[1] = m[1] * c - m[2] * s;
  m[5] = m[5] * c - m[6] * s;
  m[9] = m[9] * c - m[10] * s;

  m[2] = m[2] * c + mv1 * s;
  m[6] = m[6] * c + mv5 * s;
  m[10] = m[10] * c + mv9 * s;
}

function rotateY(m: mat4, angle: number) {
  var c = Math.cos(angle);
  var s = Math.sin(angle);
  var mv0 = m[0],
    mv4 = m[4],
    mv8 = m[8];

  m[0] = c * m[0] + s * m[2];
  m[4] = c * m[4] + s * m[6];
  m[8] = c * m[8] + s * m[10];

  m[2] = c * m[2] - s * mv0;
  m[6] = c * m[6] - s * mv4;
  m[10] = c * m[10] - s * mv8;
}

/*================= Drawing ===========================*/
var time_old = 0;

var draw = function (time: number) {
  var dt = time - time_old;
  // rotateZ(modelMatrix, dt * 0.005); //time
  rotateY(modelMatrix, dt * 0.002);
  rotateX(modelMatrix, dt * 0.001);
  time_old = time;

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0.5, 0.5, 0.5, 0.9);
  gl.clearDepth(1.0);

  gl.viewport(
    0.0,
    0.0,
    (canvas as HTMLCanvasElement).width,
    (canvas as HTMLCanvasElement).height
  );
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  program.bindUniforms({
    u_projectionViewMatrix: camera.projectViewMatrix,
    u_modelMatrix: modelMatrix,
  });

  vao.draw(gl as GLContext);
  window.requestAnimationFrame(draw);
};
draw(0);
