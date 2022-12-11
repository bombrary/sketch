let img, gridCircles;
let lightColorBase;

function setup() {
  createCanvas(windowWidth, windowHeight);
  img = noiseOverlay();

  push();
  colorMode(HSB);
  lightColorBase = color('#FFFFD0');
  pop();

  const [N, M] = [3, 3];
  const r = 10;
  const sep = 2;
  const [rectHeight, rectWidth] = [2*r*N, 2*r*M];
  const rectSep = 40;
  const rectRowNum = ceil(height / (rectHeight + rectSep));
  const rectColNum = ceil(width / (rectWidth + rectSep));
  const rectNum = 30;

  const rectNumMax = rectRowNum * rectColNum;
  const indicies = choice(Array.from({ length: rectNumMax })
                              .map((_, i) => i),
                         rectNum);
  gridCircles = indicies
    .map((i) =>{
    const x = (i % rectColNum) * (rectWidth + rectSep);
    const y = floor(i / rectColNum) * (rectHeight + rectSep);
    return new GridCircles(x, y, N, M, r, sep, 20, random(0,100))
  });

}

function draw() {
  background(0);
  gridCircles.map((c) => c.draw());
  image(img, 0, 0);
}

class GridCircles {
  constructor(x, y, N, M, r, sep, period, phase) {
    this.x = x;
    this.y = y;
    this.N = N;
    this.M = M;
    this.r = r;
    this.sep = sep;
    this.period = period
    this.phase = phase;
  }

  draw() {
    push();

    const t = constrain(sin((frameCount - this.phase)/this.period), -0.9, 0.9);
    drawingContext.shadowBlur = map(t, -0.9, 0.9, 0, 10);
    drawingContext.shadowColor = color('white');
    noStroke();
    fill(lightColor(t));

    translate(this.x + this.r + this.sep,
              this.y + this.r + this.sep);
    for(let i = 0; i < this.N; i++) {
      for (let j = 0; j < this.M; j++) {
        const cx = j * (2*this.r + this.sep);
        const cy = i * (2*this.r + this.sep);
        circle(cx, cy, 2*this.r);
      }
    }

    pop();
  }
}

const lightColor = (t) => {
  push();
  colorMode(HSB, 360, 100, 100, 1);
  const col = color(hue(lightColorBase),
                    saturation(lightColorBase),
                    map(t, -1, 1, 0, brightness(lightColorBase)));
  pop();
  return col;
};

const noiseOverlay = () => {
  const img = createGraphics(width, height);
  push();
  colorMode(HSB);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const ct = color(random(0, 360), random(0, 100), random(0, 100), 0.15);
      img.set(i, j, ct);
    }
  }
  pop();
  img.updatePixels();
  return img
}

const choice = (arr, N) => {
  return shuffle(arr).slice(0, N);
}
