let cols;
let N, M;
let R, r;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = [color('rgb(23, 10, 39)'), 
          color('rgb(111, 89, 163)'),
          color('rgb(255, 255, 255)')]

  frameRate(10);
  blendMode(BLEND);

  R = 50;
  r = 20;
  N = Math.floor(height / R);
  M = Math.floor(width / R);

  noiseDetail(8, 0.65);
  noStroke();
}

function draw() {
  background(cols[0]);

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      const [x, y] = hexCoordinate(i, j);
      const rate = noise(x, y, frameCount);

      colorMode(RGB);
      const col = lerpColor3(cols[0], cols[1], cols[2], rate);
      fill(col);

      const val = rate*20;
      colorMode(HSB, 360, 100, 100);
      drawingContext.shadowColor = color(col);
      drawingContext.shadowBlur = val;
      hexagon(x, y, r);
    }
  }
}

const lerpColor3 = (c1, c2, c3, rate) => {
  if (rate < 0.5) {
    return lerpColor(c1, c2, 2*rate);
  } {
    return lerpColor(c2, c3, 2*(rate - 0.5));
  }
};

const hexagon = (x, y, rad) => {
  const v = createVector(0, -rad);
  const N = 6;
  push();
  translate(x, y);
  beginShape()
  for (let i = 0; i < N; i++) {
    vertex(v.x, v.y);
    v.rotate(TWO_PI/N);
  }
  endShape(CLOSE);
  pop();
};

const hexCoordinate = (i, j) => {
  const x = i % 2 == 0 ? j * sqrt(3) * R
                       : j * sqrt(3) * R + sqrt(3)/2 * R;
  const y = i * 1.5 * R;
  return [x, y];
}
