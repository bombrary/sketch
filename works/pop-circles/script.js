"use strict";

const depthMax = 5;
let palette;
let xOff, yOff;
let dx, dy;
let R, r;

function setup() {
  createCanvas(windowWidth, windowHeight);

  palette = ['#d92923', '#005994', '#e2d46c'].map((c) => {
    const col = color(c);
    col.setAlpha(196);
    return col;
  });

  xOff = 0;
  yOff = 0;
  R = map(width, 0, 720, 0, 80);
  r = map(width, 0, 720, 0, 10);
  dx = 3*R;
  dy = 3*R;
}

function draw() {
  drawEllipses(xOff, yOff, R, R, r, r, 12, 0);

  xOff += dx;
  if (xOff > 1.5*width) {
    xOff = 0;
    yOff += dy;
  }
  if (yOff > 1.5*height) {
    noLoop();
  }
}

const drawEllipses = (x, y, A, B, a, b, N, depth) => {
  push();
  translate(x, y);
  const n = 3;
  const di = floor(random(0, n));
  const is = Array.from({ length: n })
                  .map((_, i) => i*floor(N/n))
                  .map((i) => (i + di) % N);
  if (depth < depthMax) {
    is.forEach((i) => {
      const ang = i/N * TWO_PI;
      const x = A*cos(ang);
      const y = B*sin(ang);
      const xNext = 1.5*A*cos(ang);
      const yNext = 1.5*B*sin(ang);
      stroke(128);
      line(0, 0, x, y, xNext, yNext);
      drawEllipses(xNext, yNext, A/2, B/2, a/2, b/2, N, depth + 1);
    });
  }

  for (let i = 0; i < N; i++) {
    const angle = i / N * TWO_PI;
    const xSmall = A*cos(angle);
    const ySmall = B*sin(angle);
    push();
    translate(xSmall, ySmall);

    fill(random(palette));
    noStroke();
    ellipse(0, 0, 2*a, 2*b);
    pop();
  }
  pop();
}

