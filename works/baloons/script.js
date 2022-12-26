"use strict";

let palette;

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);
  background(0);

  // red, purple, yellow, green, blue
  palette = ['#FD8A8A', '#BA94D1', '#FFF89A', '#B6E2A1', '#9ADCFF'];
}

function draw() {
  background(255);
  noLoop();

  const H = min(map(height, 0, 820, 0, 100), 100);

  push();
  translate(width/2, height/2);
  drawRectangle(width/2, H, 10);
  pop();

  overlayNoise();
}

const overlayNoise = () => {
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      const dr = random(-20, 20);
      const dg = random(-20, 20);
      const db = random(-20, 20);
      if (pixels[i + 0] !== 255 ||
          pixels[i + 1] !== 255 ||
          pixels[i + 2] !== 255) {
        pixels[i + 0] += dr;
        pixels[i + 1] += dg;
        pixels[i + 2] += db;
      }
    }
  }
  updatePixels();
}

const drawRectangle = (W, H, N) => {
  const [positions, ws] = generateBars(W, 10);

  push();
  translate(-W/2, -H/2);
  
  for (let i = 0; i < ws.length; i++) {
    const x = positions[i];
    const w = ws[i];
    const col = random(palette);
    const colAlpha = color(col);
    colAlpha.setAlpha(196);
    const xMid = x + w/2;
    const baloon = new Baloon(10, 12, 5);

    push();
    stroke(196);
    line(xMid, H/2, xMid, -H);
    translate(xMid, -H);
    const sc = constrain(map(height, 0, 820, 0, 2), 1, 2);
    scale(sc);
    fill(colAlpha);
    baloon.draw();
    pop();

    noStroke();
    fill(col);
    rect(x, 0, w, H)
  }

  pop();
}

const generateBars = (W, N) => {
  const baseW = W / N;
  const tryMax = 100;

  for (let i = 0; i < tryMax; i++) {
    // Generate
    const positions = Array.from({ length: N + 1 })
                           .map((_, i) => {
                              if (i === 0) {
                                return 0;
                              } else if (i === N) {
                                return W;
                              } else {
                                return random(0, W);
                              }
                            })
                            .sort((a, b) => (a - b));
    const ws = pairDiff(positions);

    // Check
    if (ws.every((e) => e >= baseW/4)) {
      return [positions, ws];
    }
  }

  return [positions, ws];
}

class Baloon {
  constructor(radX, radY, triLen) {
    this.radX = radX;
    this.radY = radY;
    this.triLen = triLen;

    this.width = max(2*radX, triLen);
    this.height = 2*radY + triLen*sqrt(3)/2*0.5;
  }

  draw() {
    const radX = this.radX;
    const radY = this.radY;
    const triLen = this.triLen;
    const yMin = radY;
    const yMax = radY + triLen*sqrt(3)/2*0.5;
    const yMid = (yMin + yMax)/2;

    push();
    noStroke();
    translate(0, -yMid);
    ellipse(0, 0, 2*radX, 2*radY);
    translate(0, radY - triLen*sqrt(3)/2*0.5);
    triangle(0, 0, triLen/2, triLen*sqrt(3)/2, -triLen/2, triLen*sqrt(3)/2);
    pop();
  }
}

const pairDiff = (arr) => {
  const res = [];
  for (let i = 1; i < arr.length; i++) {
    res.push(arr[i] - arr[i-1]);
  }
  return res;
}
