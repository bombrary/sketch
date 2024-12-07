const paletteCode0 = [
  '#EB5B00',
  '#F5F0CD',
  '#FBD288',
];
const palette0 = []

const paletteCode1 = [
  '#f8b12f',
  '#fae690',
  '#f7fae8'
]
const palette1 = []

const bgColor = "#211a3a";

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
  background(bgColor);

  const R = sqrt(width * width + height * height);
  const X = random(0, width);
  const Y = random(0, height);
  const N = 10;
  const colors = makeColors(palette0, N);
  const SEP = 100;
  const TH = random(-HALF_PI, 0);
  [...Array(N)].forEach((_, i) => {
    const col = colors[i];
    noStroke();
    col.setAlpha(128);
    fill(col);
    push();
    rotate(TH);
    translate(SEP * i, 0);
    rect(0, 0, 2*R, 2*R);
    pop();
  });

  [...Array(circlesNum)].forEach((_, i) => {
    const x = random(0, width);
    const y = random(0, height);

    const d = dist(x, y, X, Y);

    let diam = map(d, 0, R, circlesDiamMin, circlesDiamMax);
    const col = random(palette1);

    const th = atan2(y, x);
    if (HALF_PI + TH < th && th < HALF_PI) {
      col.setAlpha(64);
      diam *= 0.5;
      fill(col);
      myCircle(x, y, diam, [3, 4]);
    } else {
      col.setAlpha(255);
      fill(col);
      myCircle(x, y, diam, [3, 4, 5]);
    }

  });

  noLoop();
}

function myCircle(x, y, diam, Ns) {
  const r = diam / 2.0;
  const N = random(Ns);
  push();
  translate(x, y);

  const type = random([0, 1, 2])

  if (N > 0) {
    beginShape();
    [...Array(N)].forEach((_, i) => {
      const fact = random(0, 1);
      const x1 = fact * r * cos(TWO_PI / N * i);
      const y1 = fact * r * sin(TWO_PI / N * i);
      vertex(x1, y1);
    });
    endShape(CLOSE);
  } else {
    circle(0, 0, diam);
  }

  pop();
}
