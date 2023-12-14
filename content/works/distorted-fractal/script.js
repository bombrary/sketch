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
uniform float uPhi;
uniform vec2 uCenter;

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  uv.x += sin(uPhi + uv.y * 2.0) * 0.5 * distance(uv, uCenter);
  uv.y += cos(uPhi + uv.x * 2.0) * 0.5 * distance(uv, uCenter);

  gl_FragColor = texture2D(uTex, uv);
}
`;
const palette = ['#00EAD3', '#FFF5B7', '#FF449F', '#005F99'];
let time = 0.03;
let theShader;
let img;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  theShader = createShader(vs, fs);
  img = createFractalImage();
  theShader.setUniform('uPhi', random(-PI, PI));
}

function draw() {
  shader(theShader);
  theShader.setUniform('uTex', img);
  theShader.setUniform('uCenter', [0.5, 0.5]);
  rect(0, 0, width, height);
}

const createFractalImage = () => {
  const img = createGraphics(width, height);
  img.background(random(palette));
  rec(10, img, width, height, random(palette));
  return img
}

const rec = (depth, img, W, H, col) => {
  if (depth == 0) return;

  img.noStroke();
  for (const [x, y] of [[0, 0], [W/2, 0], [W/2, H/2], [0, H/2]]) {
    if (random([true, false, false])) continue;
    img.push();
    img.translate(x, y);
    img.fill(col);
    img.rect(0, 0, W / 2, H / 2);
    rec(depth - 1, img, W / 2, H / 2, chooseColor(palette, col));
    img.pop();
  }
};

const chooseColor = (palette, except) => {
  while (true) {
    const col = random(palette);
    if (col !== except) {
      return col;
    }
  }
}
