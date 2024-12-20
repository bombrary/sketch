const PHI = 1.6180339;
let yellowCol;
let palette0;
let palette1;
let palette2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  palette0 = ['#DCE4C9', '#F5F5DC', '#B6A28E', '#E07B39'].map((c) => color(c));
  palette1 = ['#FF76CE', '#FDFFC2', '#94FFD8', '#A3D8FF'].map((c) => color(c));
  palette2 = ['#432E54', '#4B4376', '#AE445A', '#E8BCB9'].map((c) => color(c));
}

function draw() {
  const mainImg = drawMain();
  const overlayImg = drawOverlay();

  image(mainImg, 0, 0);
  image(overlayImg, 0, 0);

  const grain = generateGrainImg(-255, 255);
  image(grain, 0, 0);

  noLoop();
}

function drawMain() {
  const img = createGraphics(width, height);

  drawBackground(img);
  drawCloud(img);
  drawMoon(img);

  return img;
}

function drawBackground(img) {
  img.background(0);
}

function drawCloud(img) {
  const L = 5;
  const densityX = 500;
  const densityY = 250;
  const N1 = Math.floor(height / L);
  const M1 = Math.floor(width / L);
  const strokeCol = color(255);
  [...Array(N1)].forEach((_, i) => {
    [...Array(M1)].forEach((_, j) => {
      const y = map(i, 0, N1, 0, height);
      const x = map(j, 0, M1, 0, width);
      const col = random(palette0);
      const mag = noise(x / densityX, y / densityY);
      col.setAlpha(map(convert_mag(mag), 0, 1, 0, 255));
      strokeCol.setAlpha(map(convert_mag(mag), 0, 1, 0, 255));
      img.fill(col);
      img.stroke(strokeCol);
      img.rect(x, y, L, L);
    });
  });
  img.noStroke();
}

function drawMoon(img) {
  const img0 = createGraphics(width, height);

  [...Array(50)].forEach((_, i) => {
    const N = 10;
    const X = random(0, width);
    const Y = random(0, height);
    const R = min(width, height) / 10;
    [...Array(N)].forEach((_, i) => {
      const r = map(i, 0, N, R, R/4);
      img0.push();
      img0.fill(random(palette2));
      img0.translate(X, Y)
      myCircle(img0, 0, 0, r);
      img0.pop();
    });
  });

  const L = 5;
  const N1 = Math.floor(height / L);
  const M1 = Math.floor(width / L);
  const strokeCol = color(128);
  [...Array(N1)].forEach((_, i) => {
    [...Array(M1)].forEach((_, j) => {
      const y = map(i, 0, N1, 0, height);
      const x = map(j, 0, M1, 0, width);
      const col = img0.get(x, y);
      img.fill(col);
      if (col.alpha >= 1e-9) {
        strokeCol.setAlpha(255);
      } else {
        strokeCol.setAlpha(0);
      }
      img.stroke(strokeCol);
      img.rect(x, y, L, L);
    });
  });
}

function convert_mag(x) {
  return x * x * x * x;
}

function myCircle(img, x, y, r) {
  const N = 10;
  img.beginShape();
  [...Array(N)].forEach((_, i) => {
    const th = map(i, 0, N, 0, TWO_PI);
    const xx = r * cos(th);
    const yy = r * sin(th);
    img.vertex(xx, yy);
  });
  img.endShape(CLOSE);
}

function drawOverlay() {
  const img = createGraphics(width, height);
  return img;
}

const generateGrainImg = (cMin, cMax) => {
  const img = createGraphics(width, height);

  const d = img.pixelDensity();
  img.loadPixels();
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      for (let k = 0; k < d; k++) {
        for (let l = 0; l < d; l++) {
          const i = 4 * ((y * d + l) * img.width * d + (x * d + k));

          const val = random(0, 128);
          img.pixels[i + 0] = val;
          img.pixels[i + 1] = val;
          img.pixels[i + 2] = val;
          img.pixels[i + 3] = 32;
        }
      }
    }
  }
  img.updatePixels();

  return img;
};
