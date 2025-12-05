const walkers = [];
const num = 1200;
const life_max = 1200;
const life_min = 300;

class Walker {
  constructor() {
    this.init();
  }

  init() {
    this.vx = random(-0.2, 0.2);
    this.vy = random(-0.2, 0.2);
    this.x = random(width);
    this.y = random(height);
    this.life = random(life_min, life_max);

    this.hue = random(190, 260);

    this.pulseSeed = random(TAU);
  }

  update(angle) {
    this.vx += 0.05 * cos(angle);
    this.vy += 0.05 * sin(angle);

    this.vx *= 0.97
    this.vy *= 0.97

    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    if (this.life <= 0) {
      this.init();
    }
  }

  draw() {
    const weight = map(this.life, 0, life_max, 0.2, 3.5);

    const pulse = sin(frameCount * 0.02 + this.pulseSeed) * 0.5 + 0.5;
    const bright = map(this.life, 0, life_max, 40, 100) * pulse;

    stroke(this.hue, 80, bright, 10);
    strokeWeight(weight * 4);
    point(this.x, this.y);

    stroke(this.hue, 60, bright, 60);
    strokeWeight(weight);
    point(this.x, this.y);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  pixelDensity(2);
  noiseDetail(5, 0.5);

  for (let i = 0; i < num; i++) {
    walkers.push(new Walker());
  }

  background(220, 80, 5);
}

function draw() {
  noStroke();
  fill(220, 80, 5, 6);
  rect(0, 0, width, height);

  blendMode(ADD);

  for (const w of walkers) {
    const n = noise(w.x * 0.002, w.y * 0.002);
    const angle = n * TAU * 2;

    w.draw();
    w.update(angle);
  }

  blendMode(BLEND);

  stroke(200, 20, 80, 10);
  for (let i = 0; i < 40; i++) {
    point(random(width), random(height));
  }
}
