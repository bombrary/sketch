const PHI = 1.6180339;
let yellowCol;
let yellowPalette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  yellowPalette = ['#FF4545', '#FF9C73', '#FBD288', '#FCF596'].map((c) => color(c));
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
  img.background("#441752");
  img.noStroke();

  const L = 1000;
  [...Array(L)].forEach((_, i) => {
    const x = random(0, width);
    const y = random(0, height);
    const r = random(1, 2);
    const col = color(random(0, 360), 100, 100);

    img.fill(col);

    img.push();
    img.translate(x, y);
    img.circle(0, 0, 2*r);
    img.pop();
  });

  const l = 2;
  const densityX = 500;
  const densityY = 250;
  const N = Math.floor(height / l);
  const M = Math.floor(width / l);
  const col = color("#D8C4B6");
  [...Array(N)].forEach((_, i) => {
    [...Array(M)].forEach((_, j) => {
      const y = map(i, 0, N, 0, height);
      const x = map(j, 0, M, 0, width);
      const mag = noise(x / densityX, y / densityY);
      col.setAlpha(map(mag * mag * mag, 0, 1, 0, 255));
      img.fill(col);
      img.rect(x, y, l, l);
    });
  });

  const X = random(0, width / 2);
  const Y = random(0, height / 2);
  const R = min(width, height) / 20;

  const N1 = 10;
  [...Array(N1)].forEach((_, i) => {
    const r = map(i, 0, N1, R, R/4);
    img.push();
    img.drawingContext.shadowBlur = 100;
    img.drawingContext.shadowColor = color(255);
    img.fill(random(yellowPalette));
    img.translate(X, Y)
    myCircle(img, 0, 0, r);
    img.pop();
  });

  return img;
}

function myCircle(img, x, y, r) {
  const N = 50;
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
