const points = [];
const palette = ['#04364A', '#176B87', '#64CCC5', '#DAFFFB']
let step = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(random(palette));
}

function draw() {
  const N = 10;
  push();
  const W = random(width / 8, width / 2);
  const H = random(height / 8, height / 2);
  const x = random(0, width);
  const y = random(0, height);
  const ang = random(-PI, PI);
  translate(x, y);
  rotate(ang);
  drawRectArea(N, W, H);
  pop();

  if (step >= 100) {
    noLoop();
  } else {
    step++;
  }
}

class Shape {
  constructor(x, y, containerWidth, containerHeight, members) {
    this.pos = createVector(x, y);
    this.r = 0;
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    this.members = members
  }

  isContained() {
    return this.pos.x - this.r >= 0 && this.pos.x + this.r < this.containerWidth &&
           this.pos.y - this.r >= 0 && this.pos.y + this.r < this.containerHeight
  }

  isOverlapped() {
    for (const other of this.members) {
      if (other === this) continue;
      if (this.pos.dist(other.pos) < this.r + other.r) {
        return true
      }
    }
    return false;
  }
}

const drawRectArea = (N, W, H) => {
  noFill();
  noStroke();
  fill(random(palette))
  rect(0, 0, W, H);

  const shapes = [];
  const iterMax = 500;
  for (let i = 0; i < iterMax; i++) {
    if (i % 10 == 0) {
      for (let j = 0; j < N; j++) {
        shapes.push(positionShape(W, H, shapes));
      }
    }
    for (const shape of shapes) {
      if (shape.isContained() && !shape.isOverlapped()) {
        shape.r += 1;
      }
    }
  }

  for (const shape of shapes) {
    fill(random(palette))
    ellipse(shape.pos.x, shape.pos.y, 2*shape.r);
  }
}

const positionShape = (W, H, shapes) => {
  while (true) {
    const x = random(0, width/2);
    const y = random(0, height/2);

    const shape = new Shape(x, y, W, H, shapes)
    if (shape.isOverlapped()) {
      continue
    }

    return shape
  }
};
