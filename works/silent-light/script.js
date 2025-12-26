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
uniform vec2 uResolution;

varying vec2 vTexCoord;

float rand(vec2 co){
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  vec4 base = texture2D(uTexture, uv);

  vec2 px = 1.0 / uResolution;
  float blurRadius = 8.0; // ← ボケ量（大きいほどピンボケ）
  vec4 blur = vec4(0.0);
  float total = 0.0;

  for (float a = 0.0; a < 6.28318; a += 1.2566) {
    vec2 offset =
      vec2(cos(a), sin(a)) * blurRadius * px;

    float w = 1.0;
    blur += texture2D(uTexture, uv + offset) * w;
    total += w;
  }
  blur /= total;

  float brightness =
    dot(base.rgb, vec3(0.299, 0.587, 0.114));
  float glowStrength = smoothstep(0.2, 0.8, brightness);
  vec3 color =
    mix(base.rgb, blur.rgb, glowStrength * 0.9);

  float grain =
    rand(uv * uResolution + uTime) - 0.5;
  color += grain * 0.04;

  gl_FragColor = vec4(color, 1.0);
}
`

let bgColor = '#000000';
let palette = [
  '#450693',
  '#8C00FF',
  '#FF3F7F',
  '#FFC400'
];
let bubbles = [];
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

  if (bubbles.length < MAX_FLAKES && random() < 0.6) {
    bubbles.push(new Bubble());
  }

  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].draw(pg);

    if (bubbles[i].isDead()) {
      bubbles.splice(i, 1);
    }
  }

  shader(distortShader);

  distortShader.setUniform("uTexture", pg);
  distortShader.setUniform("uTime", millis() * 0.001);
  distortShader.setUniform("uResolution", [width, height]);

  rect(-width / 2, -height / 2, width, height);
}

class Bubble {
  constructor() {
    this.pos = createVector(
      random(width),
      height + random(50, 150)
    );

    this.vel = createVector(
      random(-0.15, 0.15),
      random(-0.8, -1.4)
    );
    this.col = color(random(palette));
    this.col.setAlpha(150);

    this.acc = createVector(0, 0);

    this.r = random(12, 40);

    this.buoyancy = random(0.016, 0.024);
    this.drag = random(0.98, 0.992);

    this.noiseSeed = random(1000);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    // 浮力（強め）
    this.applyForce(createVector(0, -this.buoyancy));

    // 水流ノイズ
    const n =
      noise(this.noiseSeed, frameCount * 0.01) - 0.5;
    this.applyForce(createVector(n * 0.025, 0));

    // 物理更新
    this.vel.add(this.acc);
    this.vel.mult(this.drag);
    this.pos.add(this.vel);

    this.acc.mult(0);
  }

  draw(g) {
    g.push();
    g.translate(this.pos.x, this.pos.y);

    // === 外側の光（加算的） ===
    g.blendMode(ADD);

    for (let i = 4; i >= 1; i--) {
      let alpha = map(i, 1, 4, 8, 2);
      g.fill(
        red(this.col),
        green(this.col),
        blue(this.col),
        alpha
      );
      g.ellipse(0, 0, this.r * 2 + i * 10);
    }

    // === 中心 ===
    g.fill(
      red(this.col),
      green(this.col),
      blue(this.col),
      120
    );
    g.ellipse(0, 0, this.r * 2);

    g.blendMode(BLEND);
    g.pop();
  }

  isDead() {
    return this.pos.y < -this.r;
  }
}
