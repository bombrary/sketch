const PALETTE = [
  { 'fg':
      [
        '#5A9CB5',
        '#FACE68',
        '#FAAC68',
        '#FA6868',
      ],
    'bg': "#211832",
    'blendMode': 'ADD',
  },
  { 'fg':
      [
        '#16697A',
        '#D91656',
        '#EB5B00',
        '#FFB200',
      ],
    'bg': "#F08787",
    'blendMode': 'BLEND',
  }

];
const PALETTE_LEN = PALETTE[0].fg.length;
const bubbles = [ [], [], [], ];
const buildings = [];
const moons = [ [], [], [], ];
const NUM = 300;
let baseImg;
const gGroups = [];
const G_GROUPS_LEN = 2;


class Building {
  constructor(x) {
    this.x = x;
    this.w = random(40, 120);
    this.h = random(height * 0.2, height / 3 * 2);
    this.verts = genVerticies(
      0, 0, this.w, this.h,
      int(random(1, 5)),
      int(random(1, 8)),
      int(random(1, 5)),
      int(random(1, 8)),
    )
    this.noiseSeed = random(1000);
  }

  draw(g) {
    // ゆらぎを入れる
    const newVerts = this.verts.map((v, i) => {
      if (v.y == this.h) return v;

      const dir = p5.Vector.sub(v, createVector(this.w/2, this.h/2));
      dir.normalize();

      const n = noise(this.noiseSeed + i * 0.1, frameCount * 0.01);
      const offset = (n - 0.5) * 100.0;

      return p5.Vector.add(
        v,
        p5.Vector.mult(dir, offset)
      );
    });

    g.push();
    g.translate(this.x, height - this.h);
    g.beginShape();
    for (let v of newVerts) {
      g.vertex(v.x, v.y);
    }
    g.endShape(CLOSE);
    g.pop();
  }
}


class Bubble {
  constructor(layer) {
    this.layer = layer
    this.reset();
  }

  reset() {
    this.colIdx = int(random(0, PALETTE_LEN));
    this.pos = createVector(
      random(width),
      height + random(50, 150)
    );

    this.vel = createVector(
      random(-0.15, 0.15),
      random(-0.8, -1.4)
    );

    this.acc = createVector(0, 0);

    this.r = random(12, 40);
    this.buoyancy = random(0.016, 0.024);

    if (this.layer === "back") {
      this.depth = random(2.0, 3.0);
    } else if (this.layer === "mid") {
      this.depth = random(0.8, 2.0);
    } else {
      this.depth = random(0.4, 0.8);
    }

    this.r *= this.depth;
    this.buoyancy *= this.depth;
    this.drag = lerp(0.995, 0.985, this.depth);

    this.noiseSeed = random(1000);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    // 浮力（強め）
    this.applyForce(createVector(0, -this.buoyancy));

    // 水流ノイズ
    const n =
      noise(this.noiseSeed, frameCount * 0.01) - 0.5;
    this.applyForce(createVector(n * 0.025, 0));

    // 物理更新
    this.vel.add(this.acc);
    this.vel.mult(this.drag);
    this.pos.add(this.vel);

    this.acc.mult(0);
  }

  draw(g, palette) {
    g.noFill();

    const col = color(palette.fg[this.colIdx])
    const alpha = lerp(80, 180, this.depth);
    col.setAlpha(alpha);

    g.stroke(col);
    g.strokeWeight(lerp(0.6, 1.4, this.depth));

    g.beginShape();
    const steps = 50;

    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * TAU;

      const wobble =
        noise(
          cos(a) + 1 + this.noiseSeed,
          sin(a) + 1,
          frameCount * 0.02
        ) - 0.5;

      const rr =
            this.r + wobble * 10 * this.depth;

      g.vertex(
        this.pos.x + cos(a) * rr,
        this.pos.y + sin(a) * rr
      );
    }
    g.endShape(CLOSE);
  }

  isDead() {
    return this.pos.y < -this.r;
  }
}


class Moon {
  constructor(s) {
    this.s = s;
    this.reset();
  }

  reset() {
    this.pos = createVector(
      random(width),
      height + random(50, 150)
    );

    this.vel = createVector(
      random(-0.15, 0.15),
      random(-0.8, -1.4)
    );
    this.colIdx = int(random(0, PALETTE_LEN));

    this.acc = createVector(0, 0);

    this.r = this.s * random(12, 40);

    this.buoyancy = random(0.016, 0.024);
    this.drag = random(0.98, 0.992);

    this.noiseSeed = random(1000);


    this.angle = random(TWO_PI);          // 初期角度
    this.angularVel = random(-0.003, 0.003); // ゆっくり回る
    this.rotationNoiseSeed = random(1000);
  }

  applyForce(f) {
    this.acc.add(f);
  }

  update() {
    // 浮力（強め）
    this.applyForce(createVector(0, -this.buoyancy));

    // 水流ノイズ
    const n =
      noise(this.noiseSeed, frameCount * 0.01) - 0.5;
    this.applyForce(createVector(n * 0.025, 0));

    // 物理更新
    this.vel.add(this.acc);
    this.vel.mult(this.drag);
    this.pos.add(this.vel);

    const rn = noise(
      this.rotationNoiseSeed,
      frameCount * 0.005
    ) - 0.5;

    this.angle += rn * 0.05;

    this.acc.mult(0);
  }

  draw(g, palette) {
    const col = color(palette.fg[this.colIdx]);
    col.setAlpha(140);

    g.push();
    g.translate(this.pos.x + sin(this.angle) * 2,
                this.pos.y + cos(this.angle) * 2);
    g.rotate(this.angle);

    if (palette.blendMode == 'ADD') {
      g.blendMode(ADD);
    } else {
      g.blendMode(BLEND);
    }
    g.noStroke();
    g.fill(col);
    this.drawMoon(g, this.r, 0.5); // ← 月齢
    g.blendMode(BLEND);
    g.pop();
  }

  drawMoon(g, r, phase) {
    // phase: 0.0〜1.0（0.5前後が三日月）
    const steps = 60;
    const offset = r * phase;

    g.beginShape();

    // === 外側の円弧 ===
    for (let i = 0; i <= steps; i++) {
      const a = map(i, 0, steps, -HALF_PI, HALF_PI);
      const x = cos(a) * r;
      const y = sin(a) * r;
      g.vertex(x, y);
    }

    // === 内側の円弧（逆向き） ===
    for (let i = steps; i >= 0; i--) {
      const a = map(i, 0, steps, -HALF_PI, HALF_PI);
      const x = cos(a) * r - offset;
      const y = sin(a) * r;
      g.vertex(x, y);
    }

    g.endShape(CLOSE);
  }

  isDead() {
    return this.pos.y < -this.r;
  }
}

class GraphicsGroup {
  constructor(w, h, palette) {
    this.palette = palette;

    this.bubbles = createGraphics(w, h);
    this.buildings = createGraphics(w, h);
    this.moons = createGraphics(w, h);
    this.fullImg = createGraphics(w, h);

    this.bubbles.pixelDensity(1);
    this.buildings.pixelDensity(1);
    this.moons.pixelDensity(1);
    this.fullImg.pixelDensity(1);
  }

  draw() {
    this.buildings.erase();
    this.buildings.rect(0, 0, width, height);
    this.buildings.noErase();
    drawBuildings(this.buildings);

    drawMoons(this.moons, this.palette);
    drawBubbles(this.bubbles, this.palette);

    const maskedImg = this.bubbles.get();
    maskedImg.mask(this.buildings);
    this.fullImg.image(this.moons, 0, 0);
    this.fullImg.image(maskedImg, 0, 0);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  baseImg = createGraphics(windowWidth, windowHeight);

  const backCount = NUM * 0.10;
  const midCount  = NUM * 0.20;
  const frontCount = NUM * 0.70;

  for (let i = 0; i < backCount; i++) bubbles[0].push(new Bubble("back"));
  for (let i = 0; i < midCount; i++) bubbles[1].push(new Bubble("mid"));
  for (let i = 0; i < frontCount; i++) bubbles[2].push(new Bubble("front"));

  for (let i = 0; i < backCount; i++) moons[0].push(new Moon(3));
  for (let i = 0; i < midCount; i++) moons[1].push(new Moon(2));
  for (let i = 0; i < frontCount; i++) moons[2].push(new Moon(1));

  for (let i = 0; i < G_GROUPS_LEN; i++) gGroups.push(new GraphicsGroup(windowWidth, windowHeight, PALETTE[i]));

  let x = 0;
  while (x < width) {
    buildings.push(new Building(x));
    x += random(20, 40);
  }
}

function draw() {
  for (const group of gGroups) {
    group.draw();
  }

  image(gGroups[0].fullImg, 0, 0);

  baseImg.image(gGroups[1].fullImg, 0, 0);
  baseImg.erase();
  baseImg.quad(
    0, 0,
    width/8 * 5, 0,
    width/8 * 3, height,
    0, height,
  );
  baseImg.noErase();
  image(baseImg, 0, 0);
}


function drawBuildings(g) {
  for (let b of buildings) {
    g.fill(0);
    b.draw(g);
  }
}


function drawMoons(g, palette) {
  g.background(color(palette.bg))
  for (let i = 0; i < 3; i++) {
    for (const e of moons[i]) {
      e.update();
      e.draw(g, palette);
      if (e.isDead()) {
        e.reset()
      }
    }

    if (i == 0) {
      g.filter(BLUR, 4);
    } else if (i == 0) {
      g.filter(BLUR, 1);
    }
  }


  for (let b of buildings) {
    g.stroke('#f5f5f5');
    g.strokeWeight(2);
    g.noFill()
    b.draw(g);
  }
}

function drawBubbles(g, palette) {
  g.background(color(palette.bg))
  for (let i = 0; i < 3; i++) {
    for (const e of bubbles[i]) {
      e.update();
      e.draw(g, palette);
      if (e.isDead()) {
        e.reset()
      }
    }

    if (i == 0) {
      g.filter(BLUR, 4);
    } else if (i == 0) {
      g.filter(BLUR, 1);
    }
  }
}

function genVerticies(
  x0, y0, x1, y1,
  div_above,
  div_right,
  div_below,
  div_left
) {
  const verts = [];

  // === 上辺 (左 → 右) ===
  for (let i = 0; i < div_above; i++) {
    const t = i / div_above;
    verts.push(createVector(lerp(x0, x1, t), y0));
  }

  // === 右辺 (上 → 下) ===
  for (let i = 0; i < div_right; i++) {
    const t = i / div_right;
    verts.push(createVector(x1, lerp(y0, y1, t)));
  }

  // === 下辺 (右 → 左) ===
  for (let i = 0; i < div_below; i++) {
    const t = i / div_below;
    verts.push(createVector(lerp(x1, x0, t), y1));
  }

  // === 左辺 (下 → 上) ===
  for (let i = 0; i < div_left; i++) {
    const t = i / div_left;
    verts.push(createVector(x0, lerp(y1, y0, t)));
  }

  return verts;
}

