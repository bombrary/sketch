const D = 15;
let gloI = 0;
let step = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
}

function draw() {
  translate(width/2, height/2);

  const N = 20;
  const H = height / 9;
  const W = width / 4;
  rectMode(CENTER);

  if (step == 0) {
    stroke(0);
    noFill();
    rect(0, 0, W, H);
    step++;
  } else if (step == 1) {
    const x = gloI / N * W;
    const xn = (gloI + 1) / N * W;

    push();
    translate(x - W/2, -H/2);
    drawTree(H, xn - x);
    pop();

    if (gloI > N) {
      step++;
      gloI = 0;
    } else {
      gloI++;
    }
  } else if (step == 2) {
    const x = gloI / N * W;
    const xn = (gloI + 1) / N * W;

    push();
    scale(-1, -1);
    translate(x - W/2, -H/2);
    drawTree(H, xn - x);
    pop();
    if (gloI > N) {
      step++;
    } else {
      gloI++;
    }
  } else {
    noLoop();
  }
}

const drawTree = (h, diam) => {
    push();
    rec(D, h/2, h/2);
    pop()
    fill(255);
    noStroke();
    ellipse(0, 0, diam)
}

const drawRect = (h, w) => {
  rect(0, 0, w, h);

  const N = 20;

  push();
  translate(-w/2, -h/2);
  for (let i = 0; i <= N; i++) {
    const x = i / N * w;

    fill(255);
    push();
    translate(x, 0);
    rec(D, h/2, h/2);
    pop();

    const xn = (i + 1) / N * w;
    noStroke();
    ellipse(x, 0, x - xn)
  }
  pop();

  push();
  translate(-w/2, h/2);
  scale(1, -1);
  for (let i = 0; i <= N; i++) {
    const x = i / N * w;

    fill(255);
    push();
    translate(x, 0);
    rec(D, h/2, h/2);
    pop();

    const xn = (i + 1) / N * w;
    noStroke();
    ellipse(x, 0, x - xn)
  }
  pop();
};

const rec = (depth, len, L) => {
  if (depth == 0) return;
  if (len <= 10) return;

  strokeWeight(map(len, 10, L, 0.5, 5));
  stroke(map(len, 10, L, 255, 0));

  line(0, 0, 0, -len);
  translate(0, -len);
  rotate(random(-PI/6, PI/6));

  // pushの内側にrotateを入れれば対称になる
  rotate(PI/10);
  push();
  rec(depth - 1, len * 0.9, L);
  pop();

  // pushの内側にrotateを入れれば対称になる
  rotate(-PI/10);
  push();
  rec(depth - 1, len * 0.9, L);
  pop();
}
