const paletteCode = [
 '#640D5F',
 '#D91656',
 '#EE66A6',
 '#FFEB55',
];
const palette = []

const circlesNum = 200;
const circlesDiamMin = 10;
const circlesDiamMax = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);

  paletteCode.forEach((code) => {
    const col = color(code);
    palette.push(col);
  })
}

function draw() {
  background(palette[palette.length - 1]);

  [...Array(circlesNum)].forEach((_, i) => {
    const x = random(0, width);
    const y = random(0, height);
    const diam = map(y, 0, height, circlesDiamMin, circlesDiamMax);
    const idx = Math.floor(random(0, palette.length - 1));
    const col = palette[idx];

    stroke(col);
    col.setAlpha(128);

    fill(col);
    col.setAlpha(255);

    myCircle(x, y, diam, 0);
  });

  noLoop();
}

function myCircle(x, y, diam, depth) {
  if (depth == 3) {
    return
  }

  const r = diam / 2.0;
  const N = 50;
  push();
  translate(x, y);
  beginShape();
  [...Array(N)].forEach((_, i) => {
    const x1 = r * cos(TWO_PI / N * i);
    const y1 = r * sin(TWO_PI / N * i);
    vertex(x1, y1);
  });
  endShape(CLOSE);

  const M = 5;
  [...Array(M)].forEach((_, i) => {
    const x1 = 1.5 * r * cos(TWO_PI / M * i);
    const y1 = 1.5 * r * sin(TWO_PI / M * i);
    myCircle(x1, y1, diam * 0.5, depth + 1);
  })
  pop();
}
