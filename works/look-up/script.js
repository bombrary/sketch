const PHI = 1.6180339;
let yellowCol;

function setup() {
  createCanvas(windowWidth, windowHeight);
  yellowCol = color('#FFF574');
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
  img.background(0);
  img.noStroke();

  const l = 2;
  const density = 250;
  const N = Math.floor(height / l);
  const M = Math.floor(width / l);
  [...Array(N)].forEach((_, i) => {
    [...Array(M)].forEach((_, j) => {
      const y = map(i, 0, N, 0, height);
      const x = map(j, 0, M, 0, width);
      const mag = noise(x / density, y / density);
      img.fill(map(mag * mag * mag * mag, 0, 1, 0, 255));
      img.rect(x, y, l, l);
    });
  });

  const X = random(0, width / 2);
  const Y = random(0, height / 2);
  const R = min(width, height) / 10;

  img.push();
  img.drawingContext.shadowBlur = 100;
  img.drawingContext.shadowColor = color(255);
  img.fill(yellowCol);
  img.translate(X, Y)
  img.circle(0, 0, R);
  img.pop();

  return img;
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
