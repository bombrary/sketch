const points = [];
const palette = ['#711DB0', '#C21292', '#EF4040', '#FFA732'];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(random(palette));
  translate(width / 2, height / 2);
  const R = min(width/2, height/2);
  const N = Math.floor(R / 5);
  const M = Math.floor(R / 10);
  drawCircleArea(N, R, (x, y ,r) => {
    push();
    translate(x, y);
    drawCircleArea(M, r, (x, y, r) => {
      fill(random(palette))
      ellipse(x, y, 2*r);
    });
    pop();
  });
  noLoop();
}

class Shape {
  constructor(x, y, rMax) {
    this.pos = createVector(x, y);
    this.r = 0;
    this.rMax = rMax;
  }

  isOverlapped(shapes) {
    if (this.r >= this.rMax) {
      return true;
    }
    for (const shape of shapes) {
      if (shape === this) continue;
      if (p5.Vector.dist(shape.pos, this.pos) < shape.r + this.r) {
        return true;
      }
    }
    return false;
  }
}

const drawCircleArea = (N, R, drawFunc) => {
  noFill();
  noStroke();
  fill(random(palette))
  ellipse(0, 0, 2*R);

  const shapes = [];
  for (let i = 0; i < N; i++) {
    const ang = random(-PI, PI);
    const r = random(0, R);
    const x = r * cos(ang);
    const y = r * sin(ang);
    const rMax = R - r;
    shapes.push(new Shape(x, y, rMax));
  }

  const iterMax = 100;
  for (let i = 0; i < iterMax; i++) {
    for (const shape of shapes) {
      if (!shape.isOverlapped(shapes)) {
        shape.r += 1;
      }
    }
  }

  for (const shape of shapes) {
    drawFunc(shape.pos.x, shape.pos.y, shape.r)
  }
}
