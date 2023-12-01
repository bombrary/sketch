function setup() {
  colorMode(HSB);
  createCanvas(windowWidth, windowHeight);
}

const rec = (x, y, len, drawFunc) => {
  if (len < 1.0) {
    return
  }

  translate(x, y);
  rotate(PI/2);

  const pad = 5;
  const N = 10;
  for (let i = 0; i < N; i++) {
    drawFunc(len, pad*i);
  }

  rec(0, len, len/1.2, drawFunc);
};

const drawFuncs = [
  (len, offset) => { line( offset,  offset,  offset, len-offset) },
  (len, offset) => { line(-offset, -offset,  offset, len-offset) },
  (len, offset) => { line(-offset,  offset, -offset, len-offset) },
  (len, offset) => { line( offset,       0, -offset, len-offset) },
]

function draw() {
  const lenMax = 200;
  const N = 20;
  background(0)
  stroke('#47266e');

  for (let i = 0; i < N; i++) {
  push();
    translate(random(0, width), random(0, height));
    rotate(random(0, TWO_PI));
    const f = random(drawFuncs);
    drawingContext.shadowColor = '#9b68a9';
    drawingContext.shadowBlur = noise(0, 0) * 15.0;
    rec(0, 0, lenMax, f);
  pop();
  }
  noLoop();
}
