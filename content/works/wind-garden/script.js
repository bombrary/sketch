const flowerPalette = [
  "#FE5D26", // ピンク
  "#F2C078", // クリーム
  "#FAEDCA", // ミント
  "#C1DBB3"  // ライトブルー
];

const bgColor = "#FFE6E1";
const flowers = [];
const num = 1000;

class Flower {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height, height * 3);
    this.baseX = this.x;

    this.type = random(["round", "star", "tulip"]);

    this.size = random(6, 20);
    this.petals = int(random(5, 10));

    this.col1 = color(random(flowerPalette));
    this.col2 = color(random(flowerPalette));

    this.depth = random(0.5, 1.4);

    this.angle = random(TAU);
    this.spin = random(-0.01, 0.01);

    this.speed = random(0.3, 1.4);
    this.windSeed = random(1000);
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

    const fillCol1 = color(this.col1)
    fillCol1.setAlpha(this.alpha)
    fill(fillCol1)

    if (this.type === "round") {
      for (let i = 0; i < this.petals; i++) {
        const a = (TAU / this.petals) * i;
        push();
        rotate(a);
        translate(s, 0);
        ellipse(0, 0, s * 0.9, s * 0.4);
        pop();
      }

    } else if (this.type === "star") {
      for (let i = 0; i < this.petals; i++) {
        const a = (TAU / this.petals) * i;
        push();
        rotate(a);
        triangle(0, 0, s, -s * 0.3, s, s * 0.3);
        pop();
      }

    } else if (this.type === "tulip") {
      beginShape();
      vertex(-s * 0.5, 0);
      vertex(0, -s);
      vertex(s * 0.5, 0);
      vertex(0, s * 0.25);
      endShape(CLOSE);
    }

    // 🌸 中心
    const fillCol2 = color(this.col2)
    fillCol2.setAlpha(this.alpha)
    fill(fillCol2)
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

  // 奥→手前で描画
  flowers.sort((a, b) => a.depth - b.depth);

  for (const f of flowers) {
    f.update();
    f.draw();
  }
}
