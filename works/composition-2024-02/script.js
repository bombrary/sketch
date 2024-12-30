const PHI = 1.6180339;
let W, H;
let palette0, palette1;


function setup() {
  createCanvas(windowWidth, windowHeight);

  palette0 = ["#294B29", "#50623A", "#789461", "#DBE7C9"].map(e => color(e));
  palette1 = ["#640D5F", "#D91656", "#EE66A6", "#FFEB55"].map(e => color(e));
  palette2 = ["#243642", "#387478", "#629584", "#E2F1E7"].map(e => color(e));

  W = width;
  while (PHI * W > height) {
    W /= PHI;
  }
  H = PHI * W;
}

function draw() {
  const bgImg = createGraphics(width, height);
  drawTrippedImg(bgImg);

  const mainImg = createGraphics(width, height);
  drawLandscape(mainImg);
  drawWindow(mainImg);

  image(bgImg, 0, 0);
  image(mainImg, 0, 0);

  const grain = generateGrainImg(-255, 255);
  image(grain, 0, 0);

  noLoop();
}

const drawLandscape = (img) => {
  img.background('#80BCBD');

  drawSun(
    img,
    random(0, width / 2 - W / 2),
    random(0, height / 3 * 2),
    random(100, 200),
  );
  drawSun(
    img,
    random(width / 2 + W / 2, width),
    random(0, height / 3 * 2),
    random(100, 200),
  );

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
}

const drawSun = (img, X, Y, R) => {
  const M = 10;
  [...Array(M)].forEach((_, i) => {
    const r = map(i, 0, M, R, R/4);
    const col = random(palette1);
    img.fill(col);
    img.noStroke();

    img.push();
    img.translate(X, Y)
    img.circle(0, 0, 2*r);
    img.pop();
  });
};

const drawWindow = (img) => {
  const SEP = 10;
  const W1 = W / 2 - SEP;
  const H1 = H / 2 - SEP;

  img.push();
  img.translate(width / 2, height / 2);

  img.drawingContext.shadowBlur = 50;
  img.drawingContext.shadowColor = 'white';
  img.erase();
  img.rect(-W/2, -H/2, W1, H1);
  img.rect(SEP/2, -H/2, W1, H1);
  img.rect(-W/2, SEP/2, W1, H1);
  img.rect(SEP/2, SEP/2, W1, H1);

  img.pop();
  img.noErase();
  img.noLoop();
}

const drawTrippedImg = (img) => {
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
      let R = dist(0, 0, width/2, height/2);
      const N = 100;

      [...Array(N)].forEach((_, i) => {
        const col = random(palette2);
        const r = map(i, 0, N, R, R/10);
        img.noStroke();
        img.fill(col);
        img.push();
        img.translate(X, Y);
        img.circle(0, 0, 2*r);
        img.pop();
      });
    });

    img.noFill();
    img.circle(0, r-R, 2*R);
    img.circle(0, R-r, 2*R);
    img.pop();
  });
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
