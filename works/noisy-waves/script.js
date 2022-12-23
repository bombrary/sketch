"use strict";

let palettes;
let t;
const waveNum = 5;

function setup() {
  createCanvas(windowWidth, windowHeight);

  const palette1 = ['#49FF00', '#FBFF00', '#FF9300', '#FF0000'];
  const palette2 = ['#4D089A', '#323EDD', '#DC2ADE', '#E8F044'];
  const palette3 = ['#3FC5F0', '#42DEE1', '#6DECB9', '#EEF5B2'];
  const palette4 = ['#2EC1AC', '#3E978B', '#D2E603', '#EFF48E'];
  const palette5 = ['#8C0000', '#BD2000', '#FA1E0E', '#FFBE0F'];
  palettes = shuffle([palette1, palette2, palette3, palette4, palette5]);

  t = 0;
  background(0);
}

function draw() {
  const rad = height / (waveNum - 1) / 2;
  const waves = [];

  for (let i = 0; i < waveNum; i++) {
    const y = i * 2*rad;
    waves.push(...generatePoints(y, rad, 2*rad, 50, palettes[i]));
  }

  push();
  translate(-rad, 0);
  waves.forEach((w) => w.draw());
  pop();

  t += 0.005;
}

class Wave {
  constructor(y, points, col) {
    this.y = y;
    this.points = points;
    this.len = points.length;
    this.color = color(col);
    this.color.setAlpha(10);
  }

  draw() {
    noFill();

    push();
    translate(0, this.y);
    stroke(this.color);

    beginShape();
    curveVertex(this.points[0][0], this.points[0][1]);
    this.points.forEach(([x, y]) => {
      curveVertex(x, y);
    });
    curveVertex(this.points[this.len-1][0], this.points[this.len-1][1]);
    endShape();

    this.points.forEach(([x, y]) => {
      strokeWeight(1);
      point(x, y);
    });
    pop();
  }
}

const generatePoints = (y, a, b, N, palette) => {
  const density = 10;
  const points1 = [];
  const points2 = [];

  for (let j = 0; j < N; j++) {
    const x = j/(N - 1) * width;
    push();

    const t1 = noise(j/density, y, t + 0);
    const t2 = noise(j/density, y, t + 1);

    const ang1 = map(t1, 0, 1, -PI/2, PI/2);
    const ang2 = map(t2, 0, 1, -PI/2, PI/2);

    // NOTE: arc start point is not (a*tan(ang1), b*tan(ang1))
    // NOTE: arc   end point is not (a*tan(ang2), b*tan(ang2))
    const ang3 = atan(a/b*tan(ang1));
    const ang4 = atan(a/b*tan(ang2));

    points1.push([x + a*cos(ang3), b*sin(ang3)]);
    points2.push([x + a*cos(ang4), b*sin(ang4)]);

    pop();
  }

  const wave1 = new Wave(y, points1, random(palette));
  const wave2 = new Wave(y, points2, random(palette));

  return [wave1, wave2];
}
