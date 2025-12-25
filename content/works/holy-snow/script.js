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

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  vec4 col = texture2D(uTexture, uv);

  float r = 0.12 * (2.0 * rand(uv + vec2(1.0, 0.0)) - 1.0);
  float g = 0.12 * (2.0 * rand(uv + vec2(0.0, 1.0)) - 1.0);
  float b = 0.12 * (2.0 * rand(uv + vec2(1.0, 1.0)) - 1.0);
  col.rgb += vec3(r, g, b);

  gl_FragColor = col;
}
`

let bgColor = '#000000';
let palette = [
  '#DC3535',
  '#FFE15D',
  '#82CD47',
  '#fff'
];
let flakes = [];
const MAX_FLAKES = 250;
let pg;
let distortShader;

function preload() {
  distortShader = createShader(vs, fs);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pg = createGraphics(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);
}

function draw() {
  pg.background(bgColor);

  // === 天井の逆さまの木 ===
  const treeCount = 6;
  for (let i = 0; i < treeCount; i++) {
    const x = (width / (treeCount - 1)) * i;
    drawUpsideDownTree(pg, x, 0, 140);
  }

  if (flakes.length < MAX_FLAKES && random() < 0.6) {
    flakes.push(new Snow());
  }

  for (let i = flakes.length - 1; i >= 0; i--) {
    flakes[i].update();
    flakes[i].draw(pg);

    if (flakes[i].isDead()) {
      flakes.splice(i, 1);
    }
  }

  shader(distortShader);

  distortShader.setUniform("uTexture", pg);
  distortShader.setUniform("uTime", millis() * 0.001);
  distortShader.setUniform("uResolution", [width, height]);

  rect(-width / 2, -height / 2, width, height);
}

class Snow {
  constructor() {
    this.pos = createVector(
      random(width),
      height + random(0, height)
    );

    this.vel = createVector(
      random(-0.1, 0.1),
      random(-0.4, -0.9)
    );

    this.acc = createVector(0, 0);

    this.depth = random(0.3, 1.0);

    this.r = random(8, 16) * this.depth;
    this.buoyancy = random(0.004, 0.01) * this.depth;
    this.drag = lerp(0.998, 0.99, this.depth);

    this.noiseSeed = random(1000);

    this.col = color(random(palette));
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    // 上昇（雪が舞い上がるイメージ）
    this.applyForce(createVector(0, -this.buoyancy));

    // 横揺れ（空気の流れ）
    const n =
      noise(this.noiseSeed, frameCount * 0.01) - 0.5;
    this.applyForce(createVector(n * 0.015, 0));

    this.vel.add(this.acc);
    this.vel.mult(this.drag);
    this.pos.add(this.vel);

    this.acc.mult(0);
  }

  draw(g) {
    g.push();
    g.translate(this.pos.x, this.pos.y);

    const path = this.getWobblyPath();

    g.noStroke();
    g.fill(this.col);
    g.drawingContext.shadowBlur = 10;
    g.drawingContext.shadowColor = 'white';
    this.drawShape(g, path);

    g.pop();
  }

  drawShape(g, path) {
    g.beginShape();
    for (let p of path) {
      g.vertex(p.x, p.y);
    }
    g.endShape(CLOSE);
  }

  getWobblyPath() {
    const pts = [];
    const steps = 24;

    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * TAU;

      const wobble =
        noise(
          cos(a) + 1 + this.noiseSeed,
          sin(a) + 1,
          frameCount * 0.015
        ) - 0.5;

      const rr = this.r + wobble * 2 * this.depth;

      pts.push({
        x: cos(a) * rr,
        y: sin(a) * rr
      });
    }
    return pts;
  }

  isDead() {
    return this.pos.y < -this.r;
  }
}


function drawUpsideDownTree(g, x, y, size) {
  g.push();
  g.translate(x, y);
  g.scale(1, -1);
  g.translate(0.0, -size * 1.8)

  g.noStroke();

  // 葉（レイヤー）
  const col = color('#4E6C50')
  const r0 = red(col);
  const g0 = green(col);
  const b0 = blue(col);

  g.fill(r0, g0, b0);
  g.triangle(
    0, size * 0.4,
    -size * 0.6, size * 1.8,
    size * 0.6, size * 1.8 
  );
  g.fill(r0 - 10, g0 - 20, b0 - 20);
  g.triangle(
    0, size * 0.4,
    -size * 0.5, size * 1.4,
    size * 0.5, size * 1.4
  );
  g.fill(r0 - 20, g0 - 40, b0 - 40);
  g.triangle(
    0, 0,
    -size * 0.4, size,
    size * 0.4, size
  );

  g.pop();
}
