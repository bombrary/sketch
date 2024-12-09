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

  const M = 50;
  const SEP = height / M;
  const C0 = color('#000000');
  const C1 = color('#ff0000');
  [...Array(M)].forEach((_, i) => {
    const x = 0;
    const y = SEP * i;
    const col = lerpColor(C0, C1, i / M);
    const h = height - y;
    img.noStroke();
    img.fill(col);
    img.push();
    img.translate(x, y);
    img.rect(0, 0, width, h);
    img.pop();
  });

  const N = 500;
  [...Array(N)].forEach((_, i) => {
    const x = random(0, width);
    const y = random(0, height);
    const r = random(0, 100);
    const col = color('#000000');
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

  const M = 50;
  [...Array(M)].forEach((_, i) => {
    const num = random([0, 1]);
    const spikeLen = random(0, 20);
    switch(num) {
      case 0: {
        const x0 = -W/2;
        const y0 = random(-H/2, -SEP);
        const x1 = -W/2;
        const y1 = random(-H/2, -SEP);
        const x2 = -W/2 - spikeLen
        const y2 = (y0 + y1) / 2;
        img.push();
        if (random([true, false])) {
          img.scale(1, -1);
        }
        img.triangle(x0, y0, x1, y1, x2, y2);
        img.pop();
      }
      case 1: {
        const x0 = SEP/2 + W1;
        const y0 = random(-H/2, -SEP);
        const x1 = SEP/2 + W1;
        const y1 = random(-H/2, -SEP);
        const x2 = SEP/2 + W1 + spikeLen
        const y2 = (y0 + y1) / 2;
        img.push();
        if (random([true, false])) {
          img.scale(1, -1);
        }
        img.triangle(x0, y0, x1, y1, x2, y2);
        img.pop();
      }
    }
  });

  img.noErase();
  img.pop();
  img.noLoop();

  return img;
}
