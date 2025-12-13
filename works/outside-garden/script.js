const petalPalette = [
  "#FD7979",
  "#FFCDC9",
  "#FDACAC",
  "#FD7979"
];

const bgColor = "#9CC6DB";
const petals = [];
const num = 500;

class Petal {
  constructor() {
    this.reset();
  }

  reset() {
    // 右側から出現
    this.x = random(width, width * 1.3);
    this.y = random(height);

    // 奥行き（パララックス）
    this.depth = random(0.3, 1.6);

    // サイズと透明度
    this.size = random(10, 28) * this.depth;
    this.alpha = map(this.depth, 0.3, 1.6, 40, 100);

    // 色
    this.col = color(random(petalPalette));
    this.col.setAlpha(this.alpha);

    // 動き
    this.speedX = map(this.depth, 0.3, 1.6, 0.8, 3.2); // 🌬 横方向を強化
    this.speedY = random(-0.3, 0.3);                 // 上下は控えめに増速

    // ゆらぎ用
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
      this.reset();
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    noStroke();
    fill(this.col);

    // 花びら形状（楕円）
    ellipse(0, 0, this.size * 1.2, this.size * 0.5);

    pop();
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noiseDetail(4, 0.5);

  for (let i = 0; i < num; i++) {
    petals.push(new Petal());
  }
}

function draw() {
  background(color(bgColor));

  // 奥 → 手前
  petals.sort((a, b) => a.depth - b.depth);

  for (const p of petals) {
    p.update();
    p.draw();
  }
}
