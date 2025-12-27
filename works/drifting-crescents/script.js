let bgColor = '#211832';
let palette = [
  '#EEA727',
  '#8F0177',
  '#DE1A58',
  '#F4B342'
];
let bubbles = [
  [],
  [],
  [],
];
const MAX_FLAKES = [10, 50, 100];
let pg;

function preload() {
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);
}

function draw() {
  pg.background(bgColor);

  for (let i = 0; i < 3; i++) {
    if (bubbles[i].length < MAX_FLAKES[i] && random() < 0.6) {
      const s = map(i, 0, 2, 3, 1)
      bubbles[i].push(new Bubble(s));
    }
  }

  for (let i = 0; i < 3; i++) {
    for (let j = bubbles[i].length - 1; j >= 0; j--) {
      bubbles[i][j].update();
      bubbles[i][j].draw(pg);

      if (bubbles[i][j].isDead()) {
        bubbles[i].splice(j, 1);
      }
    }
    if (i < 2) {
      pg.filter(BLUR, 5);
    }
  }

  image(pg, 0, 0);
}

class Bubble {
  constructor(s) {
    this.pos = createVector(
      random(width),
      height + random(50, 150)
    );

    this.vel = createVector(
      random(-0.15, 0.15),
      random(-0.8, -1.4)
    );
    this.col = color(random(palette));
    this.col.setAlpha(200);

    this.acc = createVector(0, 0);

    this.r = s * random(12, 40);

    this.buoyancy = random(0.016, 0.024);
    this.drag = random(0.98, 0.992);

    this.noiseSeed = random(1000);


    this.angle = random(TWO_PI);          // 初期角度
    this.angularVel = random(-0.003, 0.003); // ゆっくり回る
    this.rotationNoiseSeed = random(1000);
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

    const rn = noise(
      this.rotationNoiseSeed,
      frameCount * 0.005
    ) - 0.5;

    this.angle += rn * 0.05;

    this.acc.mult(0);
  }

  draw(g) {
    g.push();
    g.translate(this.pos.x + sin(this.angle) * 2,
                this.pos.y + cos(this.angle) * 2);
    g.rotate(this.angle);

    g.blendMode(ADD);
    g.noStroke();
    g.fill(
      red(this.col),
      green(this.col),
      blue(this.col),
      140
    );
    this.drawMoon(g, this.r, 0.5); // ← 月齢
    g.blendMode(BLEND);
    g.pop();
  }

  drawMoon(g, r, phase) {
    // phase: 0.0〜1.0（0.5前後が三日月）
    const steps = 60;
    const offset = r * phase;

    g.beginShape();

    // === 外側の円弧 ===
    for (let i = 0; i <= steps; i++) {
      const a = map(i, 0, steps, -HALF_PI, HALF_PI);
      const x = cos(a) * r;
      const y = sin(a) * r;
      g.vertex(x, y);
    }

    // === 内側の円弧（逆向き） ===
    for (let i = steps; i >= 0; i--) {
      const a = map(i, 0, steps, -HALF_PI, HALF_PI);
      const x = cos(a) * r - offset;
      const y = sin(a) * r;
      g.vertex(x, y);
    }

    g.endShape(CLOSE);
  }

  isDead() {
    return this.pos.y < -this.r;
  }
}
