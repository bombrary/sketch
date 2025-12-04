const walkers = [];
const num = 1200;
const life_max = 1200;
const life_min = 300;

class Walker {
  constructor() {
    this.init()
  }

  init() {
    this.vx = random(-0.2, 0.2);
    this.vy = random(-0.2, 0.2);
    this.x = random(width);
    this.y = random(height);
    this.life = random(life_min, life_max);
    this.hue = random(180, 300);
  }

  update(angle) {
    this.vx += 0.001 * cos(angle);
    this.vy += 0.001 * sin(angle);
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    if (this.life <= 0) {
      this.init()
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);

  for (let i = 0; i < num; i++) {
    walkers.push(new Walker());
  }

  background(0, 0, 0);
}


function draw() {
  noStroke();
  background(0, 0, 0, 1)

  blendMode(ADD);

  for (const w of walkers) {
    const n = noise(w.x * 0.002, w.y * 0.002);
    const angle = n * TAU * 2;
    const weight = map(w.life, 0, life_max, 0.2, 3.5);
    const bright = map(w.life, 0, life_max, 40, 100);

    stroke(w.hue, 80, bright, 50);
    strokeWeight(weight);
    point(w.x, w.y);

    w.update(angle)
  }

  blendMode(BLEND);
}
