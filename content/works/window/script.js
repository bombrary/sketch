const PHI = 1.6180339;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {

  const mainImg = drawMain();
  const overlayImg = drawOverlay();

  image(mainImg, 0, 0);
  image(overlayImg, 0, 0);

  noLoop();
}

function drawMain() {
  const img = createGraphics(width, height);
  img.background(0);

  [...Array(500)].forEach((_, i) => {
    const x = random(0, width);
    const y = random(0, height);
    const r = random(0, 100);
    const col = color('#FCC737');
    col.setAlpha(128);
    img.push();
    img.translate(x, y);
    img.fill(col);
    img.noStroke();
    img.circle(x, y, r);
    img.pop();
  });

  return img;
}

function drawOverlay() {
  const img = createGraphics(width, height);
  img.background(255);

  let W, H;

  W = width;
  while (PHI * W > height) {
    W /= PHI;
  }
  H = PHI * W;

  const SEP = 10;
  const W1 = W / 2 - SEP;
  const H1 = H / 2 - SEP;
  img.push();
  img.translate(width / 2, height / 2);

  img.erase();
  img.rect(-W/2, -H/2, W1, H1);
  img.rect(SEP/2, -H/2, W1, H1);
  img.rect(-W/2, SEP/2, W1, H1);
  img.rect(SEP/2, SEP/2, W1, H1);
  img.pop();
  img.noErase();
  img.noLoop();

  return img;
}
