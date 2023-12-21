function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  ang = PI/4;
}

function draw() {
  background(0);

  const N = 100;

  for (let i = 0; i < N; i++) {
    const x = random(0, width);
    const y = random(0, height);
    const W = random(10, map(y, 0, height, width/4, 10));
    const ang = random(-PI, PI);
    const col = map(y, 0, height, 255, 0);
    push();
    translate(x, y);
    rotate(ang);
    drawEllipseLines(N, W, W, PI/4, col);
    pop();
  }

  noLoop();
}

const drawEllipseLines = (N, W, H, ang, col) => {
  const img = createGraphics(W, H);

  img.stroke(col);
  const distMax = dist(0, 0, W, H);
  for (let i = 0; i < N; i++) {
    const x = map(i, 0, N, -W, 2*W);
    const v = p5.Vector.fromAngle(ang, distMax);
    img.line(x, 0, x + v.x, 0 + v.y);
  }

  img.drawingContext.globalCompositeOperation='destination-in'
  img.noStroke();
  img.ellipse(W/2, H/2, W, H);

  imageMode(CENTER);
  image(img, 0, 0);
}
