"use strict";

let palette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  palette = ['#DC3535', '#212121', '#000', '#FFE15D'].map((c) => color(c));
}

function draw() {
  noLoop();
  background(255);

  const t = frameCount / 50;
  const rate = (3 -sqrt(5))/2;

  noStroke();
  const R0 = min(map(width, 0, 720, 0, 100), 100);
  const RMax = max(width, height)
  const rs = [];
  for (let r = R0; r < RMax; r += R0) {
    rs.push(r);
  }

  push();
  translate(width/2, height*rate);
  for (let i = rs.length - 1; i >= 0; i--) {
    fill(lerpColor(palette[0], palette[1], i/rs.length));
    noisyCircle(rs[i], t + rs[i])
  }
  fill(lerpColor(palette[3], palette[0], 0.5));
  noisyCircle(R0/2, t + R0/2)
  pop();


  fill(0);
  const y0 = (1-rate)*height;
  const dy = 30;
  for (let y = y0; y < height; y += dy) {
    fill(lerpColor(palette[0], palette[2], map(y, y0, height, 0.25, 1.0)));
    rect(0, y, width, dy);
  }
}

const noisyCircle = (R, offset) => {
  beginShape();
  bezierArc(R, -PI/6*5, -PI/6);
  const N = 100;
  for (let i = 0; i < N; i++) {
    const ang = map(i, 0, N, -PI/6, PI/6);
    const dx = map(noise(i*0.025, offset), 0, 1, -R, R);
    const x = R*cos(ang) + sin(i/N*PI)*dx;
    const y = R*sin(ang);
    vertex(x, y);
  }
  bezierArc(R, PI/6, PI/6*5);
  for (let i = N-1; i >= 0; i--) {
    const ang = map(i, 0, N, PI/6*7, PI/6*5);
    const dx = map(noise(i*0.025, offset), 0, 1, -R, R);
    const x = R*cos(ang) + sin(i/N*PI)*dx;
    const y = R*sin(ang);
    vertex(x, y);
  }
  endShape(CLOSE);
};

const bezierArc = (r, startAngle, endAngle) => {
  const ang = endAngle - startAngle;
  const kappa = 4/3*tan(ang/4)*r;
  const x1 = r*cos(startAngle);
  const y1 = r*sin(startAngle);
  const x2 = r*cos(endAngle);
  const y2 = r*sin(endAngle);

  const cx1 = x1 - kappa*sin(startAngle);
  const cy1 = y1 + kappa*cos(startAngle);
  const cx2 = x2 + kappa*sin(endAngle);
  const cy2 = y2 - kappa*cos(endAngle);

  vertex(x1, y1);
  bezierVertex(cx1, cy1, cx2, cy2, x2, y2);
};
