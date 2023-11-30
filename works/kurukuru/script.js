let palette = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  palette = ['#F4EAD5', '#CCD6A6', '#FF9E9E'].map((c) => color(c));
}

const randomColor = () => {
  return random(palette);
}

const drawCircle = (x, y, R, fillCol, strokeCol) => {
  if (R < 1) {
    return
  }

  fill(fillCol)
  stroke(strokeCol)
  circle(x, y, 2*R)

  const ang = random(-PI/2, PI/2);
  const newX = random(0, R/2)*cos(ang) + x;
  const newY = random(0, R/2)*sin(ang) + y;
  const rMax = R - dist(x, y, newX, newY)
  const newR = random(rMax/2, rMax);
  drawCircle(newX, newY, newR, randomColor(), randomColor())
};

function draw() {
  noStroke();
  const N = 10;
  const M = 20;
  const R = min(windowWidth/M, windowHeight/N)/2;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const y = i * windowHeight/N + R;
      const x = j * windowWidth/M + R;
      drawCircle(x, y, R, randomColor(), randomColor());
    }
  }
  noLoop();
}
