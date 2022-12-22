"use strict";

let maskImg, fgImg;
const colorBg = '#242F9B';
const colorFg = '#F1F6F5';
let palette;
let RMax;

function setup() {
  createCanvas(windowWidth, windowHeight);
  maskImg = createGraphics(width, height);
  fgImg = createGraphics(width, height);
  palette = ['#242F9B', '#82C3EC'].map((c) => color(c));
  RMax = width/10;
}

function draw() {
  background('white');

  const [isFound, x] = findX();

  if (isFound) {
    // x1 ---- x ---- x2
    const x1 = searchNeighborLineX(x, -1);
    const x2 = searchNeighborLineX(x, 1);
    const rMax = min(x - x1, x2 - x);
    const r = random(rMax/2, min(rMax, RMax));

    const dy = 2*r + random(r/2, 2*r);
    drawShapesLine(x, dy, () => {
      fgImg.fill(colorFg);
      if (r < 2) {
        fgImg.noStroke();
      } else {
        fgImg.stroke(colorBg);
      }
      fgImg.circle(0, 0, 2*r);
    });
    drawVerticalLine(x, 2*r);
  } else {
    noLoop();
  }

  image(maskImg, 0, 0);
  image(fgImg, 0, 0);
}

const findX = () => {
  const x0 = random(0, width);
  const dx = shuffle([-1, 1]);

  for (let x = x0; x >= 0 && x < width; x += dx[0]) {
    if (!isOverlapped(x)) {
      return [true, x];
    }
  }

  for (let x = x0; x >= 0 && x < width; x += dx[1]) {
    if (!isOverlapped(x)) {
      return [true, x];
    }
  }

  return [false, null];
}

const drawVerticalLine = (x, w) => {
  const t = map(w, 0, RMax, 0, 1)
  const col = lerpColor(palette[0], palette[1], t);
  maskImg.stroke(col);
  maskImg.strokeWeight(w);
  maskImg.line(x, -height, x, height);
}

const searchNeighborLineX = (x0, dx) => {
  let x;
  for (x = x0; x >= 0 && x < width; x += dx) {
    const [, , , a] = maskImg.get(x, 0);
    if (a !== 0) {
      return x;
    }
  }
  return x;
}

const isOverlapped = (x) => {
  const [, , , a] = maskImg.get(x, 1);
  if (a !== 0) return true;
  return false;
}

const drawShapesLine = (x, dy, drawFunc) => {
  fgImg.push();
  fgImg.translate(x, 0);
  for (let y = 0; y < height; y += dy) {
    drawFunc();
    fgImg.translate(0, dy);
  }
  fgImg.pop();
};
