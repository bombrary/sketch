const paletteCode = [
  '#EB5B00',
  '#F5F0CD',
  '#FBD288',
  '#133E87',
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

    myCircle(x, y, diam);
  });

  noLoop();
}

function myCircle(x, y, diam) {
  const r = diam / 2.0;
  const N = 50;
  push();
  translate(x, y);
  circle(0, 0, diam);
  const M = Math.floor(random(5, 11));
  [...Array(M)].forEach((_, i) => {
    const th = TWO_PI / M * i;
    const H = diam / 10.0;
    const W = r;
    push();
    rotate(th);
    translate(1.5 * r, -H / 2.0);
    rect(0, 0, W, H);
    pop();
  });
  pop();
}
