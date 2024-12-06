const paletteCode0 = [
  '#EB5B00',
  '#F5F0CD',
  '#FBD288',
];
const palette0 = []

const paletteCode1 = [
  '#0A7373',
  '#FF81D0',
  '#F2C335',
];
const palette1 = []

const circlesNum = 200;
const circlesDiamMin = 30;
const circlesDiamMax = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);

  paletteCode0.forEach((code) => {
    const col = color(code);
    palette0.push(col);
  })

  paletteCode1.forEach((code) => {
    const col = color(code);
    palette1.push(col);
  })
}

function makeColors(palette, N) {
  let prev = random(palette);
  const result = [];
  [...Array(N)].forEach((_, i) => {
    const colors = [];
    [...Array(palette.length)].forEach((_, i) => {
      if (palette[i] != prev) {
        colors.push(palette[i]);
      }
    });
    const col = random(colors)
    result.push(col);
    prev = col;
  });
  return result;
}

function draw() {
  background(palette0[palette0.length - 1]);

  const R = sqrt(width * width + height * height);
  const X = random(0, width);
  const Y = random(0, height);
  const N = 10;
  const colors = makeColors(palette0, N);
  [...Array(N)].forEach((_, i) => {
    const col = colors[i];
    const th0 = TWO_PI / N * i;
    const th1 = TWO_PI / N * (i + 1);
    noStroke();
    fill(col);
    arc(X, Y, 2*R, 2*R, th0, th1);
  });

  [...Array(circlesNum)].forEach((_, i) => {
    const x = random(0, width);
    const y = random(0, height);
    const d = dist(x, y, X, Y);

    const diam = map(d, 0, R, circlesDiamMin, circlesDiamMax);
    const col = random(palette1);

    fill(col);
    col.setAlpha(128);

    myCircle(x, y, diam);
  });

  noLoop();
}

function myCircle(x, y, diam) {
  const r = diam / 2.0;
  const N = random([3, 4, 5]);
  push();
  translate(x, y);

  const type = random([0, 1, 2])
  beginShape();

  [...Array(N)].forEach((_, i) => {
    const fact = random(0, 1);
    const x1 = fact * r * cos(TWO_PI / N * i);
    const y1 = fact * r * sin(TWO_PI / N * i);
    vertex(x1, y1);
  });

  endShape(CLOSE);
  pop();
}
