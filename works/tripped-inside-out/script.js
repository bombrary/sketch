const PHI = 1.6180339;
let W, H;
let palette0, palette1;


function setup() {
  createCanvas(windowWidth, windowHeight);

  palette0 = ["#243642", "#387478", "#629584", "#E2F1E7"].map(e => color(e));
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
      const X = random(0, width);
      const Y = random(0, height);
      const SEP = 10;
      let R = dist(0, 0, width, height);
      const N = 100;

      [...Array(N)].forEach((_, i) => {
        const col = random(palette1);
        const r = map(i, 0, N, R, R/10);
        img.noStroke();
        img.fill(col);
        img.push();
        img.translate(X, Y);
        img.circle(0, 0, r);
        img.pop();
      });
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

  [...Array(10)].forEach((_, i) => {
    const X = random(0, width);
    const Y = random(0, height);
    const SEP = 10;
    let R = dist(0, 0, width, height);
    const N = 100;

    [...Array(N)].forEach((_, i) => {
      const col = random(palette0);
      const r = map(i, 0, N, R, R/10);
      img.noStroke();
      img.fill(col);
      img.push();
      img.translate(X, Y);
      img.circle(0, 0, r);
      img.pop();
    });
  });

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
