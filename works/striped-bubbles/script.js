let bgColor = '#f5f5f5';
const palette = [
  "#001F3D",
  "#ED985F",
  "#F7B980",
  "#E6E6E6",
  "#F3E2D4",
  "#C5B0CD",
  "#415E72",
  "#17313E"
];

let bubbles = [];
const MAX_BUBBLES = 120;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bgColor);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(bgColor);
}

function draw() {
  background(bgColor);

  if (bubbles.length < MAX_BUBBLES && random() < 0.4) {
    bubbles.push(new Bubble());
  }

  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].draw();

    if (bubbles[i].isDead()) {
      bubbles.splice(i, 1);
    }
  }
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

    this.acc = createVector(0, 0);

    this.r = random(14, 42);
    this.buoyancy = random(0.016, 0.024);

    this.depth = random(0.3, 1.0);
    this.r *= this.depth;
    this.buoyancy *= this.depth;
    this.drag = lerp(0.995, 0.985, this.depth);

    this.noiseSeed = random(1000);

    // ストライプ用
    this.stripeAngle = random(TAU);
    this.stripeGap = random(5, 9);
    this.stripeCount = int(random(4, 8));
    this.stripePalette = shuffle([...palette]).slice(0, int(random(2, 4)));
    this.stripeColors = [];
    for (let i = 0; i < this.stripeCount; i++) {
      this.stripeColors.push(
        color(this.stripePalette[i % this.stripePalette.length])
      );
    }
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    // 浮力
    this.applyForce(createVector(0, -this.buoyancy));

    // 水流ノイズ
    const n =
      noise(this.noiseSeed, frameCount * 0.01) - 0.5;
    this.applyForce(createVector(n * 0.025, 0));

    this.vel.add(this.acc);
    this.vel.mult(this.drag);
    this.pos.add(this.vel);

    this.acc.mult(0);
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.stripeAngle);

    const path = this.getWobblyPath();

    // === ① ゆらいだ泡でクリップ ===
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.moveTo(path[0].x, path[0].y);
    for (let p of path) {
      drawingContext.lineTo(p.x, p.y);
    }
    drawingContext.closePath();
    drawingContext.clip();

    // === ② ストライプで中身を塗る ===
    noStroke();

    const stripeH = (this.r * 2) / this.stripeCount;

    for (let i = 0; i < this.stripeCount; i++) {
      const col = this.stripeColors[i % this.stripeColors.length];
      col.setAlpha(lerp(200, 255, this.depth));
      fill(col);

      rect(
        -this.r,
        -this.r + i * stripeH,
        this.r * 2,
        stripeH + 1
      );
    }

    drawingContext.restore();

    // === ③ ゆらいだ輪郭を描く ===
    noFill();
    stroke(0, 50);
    strokeWeight(lerp(0.6, 1.2, this.depth));

    beginShape();
    for (let p of path) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);

    pop();
  }

  getWobblyPath() {
    const pts = [];
    const steps = 60;

    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * TAU;

      const wobble =
        noise(
          cos(a) + 1 + this.noiseSeed,
          sin(a) + 1,
          frameCount * 0.02
        ) - 0.5;

      const rr = this.r + wobble * 10 * this.depth;

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
