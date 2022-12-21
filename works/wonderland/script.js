"use strict";

const depthMax = 30;
let R;

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  rectMode(CENTER);

  R = min(width/2, height/2);
}

function draw() {
  background(255);

  push();
  translate(0, height);
  drawCircle(20);
  pop();

  push();
  translate(width, 0);
  rotate(PI);
  drawCircle(20);
  pop();

  noLoop();
}

const drawCircle = (rotNum) => {
  for (let i = 0; i < rotNum; i++) {
    const sang = i / rotNum * TWO_PI/4 - TWO_PI/4;
    const eang = (i + 1) / rotNum * TWO_PI/4 - TWO_PI/4;
    const col = color(random(0, 360), 50, 100, 1);
    stroke(col);
    strokeCap(SQUARE);

    const mang = (i + 0.5) / rotNum * TWO_PI/4 - TWO_PI/4;
    const x = R * cos(sang);
    const y = R * sin(mang);
    const weight = R * sin(eang) - R * sin(sang);

    strokeWeight(weight);
    strokeCap(SQUARE);

    const dx = random(width*0.14, width*0.28);
    line(x, y, x + dx, y);

    push();
    translate(x + dx, y);
    fill(col);
    rec(weight, 0, 0, 1, 0);
    pop();
  }

  noStroke();
  fill(0);
  circle(0, 0, 2*R);
}


const rec = (len, dx, rot, s, depth) => {
  if (depth < depthMax) {
    push();
    translate(dx, 0);
    rotate(rot)
    scale(s)

    noStroke();
    square(0, 0, len)

    if (random() < 0.8) {
      rec(len, len, 0, 0.85, depth + 1);
    } else {
      rec(len, len, 0, 0.85, depth + 1);
      rec(len, len, -HALF_PI, 0.85, depth + 1);
    }

    pop();
  }
};
