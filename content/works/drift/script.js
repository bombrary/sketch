const dt = 0.01;
let t = 0;
const bgColor = '#2f343d'
const palette = ['#b7c0cb', '#e4d6df', '#c19297']
const ys = []
const drifts = [];
const T = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(bgColor);
  for (let i = 0; i < 3; i++) {
    const seeds = [random(0, 100), random(0, 100)];
    drifts.push(new Drift(T, palette, random(-PI, PI), seeds));
  }
  for (let i = 0; i < 2; i++) {
    const seeds = [random(0, 100), random(0, 100)];
    drifts.push(new Drift(T, [bgColor], random(-PI, PI), seeds));
  }
}

class Drift {
  constructor(T, palette, phi, seeds) {
    const x0 = map(sin(t/T * TWO_PI + phi), -1, 1, 0, width);
    const y = random(0, height);
    this.pos = createVector(x0, y);
    this.posPrev = createVector(x0, y);
    this.palette = palette;
    this.seeds = seeds;
    this.T = T
    this.H = random(0, height/2);
    this.phi = phi
  }

  updatePos(t) {
    this.posPrev = this.pos.copy();
    this.pos.x = map(sin(t/this.T * TWO_PI + this.phi), -1, 1, -0.1, width + 0.1) 
    if (this.pos.x < 0 || this.pos.x > width) {
      this.pos.y = random(0, height);
      this.H = random(0, height/2);
      this.pos.x = map(sin(t/this.T * TWO_PI + this.phi), -1, 1, 0, width)
    }
  }

  draw() {
    const w = abs(this.pos.x - this.posPrev.x);
    const h1 = noise(t, this.seeds[0]) * this.H;
    const h2 = noise(t, this.seeds[1]) * this.H;

    push();
    translate(this.pos.x, this.pos.y);
    const col = random(this.palette);
    stroke(col);
    fill(col);
    rect(0, -h1, w, h2);
    pop();
  }
}


function draw() {
  noStroke();
  rectMode(CENTER);

  for (const drift of drifts) {
    drift.draw();
    drift.updatePos(t);
  }

  t += dt;
}
