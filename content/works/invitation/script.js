const PHI = 1.6180339;
let W, H;


function setup() {
  createCanvas(windowWidth, windowHeight);

  W = width;
  while (PHI * W > height) {
    W /= PHI;
  }
  H = PHI * W;
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
  img.background(255);
  img.rectMode(CENTER);

  const r = 50;
  const R = 200;
  const th = random(0, TWO_PI);

  img.stroke(0);

  [...Array(10)].forEach((_, i) => {
    const s = random(0.5, 1.5);

    img.push();
    img.translate(width / 2, height / 2);
    img.scale(s, s);
    img.rotate(th);

    [...Array(10)].forEach((_, i) => {
      const rr = r / (i + 1)
      img.circle(0, 0, 2*rr);
    });

    img.noFill();
    img.circle(0, r-R, 2*R);
    img.circle(0, R-r, 2*R);
    img.pop();
  });

  return img;
}

function drawOverlay() {
  const img = createGraphics(width, height);
  img.background(0);

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
