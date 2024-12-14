const PHI = 1.6180339;
let W, H;
let palette0, palette1;


function setup() {
  createCanvas(windowWidth, windowHeight);

  palette0 = ["#294B29", "#50623A", "#789461", "#DBE7C9"].map(e => color(e));
  palette1 = ["#640D5F", "#D91656", "#EE66A6", "#FFEB55"].map(e => color(e));

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
  img.background('#80BCBD');

  const R = random(100, 200);
  const X = random(width / 2 - W / 2, width / 2 + W / 2);
  const Y = random(height / 2 - H / 2, height / 2 + H / 2);
  const M = 10;
  [...Array(M)].forEach((_, i) => {
    const r = map(i, 0, M, R, R/4);
    const col = random(palette1);
    img.fill(col);
    img.noStroke();

    img.push();
    img.translate(X, Y)
    img.circle(0, 0, r);
    img.pop();
  });

  [...Array(10)].forEach((_, i) => {
    const s = random(0.5, 1.5);

    const N = 50;
    [...Array(N)].forEach((_, i) => {
    const col = random(palette0);
    const y = map(i, 0, N, height / 3 * 2, height)
      img.fill(col);
      img.noStroke();

      img.push();
      img.translate(0, y);
      img.rect(0, 0, width, height / 3);
      img.pop();
    });
  });

  return img;
}

function drawOverlay() {
  const img = createGraphics(width, height);
  img.background(255);

  const SEP = 10;
  const W1 = W / 2 - SEP;
  const H1 = H / 2 - SEP;

  img.push();
  img.translate(width / 2, height / 2);

  img.drawingContext.shadowBlur = 100;
  img.drawingContext.shadowColor = color(128);
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
