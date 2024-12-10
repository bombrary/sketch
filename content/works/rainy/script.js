const PHI = 1.6180339;
let W, H;
let bluePalette;
let blueBrushes;
let iterMax = 100;
let brushMax = 100;
let layerFg, layerBg;

const createBrushes = (palette, layer) => {
  const brushes =  Array.from({ length: brushMax }).map(() =>
                     new Brush(layer));
  brushes.forEach((brush) => initBrushRandom(brush, palette));

  return brushes;
}

const initBrushRandom = (brush, palette) => {
  brush.init(random(0, width), random(0, height),
            random(-2, 0), random(0, 2),
            random(0, 10),
            random(palette));
};

class Brush {
  constructor(layer) {
    this.layer = layer;
  }

  init(x, y, vx, vy, r, fillCol) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.rMax = r;
    this.fillCol = fillCol;
    this.t = 0;
  }

  move() {
      this.pos.add(this.vel);
      this.r = this.rMax * ease(this.t);
      this.t += 0.01;
  }

  draw() {
    this.layer.noStroke();
    this.layer.fill(this.fillCol);
    this.layer.circle(this.pos.x, this.pos.y, this.r);
  }
}

const ease = (t) => {
  if (t < 0.5) {
    return ease1(map(t, 0, 0.5, 0, 1));
  } else {
    return ease2(map(t, 0.5, 1, 1, 0));
  }
}

const ease1 = (t) => {
  return -(cos(PI * t) - 1) / 2;
}

const ease2 = (t) => {
  return -(cos(PI * t) - 1) / 2;
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  W = width;
  while (PHI * W > height) {
    W /= PHI;
  }
  H = PHI * W;

  bluePalette = ['#211a3a', '#22458e', '#63beed'].map((c) => color(c));

  layerFg = createGraphics(width, height);
  layerBg = createGraphics(width, height);
}

function draw() {
  drawMain(layerFg);
  drawOverlay(layerBg);

  image(layerFg, 0, 0);
  image(layerBg, 0, 0);
}

function drawMain(img) {
  blueBrushes = createBrushes(bluePalette, img);
  for (let i = 0; i < iterMax; i++) {
    blueBrushes.forEach((brush) => {
      brush.move();
      brush.draw();
      if (brush.t > 1) initBrushRandom(brush, bluePalette);
    });
  }
}

function drawOverlay(img) {
  img.background(255);

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

  img.noErase();
  img.pop();
  img.noLoop();
}
