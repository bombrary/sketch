"use strict";

let palette, colBg;

function setup() {
  pixelDensity(1);
  createCanvas(windowWidth, windowHeight);

  colBg = color('#FCFFE7');
  palette = ['#D2001A', '#2B3467', '#EF5B0C'].map((c) => 
    lerpColor(color(c), colBg, 0.25)
  );
}

function draw() {
  noLoop();
  background(colBg);

  translate(width/2, height/2);
  noStroke(255);

  let shapeNum = 3;
  const r0 = min(map(width, 0, 720, 0, 100), 100);
  const L = max(width, height);
  const rs = [];
  for (let r = r0; r < L; r += r0) {
    rs.push(r);
  }

  for (let i = 0; i < rs.length; i++) {
    if (i < rs.length - 1) {
      const r0 = rs[i] * cos(TWO_PI / shapeNum / 2);
      const r1 = rs[i + 1] * cos(TWO_PI / (shapeNum + 1) / 2);
      drawRegularShape(rs[i], shapeNum, r1 - r0, rs[i], random(palette));
    }
    shapeNum++;
  }
  
  filterGrain();
}

const drawRegularShape = (R, N, hMax, offset, col) => {
  const edges = Array.from({ length: N }).map((_, i) => {
    const angs = i / N * TWO_PI - HALF_PI;
    const angt = (i + 1) / N * TWO_PI - HALF_PI;
    const xs = R*cos(angs)
    const ys = R*sin(angs);
    const xt = R*cos(angt)
    const yt = R*sin(angt);

    const pos = createVector(xs, ys);
    const vec = createVector(xt - xs, yt - ys);

    return { pos, vec };
  });

  edges.forEach(({ pos, vec }, i) => {
    push();
    translate(pos.x, pos.y);
    rotate(vec.heading());
    drawEdge(vec.mag(), hMax, i + offset, col);
    pop();
  })

}

const drawEdge = (W, hMax, offset, col) => {
  const N = 100;

  const positions = Array.from({ length: N }).map((_, i) => {
    if (i === 0) {
      return { x: 0, y: 0 };
    } else if (i === N - 1) {
      return { x: W, y: 0 };
    } else {
      const t = i / N;
      const x = t * W;
      const y = -noise(i*0.05, 0, offset) * hMax * sin(t*PI);
      return { x, y };
    }
  });

  fill(col);
  beginShape();
  positions.forEach(({x, y}) => {
    vertex(x, y);
  });
  endShape();

  const i = floor(random(1, N-2));
  const r = 0.1*W;
  fill(random(palette));
  circle(positions[i].x, positions[i].y - r, 2*r, 2*r);
}

const filterGrain = () => {
  const cMax = 5;
  const cMin = -5;
  loadPixels();
  for (let y = 0; y < height; y++) {
    const delta = random(cMin, cMax);
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      pixels[i + 0] += delta;
      pixels[i + 1] += delta;
      pixels[i + 2] += delta;
    }
  }
  for (let x = 0; x < width; x++) {
    const delta = random(cMin, cMax);
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      pixels[i + 0] += delta;
      pixels[i + 1] += delta;
      pixels[i + 2] += delta;
    }
  }
  updatePixels();
}
