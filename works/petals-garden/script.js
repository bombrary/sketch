const flowerPalette = [
  "#5A9CB5", // ピンク
  "#FACE68", // クリーム
  "#FAAC68", // ミント
  "#FA6868"  // ライトブルー
];

const bgColor = "#001F3D";
const flowers = [];
const num = 1000;
const petals = [];


class Petal {
  constructor(x, y, angle, size, col, depth, windSeed) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.size = size;
    this.col = col;
    this.depth = depth;
    this.windSeed = windSeed;
    this.spin = random(-0.03, 0.03);
    this.alpha = 100;
  }

  update() {
    const t = constrain(map(this.y, height, 0, 0, 1), 0, 1);

    const riseSpeed = lerp(3.0, 0.8, t);
    this.y -= riseSpeed;

    this.angle += this.spin * 0.5;
    this.alpha = lerp(100, 0, t);

    return (this.y < -80 || this.alpha < 2);
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    noStroke();
    const c = color(this.col);
    c.setAlpha(this.alpha);
    fill(c);

    const s = this.size * this.depth;
    ellipse(0, 0, s * 0.9, s * 0.4);
    pop();
  }
}

class Flower {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height, height * 3);
    this.baseX = this.x;

    this.type = "round"; // 分離処理は round のみ対応（必要なら他にも実装可）

    this.size = random(10, 20);
    this.petals = int(random(5, 8));

    this.col1 = color(random(flowerPalette));
    this.col2 = color(random(flowerPalette));

    this.depth = random(0.5, 1.4);

    this.angle = random(TAU);
    this.spin = random(-0.01, 0.01);

    this.speed = random(0.3, 1.4);
    this.windSeed = random(1000);

    this.petalAngles = [];
    for (let i = 0; i < this.petals; i++) {
      this.petalAngles.push((TAU / this.petals) * i);
    }
  }

  update() {
    const t = constrain(map(this.y, height, 0, 0, 1), 0, 1);

    const riseSpeed = lerp(3.2, 0.6, t);
    this.y -= riseSpeed;

    const windStrength = lerp(160, 30, t);
    const wind = noise(frameCount * 0.002, this.windSeed) * 2 - 1;

    this.x = this.baseX + wind * windStrength * this.depth;

    this.angle += this.spin * lerp(1.2, 0.3, t);
    this.alpha = lerp(100, 0, t);

    // 花びら分離判定
    if (
      this.petalAngles.length > 2 && 
      this.alpha > 40 &&
      random() < 0.005
    ) {
      const idx = floor(random(this.petalAngles.length));
      const pa = this.petalAngles[idx];

      const s = this.size * this.depth;

      const px = this.x + cos(this.angle + pa) * s;
      const py = this.y + sin(this.angle + pa) * s;

      petals.push(
        new Petal(px, py, pa, this.size, this.col1, this.depth, random(1000))
      );

      this.petalAngles.splice(idx, 1);
    }

    if (this.y < -80 || this.alpha < 2) {
      this.reset();
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    const s = this.size * this.depth;

    noStroke();
    const fillCol1 = color(this.col1);
    fillCol1.setAlpha(this.alpha);
    fill(fillCol1);

    for (let a of this.petalAngles) {
      push();
      rotate(a);
      translate(s, 0);
      ellipse(0, 0, s * 0.9, s * 0.4);
      pop();
    }

    const fillCol2 = color(this.col2);
    fillCol2.setAlpha(this.alpha);
    fill(fillCol2);
    circle(0, 0, s * 0.6);

    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noiseDetail(4, 0.5);

  for (let i = 0; i < num; i++) {
    flowers.push(new Flower());
  }
}

function draw() {
  background(color(bgColor));

  flowers.sort((a, b) => a.depth - b.depth);

  for (const f of flowers) {
    f.update();
    f.draw();
  }

  for (let i = petals.length - 1; i >= 0; i--) {
    const p = petals[i];
    if (p.update()) {
      petals.splice(i, 1);
    } else {
      p.draw();
    }
  }
}
