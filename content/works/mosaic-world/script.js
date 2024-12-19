const PHI = 1.6180339;
let yellowCol;
let palette0;
let palette1;
let palette2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  palette0 = ['#BFECFF', '#CDC1FF', '#FFF6E3', '#FFCCEA'].map((c) => color(c));
  palette1 = ['#FF76CE', '#FDFFC2', '#94FFD8', '#A3D8FF'].map((c) => color(c));
  palette2 = ['#F6D6D6', '#F6F7C4', '#A1EEBD', '#7BD3EA'].map((c) => color(c));
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
  img.colorMode(HSB);

  drawBackground(img);
  drawHistCircle(img);
  drawCloud(img);
  drawMoon(img);

  return img;
}

function drawBackground(img) {
  img.stroke(128);
  const W = 10;
  const H = 10;
  const N = Math.ceil(height / H);
  const M = Math.ceil(width / W);
  [...Array(N)].forEach((_, i) => {
    [...Array(M)].forEach((_, j) => {
      const Y = H * i;
      const X = W * j;
      const col = random(palette1);
      img.push();
      img.fill(col);
      img.translate(X, Y);
      img.rect(0, 0, W, H);
      img.pop();
    });
  });
  img.filter(BLUR, 2);
  img.noStroke();
}

function drawHistCircle(img) {
  const N = 3;
  [...Array(N)].forEach((_, i) => {
    const R = random(width / 4, width / 2);
    const X = random(0, width);
    const Y = random(0, height);
    const W = random(10, 20);
    const M = Math.ceil(TWO_PI * R / W);
    img.push();
    img.translate(X, Y);
    [...Array(M)].forEach((_, j) => {
      const th = map(j, 0, M, 0, TWO_PI);
      const r = random(R/2, R);
      img.push();
      img.rotate(th);
      img.translate(R, 0);
      img.fill(random(palette0));
      img.rect(0, 0, r, W);
      img.pop();
    });
    img.pop();
  });
}

function drawCloud(img) {
  const l = 10;
  const densityX = 500;
  const densityY = 250;
  const N1 = Math.floor(height / l);
  const M1 = Math.floor(width / l);
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
      img.rect(x, y, l, l);
    });
  });
  img.noStroke();
}

function drawMoon(img) {
  const X = random(0, width / 2);
  const Y = random(0, height / 2);
  const R = min(width, height) / 10;

  const N = 10;
  [...Array(N)].forEach((_, i) => {
    const r = map(i, 0, N, R, R/4);
    img.push();
    img.fill(random(palette2));
    img.translate(X, Y)
    myCircle(img, 0, 0, r);
    img.pop();
  });
}

function convert_mag(x) {
  if (x >= 0.5) {
    return 1.0;
  } else {
    return 0.0;
  }
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
