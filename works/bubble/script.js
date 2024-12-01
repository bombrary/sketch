const paletteCode = [
 '#F9C0AB',
 '#F4E0AF',
 '#A8CD89',
 '#355F2E',
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

    circle(x, y, diam);
  });

  noLoop();
}
