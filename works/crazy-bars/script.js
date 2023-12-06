const vs = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
  vTexCoord = aTexCoord;
}
`;

const fs = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform sampler2D uTex;
uniform float uPi;
uniform float uTime;

void main() {
  vec2 uv = vTexCoord;

  uv.y = 1.0 - uv.y;
  uv.x += 0.05*sin(uTime) * cos(uv.y*uPi*5.0);

  vec2 offset = vec2(0.1*cos(uTime), 0.0);

  vec4 col;
  col.r = texture2D(uTex, uv + offset).r;
  col.g = texture2D(uTex, uv         ).g;
  col.b = texture2D(uTex, uv - offset).b;
  
  gl_FragColor = col;
}
`;

let palette = [
  'gray',
  '#F6FA70',
  '#B6EAFA',
  '#00DFA2',
  'magenta',
  '#FF0060',
  '#0079FF',
];
let theShader;
let t = 0.0;
let baseImg;
const dt = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  theShader = createShader(vs, fs);
  baseImg = createGraphics(width, height);
  rec(baseImg, 10, height)
}

function draw() {
  background(255);
  shader(theShader);
  theShader.setUniform('uTex', baseImg);
  theShader.setUniform('uPi', PI);
  theShader.setUniform('uTime', t);
  rect(0, 0, width, height);
  resetShader();
  t += dt;
}

const rec = (img, depth, h) => {
  if (depth == 0) {
    return
  }

  drawColorBars(img, 0, 0, width, h, palette);
  palette = shuffle(palette);
  img.translate(0, h/2);
  rec(img, depth - 1, h/2);
}

const drawColorBars = (img, x0, y0, W, H, palette) => {
  const N = palette.length;
  img.noStroke();
  const w = W / N;
  for (let i = 0; i < N; i++) {
    const x = x0 + w * i;
    const y = y0;
    img.fill(palette[i]);
    img.rect(x, y, w, H);
  }
};
