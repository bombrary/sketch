function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  ang = PI/4;
}

function draw() {
  background(255);

  const N = 100;
  const diag = dist(0, 0, width/2, height/2);

  rectMode(CENTER);
  for (let i = 0; i < N; i++) {
    push();
    {
      const x = random(0, width);
      const y = random(0, height);
      const d = random(0, 20);
      const w = width/4;
      const h = height/4;
      translate(x, y);
      const col = map(dist(x, y, width/2, height/2), 0, diag, 0, 255)
      stroke(col);
      rect(0, 0, w, h);
      translate(d, d);
      drawLines(100, w, h, PI/3, col);
    }
    pop();
  }

  background(0, 0, 255, 32);
  noLoop();
}

const drawLines = (N, W, H, ang, col) => {
  const img = createGraphics(W, H);
  imageMode(CENTER);
  img.stroke(col);

  const distMax = dist(0, 0, W, H);
  for (let i = 0; i < N; i++) {
    const x = map(i, 0, N, -W, 2*W);
    const v = p5.Vector.fromAngle(ang, distMax);
    img.line(x, 0, x + v.x, 0 + v.y);
  }

  image(img, 0, 0)
}
