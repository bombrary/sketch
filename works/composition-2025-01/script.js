let t = 0;
let pg, pg_back;
let buildings = [];
const palette = [
  '#5A9CB5',
  '#FACE68',
  '#FAAC68',
  '#FA6868',
];

const walkers = [];
const num = 1200;
const life_max = 1200;
const life_min = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);

  pg_back = createGraphics(windowWidth, windowHeight);
  pg_back.colorMode(HSB, 360, 100, 100, 100);
  pg_back.background(0, 0, 0)
  for (let i = 0; i < num; i++) {
    walkers.push(new Walker());
  }


  pg = createGraphics(windowWidth, windowHeight);
  let x = 0;
  while (x < width) {
    buildings.push(new Building(x));
    x += random(20, 40);
  }
  for (let b of buildings) {
    b.draw(pg);
  }
  const snow = new Snow();
  snow.draw(pg);
}

function draw() {
  pg_back.noStroke();
  pg_back.background(0, 0, 0, 1)
  pg_back.blendMode(ADD);
  for (const w of walkers) {
    const n = noise(w.x * 0.002, w.y * 0.002);
    const angle = n * TAU * 2;
    const weight = map(w.life, 0, life_max, 0.2, 3.5);
    const bright = map(w.life, 0, life_max, 40, 100);

    pg_back.stroke(w.hue, 80, bright, 50);
    pg_back.strokeWeight(weight);
    pg_back.point(w.x, w.y);

    w.update(angle)
  }

  pg_back.blendMode(BLEND);

  background(0);
  image(pg_back, 0, 0);
  image(pg, 0, 0);
}

class Snow {
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height / 3);
    this.size = 50;
    this.maxDepth = 3;
  }

  draw(g) {
    g.push();
    g.translate(this.x, this.y);
    g.stroke(255);
    g.noFill();

    // 6方向に回転して同じ枝を描く
    for (let i = 0; i < 6; i++) {
      g.push();
      g.rotate((TWO_PI / 6) * i);
      this.drawFlake(g, this.size, 4, 0);
      g.pop();
    }

    g.pop();
  }

  drawFlake(g, len, w, depth) {
    if (depth > this.maxDepth) return;

    g.strokeWeight(w);

    // 中心から伸びる主線
    g.line(0, 0, 0, -len);

    // 枝の先へ移動
    g.translate(0, -len);

    // 左右に枝分かれ
    g.push();
    g.rotate(PI / 6);
    g.scale(0.7);
    this.drawFlake(g, len / 1.1, w / 1.5, depth + 1);
    g.pop();

    g.push();
    g.rotate(-PI / 6);
    g.scale(0.7);
    this.drawFlake(g, len / 1.1, w / 1.5, depth + 1);
    g.pop();
  }
}



class Building {
  constructor(x) {
    this.x = x;
    this.w = random(40, 120);
    this.h = random(height * 0.2, height / 3 * 2);
    this.col = color(random(palette));
    this.col.setAlpha(200);
  }

  draw(g) {
    g.push();
    g.noStroke();
    g.fill(this.col);

    // 画面下から生える
    g.rect(
      this.x,
      height - this.h,
      this.w,
      this.h
    );

    g.pop();
  }
}

class Walker {
  constructor() {
    this.init()
  }

  init() {
    this.vx = random(-0.2, 0.2);
    this.vy = random(-0.2, 0.2);
    this.x = random(width);
    this.y = random(height);
    this.life = random(life_min, life_max);
    this.hue = random(0, 60);
  }

  update(angle) {
    this.vx += 0.001 * cos(angle);
    this.vy += 0.001 * sin(angle);
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;

    if (this.life <= 0) {
      this.init()
    }
  }
}
