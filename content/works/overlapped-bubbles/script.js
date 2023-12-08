
let step = 0
const stepMax = 100;
const circleNum = 50;
let rMax;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rMax = min(width, height) / 10;
}

function draw() {
  const W = 100
  const H = 25;
  
  noStroke();

  fill(255, 255, 255, 128);
  drawBlink(W, H, height / W);
  drawRandomCircles(circleNum, rMax);

  if (step >= stepMax) {
    noLoop();
  }
  step++;
}

const drawRandomCircles = (N) => {
  for (let i = 0; i < N; i++) {
    const x = random(0, width);
    const y = random(0, height);
    const r = random(0, rMax);
    const col = random(['#527853', '#F9E8D9', '#F7B787', '#EE7214']);
    fill(col);
    noStroke();
    ellipse(x, y, r);
  }
};

const drawBlink = (W, H, N) => {
  push();
  for (let i = 0; i < N; i++) {
    drawLine(W, H, width / H)
    translate(0, W);
  }
  pop();
}

const drawLine = (W, H, N) => {
  push()
  for (let i = 0; i < N; i++) {
    if (random([true, false])) {
      rect(0, 0, W, H);
      translate(W, 0);
    } else {
      rect(0, 0, H, W);
      translate(H, 0);
    }
  }
  pop();
};
