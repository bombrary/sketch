"use strict";

let cam, img, boxLen;
const board = [];
const [nRow, nCol] = [50, 50];
let rotX, rotY, rotZ;
const samplingNum = 10000;
const variance = 4;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  boxLen = min(min(width, height)/15, 50);

  for (let i = 0; i < nRow; i++) {
    board.push(Array.from({ length: nCol }).map(() => 0));
  }

  for (let i = 0; i < samplingNum; i++) {
    const x = randomGaussian(nCol/2, variance);
    const y = randomGaussian(nRow/2, variance);

    if (0 <= x && x < nCol && 0 <= y && y < nRow) {
      board[floor(y)][floor(x)] += 0.1;
    }
  }

  for (let i = 0; i  < nRow; i += floor(random(3, 5))) {
    for (let j = 0; j < nCol; j++) {
      board[i][j] = 0;
    }
  }

  for (let i = 0; i  < nCol; i += floor(random(3, 5))) {
    for (let j = 0; j < nRow; j++) {
      board[j][i] = 0;
    }
  }

  rotX = -PI/6;
  rotY = PI/6;
  rotZ = 0;

  img = createGraphics(width, height);
}

function draw() {
  background(0);

  push();
  translate(0, 50, -600);
  rotateX(rotX);
  rotateY(rotY);
  rotateZ(rotZ);
  translate(-nRow*boxLen/2, 0, -nRow*boxLen/2);
  drawCity();
  pop();

  push();
  translate(-width/2, -height/2);
  drawImage(img);
  image(img, 0, 0);
  pop();

  noLoop();
}

const drawCity = () => {
  for (let i = 0; i < nRow; i++) {
    for (let j = 0; j < nCol; j++) {
      const x = i * boxLen;
      const z = j * boxLen;

      const v = board[i][j];

      let scX, scZ;
      if (v < 1e-9) {
        fill('black');
        [scX, scZ] = [1, 1];
      } else {
        fill('lightgray');
        [scX, scZ] = [0.9, 0.9];
      }

      push();
      translate(x, 0, z);
      scale(scX, v, scZ);
      translate(0, -boxLen/2, 0)
      box(boxLen);
      pop();
    }
  }
}

const drawImage = (img) => {
  img.noStroke();

  for (let x = 0; x < width; x += random(1, 10)) {
    for (let y = 0; y < height; y += random(1, 20)) {
      img.fill(128, random(32, 128));
      img.ellipse(x, y, 1, random(2, 10));
    }
  }

  for (let y = 0; y < height; y += random(1, 10)) {
    for (let x = 0; x < width; x += random(1, 20)) {
      img.fill(128, random(32, 128));
      img.ellipse(x, y, random(2, 10), 1);
    }
  }
};
