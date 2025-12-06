const walkers = [];
const num = 900;
const life_max = 900;
const life_min = 200;

class Walker {
  constructor() {
    this.init();
  }

  init() {
    if (random() < 0.7) {
      this.x = random(width);
      this.y = random(height * 0.7, height);
    } else {
      this.x = random(width);
      this.y = random(height);
    }

    this.vx = random(-0.1, 0.1);
    this.vy = random(-1.2, -0.4);

    this.life = random(life_min, life_max);
    this.hue = random(80, 140);
    this.pulseSeed = random(TAU);
    this.sizeSeed = random(0.6, 1.4);
  }

  update(angle) {
    const wind = sin(frameCount * 0.01 + this.pulseSeed) * 0.04;

    this.vx += wind;
    this.vx += 0.03 * cos(angle);

    this.vy *= 0.98;
    this.vx *= 0.98;

    this.x += this.vx;
    this.y += this.vy;

    if (this.y < -20 || this.x < -20 || this.x > width + 20) {
      this.init();
    }
  }

  draw() {
    const lifeRatio = map(this.y, height, 0, 0.2, 2.8);
    const weight = lifeRatio * this.sizeSeed;

    const pulse = sin(frameCount * 0.03 + this.pulseSeed) * 0.5 + 0.5;
    const bright = map(this.y, height, 0, 40, 90) * pulse;

    stroke(this.hue, 40, bright, 10);
    strokeWeight(weight * 3);
    point(this.x, this.y);

    stroke(this.hue, 80, bright, 50);
    strokeWeight(weight);
    point(this.x, this.y);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  pixelDensity(2);
  noiseDetail(4, 0.6);

  for (let i = 0; i < num; i++) {
    walkers.push(new Walker());
  }

  background(90, 40, 10);
}

function draw() {
  noStroke();
  fill(90, 40, 10, 8);
  rect(0, 0, width, height);

  blendMode(ADD);

  for (const w of walkers) {
    const n = noise(w.x * 0.002, w.y * 0.002);
    const angle = n * TAU * 2;

    w.draw();
    w.update(angle);
  }

  blendMode(BLEND);

  stroke(60, 10, 90, 10);
  for (let i = 0; i < 30; i++) {
    point(random(width), random(height));
  }
}
