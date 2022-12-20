"use strict";

const depthMax = 20;
let palette;
let rectLen, rectSep;

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);

  palette = ['#DC3535', '#FFE15D', '#001253'].map((c) => color(c));

  rectLen = min(width, height) / depthMax * 1.1;
  rectSep = rectLen / 11;
}

function draw() {
  background(0);
  rectMode(CENTER);
  noStroke();

  translate(width/2, height/2);

  const angles = Array.from({ length: 20 }).map((_, i) => i / 20 * TWO_PI);
  shuffle(angles, true);

  for (let i = 0; i < 10; i++) {
    const x = random(-width/2, width/2);
    const y = random(-height/2, height/2);
    const cols = shuffle(palette);

    drawShapesAt(x, y, 0.5, cols, angles);
  }
  filter(BLUR, 2);
  drawShapesAt(0, 0, 1, palette.slice(0, 2), angles);

  noLoop();
}

const drawShapesAt = (x, y, sc, cols, angles) => {
  push();
  translate(x, y);
  scale(sc);
  angles.forEach((angle) => drawShape(angle, cols));
  pop();
}

const drawShape = (rot, cols) => {
  push();
  rotate(rot);
  rec(0, 0, 0, 1, cols, () => {
    rect(0, 0, rectLen, rectLen);
  }, 0);
  pop();
}


const rec = (x, y, r, sc, cols, drawFunc, depth) => {
  if (depth < depthMax) {
    const t = depth / depthMax;

    translate(x, y);
    rotate(r);
    scale(sc);

    fill(lerpColor(cols[0], cols[1], t));
    drawFunc();

    rec(rectLen + rectSep, 0, random(-PI/6, PI/6), 0.9, cols, drawFunc, depth + 1);
  }
};
