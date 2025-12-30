const flowerPalette = [
  "#3B0270",
  "#6F00FF",
  "#E9B3FB",
  "#FFF1F1",
  "#000000",
  "#CF0F47",
  "#FF0B55",
  "#FFDEDE"
];
const palette = [
  '#5A9CB5',
  '#FACE68',
  '#FAAC68',
  '#FA6868',
];
const bgColor = "#333333";
const flowersBack = [];
const flowersMid = [];
const flowersFront = [];
let buildings = [];
let bubbles = [];
const MAX_BUBBLES = 120;
const num = 500;
let pg, pg_building, pg_back;

class Building {
  constructor(x) {
    this.x = x;
    this.w = random(40, 120);
    this.h = random(height * 0.2, height / 3 * 2);
  }

  draw(g) {
    g.push();
    g.translate(this.x, height - this.h);
    g.rect(0, 0, this.w, this.h);
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


function drawBuildings(g) {
  let x = 0;
  while (x < width) {
    buildings.push(new Building(x));
    x += random(20, 40);
  }
  for (let b of buildings) {
    pg_building.fill(0);
    b.draw(pg_building);
  }
}

class Bubble {
  constructor() {
    this.pos = createVector(
      random(width),
      height + random(50, 150)
    );

    this.vel = createVector(
      random(-0.15, 0.15),
      random(-0.8, -1.4)
    );

    this.acc = createVector(0, 0);

    this.r = random(14, 42);
    this.buoyancy = random(0.016, 0.024);

    this.depth = random(0.3, 1.0);
    this.r *= this.depth;
    this.buoyancy *= this.depth;
    this.drag = lerp(0.995, 0.985, this.depth);

    this.noiseSeed = random(1000);

    // ストライプ用
    this.stripeAngle = random(TAU);
    this.stripeGap = random(5, 9);
    this.stripeCount = int(random(4, 8));
    this.stripePalette = shuffle([...palette]).slice(0, int(random(2, 4)));
    this.stripeColors = [];
    for (let i = 0; i < this.stripeCount; i++) {
      this.stripeColors.push(
        color(this.stripePalette[i % this.stripePalette.length])
      );
    }
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    // 浮力
    this.applyForce(createVector(0, -this.buoyancy));

    // 水流ノイズ
    const n =
      noise(this.noiseSeed, frameCount * 0.01) - 0.5;
    this.applyForce(createVector(n * 0.025, 0));

    this.vel.add(this.acc);
    this.vel.mult(this.drag);
    this.pos.add(this.vel);

    this.acc.mult(0);
  }

  draw(g) {
    g.push();
    g.translate(this.pos.x, this.pos.y);
    g.rotate(this.stripeAngle);

    const path = this.getWobblyPath();

    // === ① ゆらいだ泡でクリップ ===
    g.drawingContext.save();
    g.drawingContext.beginPath();
    g.drawingContext.moveTo(path[0].x, path[0].y);
    for (let p of path) {
      g.drawingContext.lineTo(p.x, p.y);
    }
    g.drawingContext.closePath();
    g.drawingContext.clip();

    // === ② ストライプで中身を塗る ===
    g.noStroke();

    const stripeH = (this.r * 2) / this.stripeCount;

    for (let i = 0; i < this.stripeCount; i++) {
      const col = this.stripeColors[i % this.stripeColors.length];
      col.setAlpha(lerp(200, 255, this.depth));
      g.fill(col);

      g.rect(
        -this.r,
        -this.r + i * stripeH,
        this.r * 2,
        stripeH + 1
      );
    }

    g.drawingContext.restore();

    // === ③ ゆらいだ輪郭を描く ===
    g.noFill();
    g.stroke(0, 50);
    g.strokeWeight(lerp(0.6, 1.2, this.depth));

    g.beginShape();
    for (let p of path) {
      g.vertex(p.x, p.y);
    }
    g.endShape(CLOSE);

    g.pop();
  }

  getWobblyPath() {
    const pts = [];
    const steps = 60;

    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * TAU;

      const wobble =
        noise(
          cos(a) + 1 + this.noiseSeed,
          sin(a) + 1,
          frameCount * 0.02
        ) - 0.5;

      const rr = this.r + wobble * 10 * this.depth;

      pts.push({
        x: cos(a) * rr,
        y: sin(a) * rr
      });
    }

    return pts;
  }

  isDead() {
    return this.pos.y < -this.r;
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
  pg_building = createGraphics(windowWidth, windowHeight);
  pg = createGraphics(windowWidth, windowHeight);

  pixelDensity(1);
  pg_back.pixelDensity(1);
  pg_building.pixelDensity(1);
  pg.pixelDensity(1);

  drawBuildings(pg_building);
}

function draw() {

  pg.background(0);
  if (bubbles.length < MAX_BUBBLES && random() < 0.4) {
    bubbles.push(new Bubble());
  }
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].draw(pg);

    if (bubbles[i].isDead()) {
      bubbles.splice(i, 1);
    }
  }
  for (let b of buildings) {
    pg.stroke(0);
    pg.strokeWeight(2);
    pg.noFill()
    b.draw(pg);
  }

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

  const img_building = pg_back.get();
  img_building.mask(pg_building);
  image(pg, 0, 0);
  image(img_building, 0, 0);
}
