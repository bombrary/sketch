let bubbles = [];
const MAX_BUBBLES = 120;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(10, 20, 30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(10, 20, 30);
}

function draw() {
  background(10, 20, 30, 55);

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

  draw() {
    noFill();
    stroke(200, 220, 255);
    strokeWeight(1.2);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  isDead() {
    return this.pos.y < -this.r;
  }
}
