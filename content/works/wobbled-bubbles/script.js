let bgColor = '#1B211A';
const palette = [
  '#628141',
  '#8BAE66',
  '#EBD5AB',
];
let bubbles = [];
const MAX_BUBBLES = 120;

function setup() {
  createCanvas(windowWidth, windowHeight);
  bgColor = color(bgColor);
  background(bgColor);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  bgColor.setAlpha(55);
  background(bgColor);

  if (bubbles.length < MAX_BUBBLES && random() < 0.4) {
    const col = random(palette)
    bubbles.push(new Bubble(col));
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
  constructor(col) {
    this.col = color(col);
    this.pos = createVector(
      random(width),
      height + random(50, 150)
    );

    this.vel = createVector(
      random(-0.15, 0.15),
      random(-0.8, -1.4)
    );

    this.acc = createVector(0, 0);


    this.r = random(12, 40);
    this.buoyancy = random(0.016, 0.024);

    this.depth = random(0.3, 1.0); // 奥〜手前
    this.r *= this.depth;
    this.buoyancy *= this.depth;
    this.drag = lerp(0.995, 0.985, this.depth);

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

  draw() {
    noFill();

    const alpha = lerp(80, 180, this.depth);
    this.col.setAlpha(alpha);
    stroke(this.col);
    strokeWeight(lerp(0.6, 1.4, this.depth));

    beginShape();
    const steps = 50;

    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * TAU;

      const wobble =
        noise(
          cos(a) + 1 + this.noiseSeed,
          sin(a) + 1,
          frameCount * 0.02
        ) - 0.5;

      const rr =
            this.r + wobble * 10 * this.depth;

      vertex(
        this.pos.x + cos(a) * rr,
        this.pos.y + sin(a) * rr
      );
    }
    endShape(CLOSE);
  }

  isDead() {
    return this.pos.y < -this.r;
  }
}
