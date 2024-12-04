const paletteCode = [
  '#02735E',
  '#03A678',
  '#F27405',
  '#731702',
  '#014040',
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
  rectMode(CENTER);
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

    myCircle(x, y, diam);
  });

  noLoop();
}

function myCircle(x, y, diam) {
  const r = diam / 2.0;
  const N = 50;
  push();
  translate(x, y);

  const M = 5;
  [...Array(M)].forEach((_, i) => {
    const j = Math.floor(random(0, M))
    const th = TWO_PI / M * i;
    myRectangle(r, r, th, diam * 0.5, 1);
  });
  pop();
}

function myRectangle(x, y, th, diam, depth) {
  if (depth >= 5) {
    return
  }
  push()
  rotate(th);
  translate(x, y);
  rect(0, 0, diam, diam);
  pop()

  const M = 4;
  const j = Math.floor(random(0, 4))
  const newTh = TWO_PI / M * j
  myRectangle(diam, diam, newTh, diam * 0.5, depth + 1);
}
