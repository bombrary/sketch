"use strict";

let fgImg, bgImg;
let starPalette;

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);

  starPalette = ['#DC3535', '#FFE15D', '#82CD47', '#fff'];

  fgImg = createGraphics(width, height);
  bgImg = createGraphics(width, height);
}

function draw() {
  background(0);
  noLoop();

  drawBg(100, 1, 15);
  image(bgImg, 0, 0);
  filter(BLUR, 1);

  drawFg();
  image(fgImg, 0, 0);

  bgImg.clear();
  drawBg(1000, 1, 5);
  image(bgImg, 0, 0);

  drawGrain();
}

const drawFg = () => {
  // Cone Top y_{i}: y_{i} = y_{i-1} + b r0
  // Cone Rad r_{i}: r_{i} = a r_{i-1}
  // Cone Bottom h_{i}: h_{i} = y_{i} + r_{i}
  const a = 3/2;
  const b = 1/3;
  const N = 5;
  let y = 0;
  let r = calcR0(a, b, 0, N);
  const r0 = r;

  const ys = [y];
  const rs = [r];
  for (let i = 0; i <= N+1; i++) {
    y = y + r0/3;
    r *= a;
    ys.push(y);
    rs.push(r);
  }

  for (let i = N+1; i >= 0; i--) {
    const x = width/2;
    const y = ys[i];
    const r = rs[i];
    const rotMax = floor(PI*r)/15;
    drawCone(x, y, r/2, r, rotMax);
  }
}

const calcR0 = (a, b, h0, N) => {
  // binary search
  let lb = 0;
  let ub = height;
  while (abs(lb - ub) >= 1e-9) {
    const mid = (lb + ub) / 2;

    // check
    // i = 0
    const r0 = mid;
    let y = 0;
    let r = r0;
    let h = h0 + r;
    // i = 1, 2, ... , N
    for (let i = 1; i < N; i++) {
      y = y + b*r0;
      r = a*r;
      h = y + r;
    }

    if (h <= height) lb = mid;
    else ub = mid;
  }

  return lb;
}

const drawCone = (x, y, rMin, rMax, rotMax) => {
  const points = [];
  let off = 0;
  for (let j = 0; j <= rotMax; j++) {
    const angle = j / rotMax * PI/3 + PI/3;
    const r = map(noise(y, off), 0, 1, rMin, rMax);
    off += 0.05;
    points.push([r, angle]);
  }

  fgImg.push();
  {
    fgImg.translate(x, y);

    fgImg.noFill();
    fgImg.drawingContext.shadowBlur = 0;
    fgImg.drawingContext.shadowColor = 'black';
    fgImg.drawingContext.shadowOffsetX = 0;
    fgImg.drawingContext.shadowOffsetY = 2;

    points.forEach((point) => {
      fgImg.noFill();
      fgImg.stroke('#4E6C50');
      fgImg.strokeWeight(1);
      fgImg.line(0, 0, ...polarToCart(point));
    });

    drawLight(...points[0],
              ...points[points.length - 1]);
  }
  fgImg.pop();
}

const drawLight = (r1, ang1, r2, ang2) => {
  const lightNum = floor(random(1, 4));

  for (let i = 0; i < lightNum; i++) {
    const r3 = random(0.25, 1) * r1;
    const r4 = random(0.25, 1) * r2;
    const [x1, y1] = polarToCart([r3, ang1]);
    const [x2, y2] = polarToCart([r4, ang2]);
    const [xm, ym] = [(x1 + x2)/2, (y1 + y2)/2 + (r1 + r2)/2*random(0, 0.5)];

    fgImg.drawingContext.shadowColor = 'white';
    fgImg.noFill();

    const col = color(random(starPalette));
    col.setAlpha(128);
    fgImg.stroke(col);

    fgImg.strokeWeight(random(1, 2));

    fgImg.drawingContext.shadowBlur = 10;
    drawBezier2d(fgImg, x1, y1, xm, ym, x2, y2);

    fgImg.drawingContext.shadowBlur = 5;
    drawBezier2d(fgImg, x1, y1, xm, ym, x2, y2);
  }
}

const drawBezier2d = (img, xs, ys, cx, cy, xe, ye) => {
  img.beginShape();
  img.vertex(xs, ys);
  img.quadraticVertex(cx, cy, xe, ye);
  img.endShape();
}



const polarToCart = ([r, ang]) => [r*cos(ang), r*sin(ang)];


const drawBg = (N, rMin, rMax) => {
  bgImg.drawingContext.shadowBlur = 10;
  bgImg.drawingContext.shadowColor = 'white';

  for (let i = 0; i < N; i++) {
    const x = random(0, width);
    const y = random(0, height);

    bgImg.noStroke();
    bgImg.fill(random(starPalette));
    bgImg.circle(x, y, random(rMin,rMax));
  }
};

const drawGrain = () => {
  const amount = 30;
  loadPixels();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (x + y*width)*4;
      const val1 = random(-amount, amount);
      const val2 = random(-amount, amount);
      const val3 = random(-amount, amount);
      pixels[i] += val1;
      pixels[i + 1] += val2;
      pixels[i + 2] += val3;
    }
  }
  updatePixels();
}
