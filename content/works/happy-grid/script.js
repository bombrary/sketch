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
`
const fs = `
precision mediump float;

uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vTexCoord;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 uv = vTexCoord;

  vec2 center = uv - 0.5;
  float dist = length(center);

  vec2 cell = floor(uv * 12.0);
  float cellNoise = hash(cell);

  float wave =
    sin(dist * 10.0 - uTime * 1.2 + cellNoise * 3.14)
    * mix(0.02, 0.004, dist);

  uv += normalize(center) * wave;

  gl_FragColor = texture2D(uTexture, uv);
}
`

const palette = [
  "#001BB7",
  "#0046FF",
  "#FF8040",
  "#E9E9E9",
  "#FF0060",
  "#F6FA70",
  "#00DFA2",
  "#0079FF"
];

let pg;
let distortShader;

function preload() {
  distortShader = createShader(vs, fs);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  pg = createGraphics(windowWidth, windowHeight);
  drawPosterToBuffer(pg);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);
  drawPosterToBuffer(pg);
}

function draw() {
  shader(distortShader);

  distortShader.setUniform("uTexture", pg);
  distortShader.setUniform("uTime", millis() * 0.001);
  distortShader.setUniform("uResolution", [width, height]);

  rect(-width / 2, -height / 2, width, height);
}

function drawPosterToBuffer(g) {
  g.background(245);

  const cols = 12;
  const rows = 15;

  const margin = min(width, height) * 0.06;
  const gap = min(width, height) * 0.01;

  const maxCellW =
    (width - margin * 2 - gap * (cols - 1)) / cols;
  const maxCellH =
    (height - margin * 2 - gap * (rows - 1)) / rows;

  const cell = min(maxCellW, maxCellH);
  const r = cell * 0.5;

  const gridW = cell * cols + gap * (cols - 1);
  const gridH = cell * rows + gap * (rows - 1);

  const offsetX = (width - gridW) / 2;
  const offsetY = (height - gridH) / 2;

  g.noStroke();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cx = offsetX + x * (cell + gap) + r;
      const cy = offsetY + y * (cell + gap) + r;

      const vertical = random() < 0.5;
      const stripes = int(random(4, 9));
      const colors = shuffle([...palette]).slice(0, 3);

      drawStripedCircle(g, cx, cy, r, vertical, stripes, colors);
    }
  }
}


function drawStripedCircle(g, cx, cy, r, vertical, stripes, colors) {
  g.push();
  g.translate(cx, cy);

  g.drawingContext.save();
  g.drawingContext.beginPath();
  g.drawingContext.arc(0, 0, r, 0, TAU);
  g.drawingContext.clip();

  if (vertical) {
    const w = (r * 2) / stripes;
    for (let i = 0; i < stripes; i++) {
      g.fill(random(colors));
      g.rect(-r + i * w, -r, w + 1, r * 2);
    }
  } else {
    const h = (r * 2) / stripes;
    for (let i = 0; i < stripes; i++) {
      g.fill(random(colors));
      g.rect(-r, -r + i * h, r * 2, h + 1);
    }
  }

  g.drawingContext.restore();

  g.noFill();
  g.stroke(30, 40);
  g.strokeWeight(1);
  g.ellipse(0, 0, r * 2);

  g.pop();
}
