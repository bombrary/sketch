const palette = ['#DF826C', '#F8FFD2', '#D0F288', '#8ADAB2']
const palette2 = ['#2E4374', '#5f3c8f', '#2a3aac']
const bg = '#31304D'
const circleBase = '#00001a'

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(bg);

  const baseImg = filterImage(createBaseImage(), (img, x, y) => img.get(x, y));
  image(baseImg, 0, 0);

  const foreImg = createCircleImage()
  erase();
  image(foreImg, 0, 0);

  const foreImgFiltered = filterImage(foreImg, (img, x, y) => {
    const c = color(img.get(x, y));
    if (alpha(c) >= 1e-5) {
      const repCol = new Array(10).fill(null).map(_ => c);
      return random([...repCol, ...palette2]);
    } else {
      return c;
    }
  });
  noErase();
  image(foreImgFiltered, 0, 0);

  noLoop();
}

const createRandomLinesImage = () => {
  const img = createGraphics(width, height);
  const N = 500;
  const R = 20;
  const dr = 0.01;
  for (let i = 0; i < N; i++) {
    let x = random(0, width);
    let y = random(0, height);
    const vx = cos(random(TWO_PI));
    const vy = sin(random(TWO_PI));
    img.noStroke();
    img.fill(random(palette));
    for (let r = random(0, R); r >= dr; r -= dr) {
      x += vx
      y += vy;
      img.ellipse(x, y, r);
    }
  }
  return img;
};

const createCircleImage = () => {
  const img = createGraphics(width, height);
  img.translate(img.width/2, img.height/2);
  img.noStroke();
  img.fill(circleBase);
  const r = max(width/4, height/4);
  img.ellipse(0, 0, r);

  img.textAlign(CENTER);
  img.noStroke();
  img.fill(circleBase);
  img.textSize(128);
  img.text("Hello!", 0, r);

  return img;
};

const createBaseImage = () => {
  const img = createGraphics(width, height);
  img.image(createRandomLinesImage(), 0, 0)
  return img;
}

const filterImage = (baseImg, getCol) => {
  const img = createGraphics(baseImg.width, baseImg.height);
  img.rectMode(CENTER);
  const dy = 3;
  const dx = 3;

  for (let y = 0; y < baseImg.height; y += dy) {
    for (let x = 0; x < baseImg.width; x += dx) {
      img.fill(getCol(baseImg, x, y));
      img.noStroke();
      if (random([true, false])) {
        img.ellipse(x, y, 2);
      } else {
        img.rect(x, y, 2);
      }
    }
  }

  return img;
}
