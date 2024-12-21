const PHI = 1.6180339;
let yellowCol;
let palette0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  yellowCol = color('#FFF574');
  palette0 = ['#343131', '#A04747', '#D8A25E', '#E85C0D'].map((c) => color(c));
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
  img.noStroke();

  drawBackground(img);
  drawCloud(img);
  drawMoon(img);

  return img;
}

function drawBackground(img) {
  img.background('#80BCBD');
}

function drawCloud(img) {
  const l = 2;
  const density = 250;
  const N = Math.floor(height / l);
  const M = Math.floor(width / l);
  [...Array(N)].forEach((_, i) => {
    [...Array(M)].forEach((_, j) => {
      const y = map(i, 0, N, 0, height);
      const x = map(j, 0, M, 0, width);
      const mag = noise(x / density, y / density);
      const col = color(255);
      col.setAlpha(map(convertMag(mag), 0, 1, 0, 255));
      img.fill(col);
      img.rect(x, y, l, l);
    });
  });
}

function drawMoon(img) {
  const X = random(0, width / 2);
  const Y = random(0, height / 2);
  const r = 50;
  const R = 200;
  const th = random(0, TWO_PI);
  const img0 = createGraphics(width, height);
  const s = random(0.5, 1.5);

  img0.push();
  {
    img0.noStroke();
    img0.translate(X, Y);
    img0.scale(s, s);
    img0.rotate(th);

    img0.fill(yellowCol);
    img0.circle(0, r-R, 2*R);
    img0.drawingContext.globalCompositeOperation = 'destination-in';
    img0.circle(0, R-r, 2*R);

    img0.drawingContext.globalCompositeOperation = 'source-over';
    [...Array(10)].forEach((_, i) => {
      const rr = r / (i + 1)
      const col = random(palette0);
      img0.fill(col);
      img0.circle(0, 0, 2*rr);
    });
  }
  img0.pop();

  img.image(img0, 0, 0);
}

function convertMag(mag) {
  return mag * mag * mag;
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
