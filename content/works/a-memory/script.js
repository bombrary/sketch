"use strict";

let colBg;
let palette;
let lineDrawer;
let maskImg;
let scrambleCount;

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);

  const paletteBase = ['#61876E', '#A6BB8D', '#EAE7B1'].map((c) => {
    const col = color(c);
    col.setAlpha(128);
    return col;
  });
  palette = duplicate([5,1,1], paletteBase);

  colBg = color('#3C6255');
  scrambleCount = 3;

  maskImg = createGraphics(width, height);
  maskImg.fill(colBg);
  maskImg.noStroke();
  drawHill(maskImg);

  lineDrawer = new LineDrawer();

  background(colBg);
  fill(255, 192);
  noStroke();
  drawCircles(width/8, width/2, 10);
  image(maskImg, 0, 0);
}

function draw() {
  lineDrawer.draw();

  if (lineDrawer.x >= width) {
    if (scrambleCount > 0) {
      scramble();
      scrambleCount--;
    } else {
      noLoop();
    }
  }
}

class LineDrawer {
  constructor() {
    this.x = 0;
  }

  draw() {
    if (this.x >= width) {
      return;
    }
    const y = searchY(maskImg, this.x);
    const weight = random(1, 5);
    const dy = height - y;
    const [r1, r2] = [random(), random()].sort((a, b) => a - b);
    const cx1 = this.x + random(-50, 50);
    const cy1 = y + r1*dy;
    const cx2 = this.x + random(-50, 50);
    const cy2 = y + r2*dy;

    noFill();
    stroke(random(palette));
    strokeWeight(weight);
    bezier(this.x, y, cx1, cy1, cx2, cy2, this.x, height);
    this.x += weight/4;
  }
}

const drawCircles = (rMax, rMin, N) => {
  for (let i = 0; i < N; i++) {
    const x = random(0, width);
    const y = random(0, height);
    const r = random(rMax, rMin);
    circle(x, y, r);
  }
}

const searchY = (maskImg, x) => {
  for (let y = height-1; y >= 0; y--) {
    const [, , , a] = maskImg.get(x, y);
    if (a === 0) {
      return y;
    }
  }
}

const drawHill = (img) => {
  img.beginShape();
  img.vertex(-width/2, height/4*3);
  img.quadraticVertex(width/2, height/2, width/2*3, height/2 + height/8)
  img.vertex(width/2*3, height);
  img.vertex(-width/2, height);
  img.endShape();
}


const scramble = () => {
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (x + y*width)*4;
      const [dx, dy] = [random(-4, 4), random(-4, 4)].map((e) => floor(e));
      if (innerCanvas(x + dx, y + dy)) {
        const j = ((x + dx) + (y + dy)*width)*4;
        if (random() < 0.5) {
          swapPixels(pixels, i, j);
        }
      }
    }
  }
  updatePixels();
};

const swapPixels = (pixels, i, j) => {
  [pixels[i + 0], pixels[j + 0]] = [pixels[j + 0], pixels[i + 0]];
  [pixels[i + 1], pixels[j + 1]] = [pixels[j + 1], pixels[i + 1]];
  [pixels[i + 2], pixels[j + 2]] = [pixels[j + 2], pixels[i + 2]];
  [pixels[i + 3], pixels[j + 3]] = [pixels[j + 3], pixels[i + 3]];
}

const innerCanvas = (x, y) => {
  return 0 <= x && x < width && 0 <= y && y < height;
}

const duplicate = (counts, arr) => {
  const res = [];
  counts.forEach((n, i) => {
    for (let j = 0; j < n; j++) {
      res.push(arr[i]);
    }
  });
  return res;
}
