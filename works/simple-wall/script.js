const palette = ['#FDF7E4', '#FAEED1', '#DED0B6', '#BBAB8C'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(random(palette));
}

function draw() {
  const dx = 10;
  const dy = 10;

  for (let x = 0; x < width; x += dx) {
    drawLine(x, 0, x, height);
  }

  for (let y = 0; y < height; y += dy) {
    drawLine(0, y, width, y);
  }
  noLoop();
}

const drawLine = (x0, y0, x1, y1) => {
  const R = 5;
  const v = createVector(x1 - x0, y1 - y0);
  v.normalize();
  const p = createVector(x0, y0);
  fill(random(palette));
  noStroke();

  const getT = (p) => {
    if (x0 == x1) {
      return (p.y + y0) / (y0 + y1)
    } else {
      return (p.x + x0) / (x0 + x1)
    }
  }

  while(getT(p) < 1) {
    const r = random(R/2, R);
    ellipse(p.x, p.y, r);
    p.add(p5.Vector.mult(v, r))
  }
};
