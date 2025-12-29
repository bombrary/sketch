const flowerPalette = [
  "#001F3D",
  "#ED985F",
  "#F7B980",
  "#E6E6E6",
  "#F3E2D4",
  "#C5B0CD",
  "#415E72",
  "#17313E"
];
const palette = [
  "#001F3D",
  "#ED985F",
  "#F7B980",
  "#E6E6E6",
  "#F3E2D4",
  "#C5B0CD",
  "#415E72",
  "#17313E"
];
const bgColor = "#F5F5F5";
const flowersBack = [];
const flowersMid = [];
const flowersFront = [];
let buildings = [];
const num = 500;
let pg, pg_back;

class Building {
  constructor(x) {
    this.x = x;
    this.w = random(40, 120);
    this.h = random(height * 0.2, height / 3 * 2);
  }

  draw(g) {
    const stripes = int(random(4, 10));
    const vertical = random() < 0.5;

    g.push();
    g.noStroke();
    g.translate(this.x, height - this.h);
    if (vertical) {
      const w = this.w / stripes;
      for (let i = 0; i < stripes; i++) {
        const col = color(random(palette));
        g.fill(col);
        g.rect(i * w, 0, w + 1, this.h);
      }
    } else {
      const h = this.h / stripes;
      for (let i = 0; i < stripes; i++) {
        const col = color(random(palette));
        g.fill(col);
        g.rect(0, i * h, this.w, h + 1);
      }
    }

    g.pop();
  }
}

class Flower {
  constructor(layer) {
    this.layer = layer
    this.reset(this.layer);
  }

  reset(layer) {
    this.x = random(width, width * 1.3);
    this.y = random(height);

    this.type = random(["round", "star", "tulip"]);

    this.size = random(6, 20);
    this.petals = int(random(5, 10));

    this.col1 = color(random(flowerPalette));
    this.col2 = color(random(flowerPalette));

    if (layer === "back") {
      this.depth = random(2.0, 3.0);
    } else if (layer === "mid") {
      this.depth = random(0.8, 2.0);
    } else {
      this.depth = random(0.4, 0.8);
    }

    this.angle = random(TAU);

    this.speedX = map(this.depth, 0.4, 3.0, 0.8, 3.2);
    this.speedY = random(-0.3, 0.3); 
    this.windSeed = random(1000);
    this.angle = random(TAU);
    this.spin = random(-0.01, 0.01);
  }

  update() {
    // 左へ流れる
    this.x -= this.speedX;

    // 風の揺れ（なめらか）
    const sway = noise(frameCount * 0.0025, this.windSeed) - 0.5;
    this.y += sway * map(this.depth, 0.3, 1.6, 0.5, 1.6);

    // わずかな上下移動
    this.y += this.speedY;

    // 回転
    this.angle += this.spin;

    // 画面外でリセット
    if (this.x < -100 || this.y < -100 || this.y > height + 100) {
      this.reset(this.layer);
    }
  }

  draw(g) {
    g.push();
    g.translate(this.x, this.y);
    g.rotate(this.angle);

    const s = this.size * this.depth;

    g.noStroke();
    g.fill(this.col1);

    if (this.type === "round") {
      for (let i = 0; i < this.petals; i++) {
        const a = (TAU / this.petals) * i;
        g.push();
        g.rotate(a);
        g.translate(s, 0);
        g.ellipse(0, 0, s * 0.9, s * 0.4);
        g.pop();
      }
    } else if (this.type === "star") {
      for (let i = 0; i < this.petals; i++) {
        const a = (TAU / this.petals) * i;
        g.push();
        g.rotate(a);
        g.triangle(0, 0, s, -s * 0.3, s, s * 0.3);
        g.pop();
      }
    } else if (this.type === "tulip") {
      g.beginShape();
      g.vertex(-s * 0.5, 0);
      g.vertex(0, -s);
      g.vertex(s * 0.5, 0);
      g.vertex(0, s * 0.2);
      g.endShape(CLOSE);
    }

    g.fill(this.col2);
    g.circle(0, 0, s * 0.6);
    g.pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  const backCount = num * 0.10;
  const midCount  = num * 0.20;
  const frontCount = num * 0.70;

  for (let i = 0; i < backCount; i++) flowersBack.push(new Flower("back"));
  for (let i = 0; i < midCount; i++) flowersMid.push(new Flower("mid"));
  for (let i = 0; i < frontCount; i++) flowersFront.push(new Flower("front"));

  pg_back = createGraphics(windowWidth, windowHeight);

  pg = createGraphics(windowWidth, windowHeight);
  let x = 0;
  while (x < width) {
    buildings.push(new Building(x));
    x += random(20, 40);
  }
  for (let b of buildings) {
    b.draw(pg);
  }
}

function draw() {

  pg_back.background(color(bgColor));
  for (const e of flowersBack) {
    e.update();
    e.draw(pg_back);
  }
  pg_back.filter(BLUR, 4);
  for (const e of flowersMid) {
    e.update();
    e.draw(pg_back);
  }
  pg_back.filter(BLUR, 1);
  for (const e of flowersFront) {
    e.update();
    e.draw(pg_back);
  }

  image(pg_back, 0, 0);
  image(pg, 0, 0);
}

