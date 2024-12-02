const paletteCode = [
 '#FFF4B7',
 '#006A67',
 '#003161',
 '#000B58',
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
  beginShape();

  let isSpiked = false;
  [...Array(N)].forEach((_, i) => {
    let fact = 1.0
    if (!isSpiked) {
      fact = random([2.0, 1.0, 1.0, 1.0, 1.0]);
      isSpiked = true;
    } else {
      isSpiked = false;
    }
    const x1 = fact * r * cos(TWO_PI / N * i);
    const y1 = fact * r * sin(TWO_PI / N * i);
    vertex(x1, y1);
  });
  endShape(CLOSE);
  pop();
}
