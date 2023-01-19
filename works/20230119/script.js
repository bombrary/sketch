"use strict";

const colBg = '#FAECD6';
const colFg = '#243763';
let radMax, radMin;
let W, H;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(colBg);

  radMin = min(width/72);
  radMax = min(50, width*0.1);

  H = height/2;
  W = width/8*7;
}

function draw() {
  noLoop();

  rectMode(CENTER);


  push();
  translate(width/2, height/2);

  noStroke();
  fill(colFg);
  rect(0, 0, W, H);


  for (let i = 0; i < 20; i++) {
    const num = random(3);
    if (num < 1) {
      symmetryTriangle();
    } else if(num < 2) {
      symmetryCircle();
    } else {
      symmetryRect();
    }
  }

  pop();
}

const symmetryTriangle = () => {
  const rad = random(radMin, radMax)
  push();
  symmetry(H, () => {
    translate(random(-W/2 + rad , W/2 - rad), random(-H/4, 0));
    rotate(random(0, TWO_PI));
  }, () => {
    triangle(rad*cos(0), rad*sin(0),
             rad*cos(PI/3*2), rad*sin(PI/3*2),
             rad*cos(PI/3*4), rad*sin(PI/3*4));
  });
  pop();
};

const symmetryRect = () => {
  const rad = random(radMin, radMax)
  const len = 2 * rad;
  push();
  symmetry(H, () => {
    translate(random(-W/2 + rad , W/2 - rad), random(-H/4, 0));
    rotate(random(0, TWO_PI));
  }, () => {
    rect(0, 0, len, len)
  });
  pop();
};

const symmetryCircle = () => {
  const rad = random(radMin, radMax)
  push();
  symmetry(H, () => {
    translate(random(-W/2 + rad , W/2 - rad), random(-H/4, 0));
  }, () => {
    circle(0, 0, 2*rad)
  });
  pop();
};

const symmetry = (L, preDrawFunc, drawFunc) => {
  push();
  fill(colFg);
  noStroke();
  translate(0, -L/2);
  preDrawFunc();
  drawFunc();
  pop();

  push();
  fill(colBg);
  translate(0, L/2);
  noStroke();
  preDrawFunc();
  drawFunc();
  pop();
}
