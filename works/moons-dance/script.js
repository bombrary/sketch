let grid = []
let gs = [];
const D = 10;
let N, M;
let xDom, yDom;

class Gauss {
  constructor(mu, sig, ro) {
    this.mu = mu;
    this.sig = sig;
    this.ro = ro;

    this.ddmu = createVector(0, 0);
    this.dmu = createVector(0, 0);

    this.c0 = TWO_PI * this.sig.x * this.sig.y * sqrt(1 - this.ro*this.ro);
    this.c1 = -1/2*(1 - this.ro*this.ro);
  }

  func(p) {
    const X = (p.x - this.mu.x) / this.sig.x;
    const Y = (p.y - this.mu.y) / this.sig.y;
    const c2 = X*X + Y*Y - 2*this.ro*X*Y;
    return this.c0 * exp(this.c1*c2);
  }

  update() {
    this.ddmu = createVector(random(-0.01, 0.01), random(-0.01, 0.01));
    this.dmu.add(this.ddmu);
    this.mu.add(this.dmu);

    if (this.mu.x < -xDom || this.mu.x >= xDom) {
      this.dmu.x *= -0.01;
    }
    if (this.mu.y < -yDom || this.mu.y >= yDom) {
      this.dmu.y *= -0.01;
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);

  M = Math.floor(width / D);
  N = Math.floor(height / D);
  for (let i = 0; i < N; i++) {
    grid.push(Array.from({ length: M }).map(() => 0));
  }

  xDom = 10;
  yDom = xDom / M * N;
  gs = Array.from({ length: 10 }).map(() => {
    const mu = createVector(random(-xDom, xDom), random(-yDom, yDom));
    const s = random(0.5, 1);
    const sig = createVector(s, s);
    const ro = 0;
    return new Gauss(mu, sig, ro);
  });
}

function draw() {
  background('#252B48');
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const x = map(j, 0, M-1, -xDom, xDom);
      const y = map(i, 0, N-1, -yDom, yDom);
      let val = 0;
      for (const g of gs) {
        val += g.func(createVector(x, y));
      }
      grid[i][j] = map(val, 0, 1, 0, 255);
    }
  }

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const x = j / M * width;
      const y = i / N * height;
      let col;
      if (grid[i][j] < 0.7) col = '#252B48';
      else col = '#F7E987';

      stroke(col);
      fill(col);
      ellipse(x, y, D/4*3, D/4*3);
    }
  }

  for (const g of gs) {
    g.update();
  }
}

