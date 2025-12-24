let bgColor = '#0b1320';
let flakes = [];
const MAX_FLAKES = 180;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(bgColor);

  // === 天井の逆さまの木 ===
  const treeCount = 6;
  for (let i = 0; i < treeCount; i++) {
    const x = (width / (treeCount - 1)) * i;
    drawUpsideDownTree(x, 0, 140);
  }

  if (flakes.length < MAX_FLAKES && random() < 0.6) {
    flakes.push(new Snow());
  }

  for (let i = flakes.length - 1; i >= 0; i--) {
    flakes[i].update();
    flakes[i].draw();

    if (flakes[i].isDead()) {
      flakes.splice(i, 1);
    }
  }
}

class Snow {
  constructor() {
    this.pos = createVector(
      random(width),
      height + random(20, 80)
    );

    this.vel = createVector(
      random(-0.1, 0.1),
      random(-0.4, -0.9)
    );

    this.acc = createVector(0, 0);

    this.depth = random(0.3, 1.0);

    this.r = random(3, 8) * this.depth;
    this.buoyancy = random(0.004, 0.01) * this.depth;
    this.drag = lerp(0.998, 0.99, this.depth);

    this.noiseSeed = random(1000);

    this.col = color(
      random(230, 255),
      random(230, 255),
      random(235, 255),
      random(180, 230)
    );
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

  draw() {
    push();
    translate(this.pos.x, this.pos.y);

    const path = this.getWobblyPath();

    noStroke();
    fill(this.col);

    beginShape();
    for (let p of path) {
      vertex(p.x, p.y);
    }
    endShape(CLOSE);

    pop();
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


function drawUpsideDownTree(x, y, size) {
  push();
  translate(x, y);
  scale(1, -1);
  translate(0.0, -size * 1.8)

  noStroke();

  // 葉（レイヤー）
  fill(40, 80, 100);
  triangle(
    0, size * 0.4,
    -size * 0.6, size * 1.8,
    size * 0.6, size * 1.8 
  );
  fill(30, 60, 80);
  triangle(
    0, size * 0.4,
    -size * 0.5, size * 1.4,
    size * 0.5, size * 1.4
  );
  fill(20, 40, 60);
  triangle(
    0, 0,
    -size * 0.4, size,
    size * 0.4, size
  );

  pop();
}
